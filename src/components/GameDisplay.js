import React, { Component } from 'react';
import Heading from 'grommet/components/Heading';

class GameDisplay extends Component {
  getCompletedText() {
    if (this.props.lineView) {
      return '';
    }
    return this.props.children.slice(0, this.props.index);
  }

  getCurrentText() {
    var idx = this.props.index;
    var text = this.props.children;
    if (text.slice(idx).indexOf(' ') === -1) {
      return text.slice(idx);
    }
    return text.slice(idx, idx + text.slice(idx).indexOf(' '));
  }

  getRemainingText() {
    var idx = this.props.index;
    var text = this.props.children;
    if (text.slice(idx).indexOf(' ') === -1) {
      return '';
    }
    var wordEnd = idx + text.slice(idx).indexOf(' ');
    if (this.props.lineView) {
      return text.slice(wordEnd).split(' ').slice(0, 5).join(' ');
    }
    return text.slice(wordEnd);
  }

  render() {
    return (
      <Heading tag={this.props.lineView ? "h1" : "h2"}>
        {this.getCompletedText()}
        <span className={this.props.error ? "danger" : "highlight"}>
          {this.getCurrentText()}
        </span>
        {this.getRemainingText()}
      </Heading>
    )
  }
}

export default GameDisplay;
