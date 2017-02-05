import React, { Component } from 'react';
import Value from 'grommet/components/Value';
import emoji from 'react-easy-emoji'

class GameTimer extends Component {
  render() {
    let elapsed = Math.round(this.props.elapsed  / 100);
    let timer = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    return (
      <Value value={timer}
        icon={emoji('⌚')}
        label='Time'
        size='medium' />
    )
  }
}

export default GameTimer;
