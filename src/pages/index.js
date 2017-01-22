import Header from '../components/Header';
import React, {
  Component,
  PropTypes,
} from 'react';
import io from 'socket.io-client';

export default class index extends Component {
  componentDidMount () {
    var socket = io('');
    socket.on('connect', function(){});
  }

  render () {
    return (
      <div>
        <Header />
        <textarea name=""
                  id=""
                  cols="30"
                  rows="10"></textarea>
      </div>
    );
  }
}

index.propTypes = {};
index.defaultProps = {};

