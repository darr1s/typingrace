import React, { Component } from 'react';
// import request from 'superagent';
import Sentencer from 'sentencer';
import _ from 'lodash';
import Box from 'grommet/components/Box';
import Columns from 'grommet/components/Columns';
import Value from 'grommet/components/Value';
import GameDisplay from '../components/GameDisplay';
import GameInput from '../components/GameInput';
import GameTimer from '../components/GameTimer';
import emoji from 'react-easy-emoji'

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      error: false,
      errorCount: 0,
      lineView: false,
      timeElapsed: 0,
      value: '',
      startTime: null,
      wpm: 0,
      completed: false,
      excerpt: generateSentenceForStream(1),
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.changeView = this.changeView.bind(this);
    this.setupIntervals = this.setupIntervals.bind(this);
  }

  componentWillMount() {
    this.intervals = [];
  }

  setInterval() {
    this.intervals.push(setInterval.apply(null, arguments));
  }

  handleInputChange(input) {
    // console.log(input);
    if (this.state.completed) {
      return;
    }
    var inputValue = input;
    var index = this.state.index;
    if (this.state.excerpt.slice(index, index + inputValue.length) === inputValue) {
      if (inputValue.slice(-1) === " " && !this.state.error) {
        // handle a space after a correct word
        this.setState({
          index: this.state.index + inputValue.length,
          value: ''
        });
      } else if (index + inputValue.length === this.state.excerpt.length) {
        this.setState({
          value: '',
          completed: true
        }, function() {
          this.calculateWPM();
        });
        this.intervals.map(clearInterval);
      } else {
        this.setState({
          error: false,
          value: inputValue
        });
      }
    } else {
      this.setState({
        error: true,
        value: inputValue,
        errorCount: this.state.error ? this.state.errorCount : this.state.errorCount + 1
      });
    }
  }

  changeView(e) {
    this.setState({ lineView: this.state.lineView ? true : false });
  }

  restartGame() {
  }

  setupIntervals() {
    this.setState({
      startTime: new Date().getTime(),
    }, function() {
      // timer
      this.setInterval(function() {
        this.setState({
          timeElapsed: new Date().getTime() - this.state.startTime
        });
      }.bind(this), 50)
      // WPM
      this.setInterval(function() {
        this.calculateWPM();
      }.bind(this), 1000)
    });
  }

  calculateWPM() {
    var elapsed = new Date().getTime() - this.state.startTime;
    var wpm;
    if (this.state.completed) {
      wpm = this.state.excerpt.split(' ').length / (elapsed / 1000) * 60;
    } else {
      var words = this.state.excerpt.slice(0, this.state.index).split(' ').length;
      wpm = words / (elapsed / 1000) * 60;
    }
    this.setState({
      wpm: this.state.completed ? Math.round(wpm * 10) / 10 : Math.round(wpm)
    });
  }

  render() {
    return (
      <div>
        <Box id='game-wrapper'
          alignContent='center'
          colorIndex='neutral-1'
          pad='large'
          appCentered='true'>
          <GameDisplay
            index={this.state.index}
            error={this.state.error}
            lineView={this.state.lineView}>
            {this.state.excerpt}
          </GameDisplay>
          <GameInput
            onInputChange={this.handleInputChange}
            setupIntervals={this.setupIntervals}
            value={this.state.value}
            started={!!this.state.startTime}
            error={this.state.error} />
        </Box>
        <Box id='game-stats-wrapper'
          alignContent='center'
          colorIndex='neutral-2-a'
          pad='large'
          appCentered='true'>
          <Columns size='small'
            justify='center'>
            <Box align='center'
              pad='large'
              margin='small'
              colorIndex='light-2'
              className={this.state.completed ? "completed" : ""}>
              <GameTimer elapsed={this.state.timeElapsed} />
            </Box>
            <Box align='center'
              pad='large'
              margin='small'
              colorIndex='light-2'
              className={this.state.completed ? "completed" : ""}>
              <Value value={this.state.wpm}
                icon={emoji('💥')}
                label='Words/Min'
                size='medium' />
            </Box>
            <Box align='center'
              pad='large'
              margin='small'
              colorIndex='light-2'
              className={this.state.completed ? "completed" : ""}>
              <Value value={this.state.errorCount}
                icon={emoji('💣')}
                label='Errors'
                size='medium' />
            </Box>
          </Columns>
        </Box>
      </div>
    );
  }
}

// generate sentences synchronously...
// useful for the homepage.
function generate(numberOfSentences) {
  var sentences = "";
  var i = 0;
  for(i; i < numberOfSentences; i++) {
    sentences += capitalizeFirstLetter(randomStartingPhrase() + makeSentenceFromTemplate()) + ".";
    sentences += (numberOfSentences > 1) ? " " : "";
  }
  return sentences;
}

