import Header from '../components/Header';
import React, {
  Component,
  PropTypes,
} from 'react';
import io from 'socket.io-client';
import dmpmod from 'diff_match_patch';
import changesets from 'changesets';
import debounce from 'lodash.debounce';

const Changeset = changesets.Changeset;
const dmp = new dmpmod.diff_match_patch();

export default class index extends Component {
  constructor (props, context) {
    super(props, context);
    const me = this;
    this.state = {text: '', lastSyncedText: ''};
    this.socket = io('');
    this.calculateDiff = debounce(this._calculateDiff, 1000);

    this.socket.on('changes', function ({from, changeSetPack}) {
      const changeSet = Changeset.unpack(changeSetPack);
      const updatedText = changeSet.apply(me.state.text);
      me.setState({text: updatedText, lastSyncedText: updatedText});
    });

    this.socket.on('initialization', function ({userId, text}) {
      me.userId = userId;
      me.setState({text, lastSyncedText: text});
      // this.heartBeat();
    });
  }

  heartBeat() {
    //todo:  should just send hash for bandwidth saving
    // this.socket.emit('heartBeat', {from: this.userId, text: this.state.text});
  }

  _calculateDiff () {
    const diff = dmp.diff_main(this.state.lastSyncedText, this.state.text);
    const changeset = Changeset.fromDiff(diff);
    this.socket.emit('changeSet', changeset.pack());

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