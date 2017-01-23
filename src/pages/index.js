import Header from '../components/Header';
import React, {
  Component,
  PropTypes,
} from 'react';
import io from 'socket.io-client';

export default class index extends Component {
  componentDidMount () {
    this.socket = io('');
  }

  render () {
    return (
      <div>
        <button onClick={e => {
          this.socket.emit('fromClient', document.querySelector('#text').value);
        }}>test
        </button>
        <Header />
        <textarea name=""
                  id="text"
                  cols="30"
                  rows="10"></textarea>
      </div>
    );
  }
}

index.propTypes = {};
index.defaultProps = {};

