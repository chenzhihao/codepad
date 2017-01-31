import Header from '../components/Header';
import React, {
  Component,
  PropTypes,
} from 'react';
import io from 'socket.io-client';
import debounce from 'lodash.debounce';
const utils = require('../utils/utils');
const dmpEngine = utils.dmpEngine;
const Changeset = utils.ChangeSet;

import md5 from 'blueimp-md5';
import events from '../socket/events';

export default class index extends Component {
  constructor (props, context) {
    super(props, context);
    const me = this;
    this.state = {text: '', lastSyncedText: ''};
    this.socket = io('');
    this.calculateDiff = debounce(this._calculateDiff, 1000);

    this.socket.on(events.server.dispatchChangeSet, function ({changeSetPack}) {
      function calCaretPositionShift (changeSet, caretPosition) {
        let caretPositionShift = 0;
        let range = 0;
        for (let i = 0; i < changeSet.length; i++) {
          if (changeSet[i].symbol === '=') {
            range += changeSet[i].length;
          } else if (changeSet[i].symbol === '+') {
            caretPositionShift += changeSet[i].length;
          } else if (changeSet[i].symbol === '-') {
            caretPositionShift -= changeSet[i].length;
          }

          if (range >= caretPosition) {
            return caretPositionShift;
          }
        }

        return caretPositionShift;
      }

      //apply diff between lastSyncedText and serverText
      const changeSet = Changeset.unpack(changeSetPack);
      console.log(changeSet.inspect());
      const serverText = changeSet.apply(me.state.lastSyncedText);

      //calculate diff between localText and serverText
      const diffBetweenLocalAndServer = dmpEngine.diff_main(me.state.text, serverText);
      const changeSetBetweenSeverAndLocal = Changeset.fromDiff(diffBetweenLocalAndServer);

      const textAreaEl = document.querySelector('#code-text-area');
      const caretPosition = textAreaEl.selectionStart;

      me.setState({text: serverText, lastSyncedText: serverText}, function () {
        let modifiedLength = calCaretPositionShift(changeSetBetweenSeverAndLocal, caretPosition);
        textAreaEl.focus;
        textAreaEl.setSelectionRange(modifiedLength + caretPosition, modifiedLength + caretPosition);
      });
    });

    this.socket.on(events.server.clientInitialization, function ({userId, serverText}, callbackToServer) {
      me.userId = userId;
      me.setState({text: serverText, lastSyncedText: serverText});
      callbackToServer({textMd5: md5(me.state.text)});
    });

    this.socket.on(events.server.forceSync, function (text) {
      me.setState({text, lastSyncedText: text});
    });
  }

  heartBeat () {
    // todo:  should just send hash for bandwidth saving
    // this.socket.emit('heartBeat', {from: this.userId, text: this.state.text});
  }

  _calculateDiff () {
    const diff = dmpEngine.diff_main(this.state.lastSyncedText, this.state.text);
    const changeSetPack = Changeset.fromDiff(diff).pack();

    this.socket.emit(events.client.uploadChangeSet, {
      from: this.userId,
      changeSetPack,
      textMd5: md5(this.state.text),
      lastSyncedTextMd5: md5(this.state.lastSyncedText)
    });
  }

  render () {
    return (
      <div>
        <Header />
        <textarea name="code-pad"
                  id="code-text-area"
                  rows="10"
                  style={{width: '100%'}}
                  value={this.state.text}
                  onChange={e => {
                    this.setState({text: e.target.value});
                    this.calculateDiff();
                  }}
        />
      </div>
    );
  }
}

index.propTypes = {};
index.defaultProps = {};