// generate one sentence at a time
// for use in a stream.
function generateSentenceForStream(last) {
  // make a sentence. perhaps it has a starting phrase.
  var phrase = randomStartingPhrase();
  var sentence = capitalizeFirstLetter( phrase + makeSentenceFromTemplate() ) + ".";
  // add a space if it's not the last one
  sentence += ((last) ? "" : " ");
  return sentence;
}

function makeSentenceFromTemplate() {
  return Sentencer.make( _.sample(sentenceTemplates) );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns a starting phrase about a third of the time, otherwise it's empty
function randomStartingPhrase() {
  if(Math.random() < 0.33) {
    return _.sample(phrases);
  }
  return "";
}

var sentenceTemplates = [
  "the {{ noun }} is {{ a_noun }}",
  "{{ a_noun }} is {{ an_adjective }} {{ noun }}",
  "the first {{ adjective }} {{ noun }} is, in its own way, {{ a_noun }}",
  "their {{ noun }} was, in this moment, {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }} from the right perspective",
  "the literature would have us believe that {{ an_adjective }} {{ noun }} is not but {{ a_noun }}",
  "{{ an_adjective }} {{ noun }} is {{ a_noun }} of the mind",
  "the {{ adjective }} {{ noun }} reveals itself as {{ an_adjective }} {{ noun }} to those who look",
  "authors often misinterpret the {{ noun }} as {{ an_adjective }} {{ noun }}, when in actuality it feels more like {{ an_adjective}} {{ noun }}",
  "we can assume that any instance of {{ a_noun }} can be construed as {{ an_adjective }} {{ noun }}",
  "they were lost without the {{ adjective }} {{ noun }} that composed their {{ noun }}",
  "the {{ adjective }} {{ noun }} comes from {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} can hardly be considered {{ an_adjective }} {{ noun }} without also being {{ a_noun }}",
  "few can name {{ an_adjective }} {{ noun }} that isn't {{ an_adjective }} {{ noun }}",
  "some posit the {{ adjective }} {{ noun }} to be less than {{ adjective }}",
  "{{ a_noun }} of the {{ noun }} is assumed to be {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} sees {{ a_noun }} as {{ an_adjective }} {{ noun }}",
  "the {{ noun }} of {{ a_noun }} becomes {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }}'s {{ noun }}",
  "{{ a_noun }} is the {{ noun }} of {{ a_noun }}",
  "{{ an_adjective }} {{ noun }}'s {{ noun }} comes with it the thought that the {{ adjective }} {{ noun }} is {{ a_noun }}",
  "{{ nouns }} are {{ adjective }} {{ nouns }}",
  "{{ adjective }} {{ nouns }} show us how {{ nouns }} can be {{ nouns }}",
  "before {{ nouns }}, {{ nouns }} were only {{ nouns }}",
  "those {{ nouns }} are nothing more than {{ nouns }}",
  "some {{ adjective }} {{ nouns }} are thought of simply as {{ nouns }}",
  "one cannot separate {{ nouns }} from {{ adjective }} {{ nouns }}",
  "the {{ nouns }} could be said to resemble {{ adjective }} {{ nouns }}",
  "{{ an_adjective }} {{ noun }} without {{ nouns }} is truly a {{ noun }} of {{ adjective }} {{ nouns }}"
];

// partial phrases to start with. Capitalized.
var phrases = [
  "To be more specific, ",
  "In recent years, ",
  "However, ",
  "Some assert that ",
  "If this was somewhat unclear, ",
  "Unfortunately, that is wrong; on the contrary, ",
  "This could be, or perhaps ",
  "This is not to discredit the idea that ",
  "We know that ",
  "It's an undeniable fact, really; ",
  "Framed in a different way, ",
  "What we don't know for sure is whether or not ",
  "As far as we can estimate, ",
  "The zeitgeist contends that ",
  "Though we assume the latter, ",
  "Far from the truth, ",
  "Extending this logic, ",
  "Nowhere is it disputed that ",
  "In modern times ",
  "In ancient times ",
  "Recent controversy aside, "
];

Game.propTypes = {
  index: React.PropTypes.number,
  error: React.PropTypes.bool,
  errorCount: React.PropTypes.number,
  lineView: React.PropTypes.bool,
  timeElapsed: React.PropTypes.number,
  value: React.PropTypes.string,
  startTime: React.PropTypes.string,
  wpm: React.PropTypes.number,
  completed: React.PropTypes.bool,
  excerpt: React.PropTypes.string,
}
Game.defaultProps = {
  index: 0,
  error: false,
  errorCount: 0,
  lineView: false,
  timeElapsed: 0,
  value: '',
  startTime: null,
  wpm: 0,
  completed: false,
  excerpt: "For in nature it takes thirty years for two hundred eggs to reach maturity.",
}

export default Game;
