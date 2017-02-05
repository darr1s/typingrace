import React, { Component } from 'react';
import TextInput from 'grommet/components/TextInput';

class GameInput extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     e: ''
  //   }
  // }

  handleChange(e) {
    // this.setState({ value: e });
    if (!this.props.started) {
      this.props.setupIntervals();
    }
    this.props.onInputChange(e);
  };

  render() {
    return (
        <TextInput
          id="game-input"
          type="text"
          placeHolder='Start by typing above text...'
          className={this.props.error ? 'error' : ''}
          value={this.props.value}
          onDOMChange={event => this.handleChange(event.target.value)}
        />
    )
  }
}

export default GameInput;
