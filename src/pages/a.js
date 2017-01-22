import React from 'react';

export default class MyLuckNo extends React.Component {
  constructor (...args) {
    super(...args);
    this.state = {randomNo: null};
  }

  componentDidMount () {
    this.recalculate();
  }

  recalculate () {
    this.setState({
      randomNo: Math.ceil(Math.random() * 100)
    });
  }

  render () {
    const {randomNo} = this.state;

    if (randomNo === null) {
      return (<p>Please wait..</p>);
    }

    let message;
    if (randomNo < 30) {
      message = 'Do not give up. Try again.';
    } else if (randomNo < 60) {
      message = 'You are a lucky guy';
    } else {
      message = 'You are soooo lucky!';
    }

    return (
      <div>
        <h3>Your Lucky number is: "{randomNo}"</h3>
        <p>{message}</p>
        <button onClick={() => this.recalculate()}>Try Again</button>
      </div>
    );
  }
}
