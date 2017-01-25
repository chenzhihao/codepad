import Header from '../components/Header';
import React, {
  Component,
  PropTypes,
} from 'react';
import io from 'socket.io-client';
import dmpmod from 'diff_match_patch';
import changesets from 'changesets';
import debounce from 'lodash.debounce';
import md5 from 'blueimp-md5';
import events from '../socket/events';

const Changeset = changesets.Changeset;
const dmp = new dmpmod.diff_match_patch();

export default class index extends Component {
  constructor (props, context) {
    super(props, context);
    const me = this;
    this.state = {text: '', lastSyncedText: ''};
    this.socket = io('');
    this.calculateDiff = debounce(this._calculateDiff, 1000);

    this.socket.on(events.server.dispatchChangeSet, function ({from, changeSetPack}) {
      const changeSet = Changeset.unpack(changeSetPack);
      const updatedText = changeSet.apply(me.state.text);
      me.setState({text: updatedText, lastSyncedText: updatedText});
    });

    this.socket.on(events.server.clientInitialization, function ({userId, text}) {
      me.userId = userId;
      me.setState({text, lastSyncedText: text});
      me.socket.emit(events.client.initializationDone, {md5: md5(me.state.text)});
    });
  }

  heartBeat() {
    //todo:  should just send hash for bandwidth saving
    // this.socket.emit('heartBeat', {from: this.userId, text: this.state.text});
  }

  _calculateDiff () {
    const diff = dmp.diff_main(this.state.lastSyncedText, this.state.text);
    const changeset = Changeset.fromDiff(diff);
    this.socket.emit(events.client.uploadChangeSet, changeset.pack());

    this.setState({lastSyncedText: this.state.text});
  }

  render () {
    return (
      <div>
        <Header />
        <textarea name="code-pad"
                  rows="10"
                  style={{width: '100%'}}
                  value={this.state.text}
                  onChange={e => {
                    this.setState({text: e.target.value});
                    this.calculateDiff();
                  }}
        ></textarea>
      </div>
    );
  }
}

index.propTypes = {};
index.defaultProps = {};