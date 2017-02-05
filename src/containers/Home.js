import React, { Component } from 'react';
import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Title from 'grommet/components/Title';
import Footer from 'grommet/components/Footer';
import Paragraph from 'grommet/components/Paragraph';
import emoji from 'react-easy-emoji'
import Game from './Game';

function emojiOne(input) {
  return emoji(input, {
    baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
    ext: '.svg'
  })
}

class Home extends Component {

  render() {
    return (
      <App>
        <Article>
          <Header size='xlarge'
            splash={false}
            fixed={false}
            float={false}>
            <Title>
              Typing Race {emoji('🔥')}
            </Title>
            <Box flex={true}
              justify='end'
              direction='row'
              responsive={false}>
              <Search
                fill={true}
                size='medium'
                placeHolder='Search'
                dropAlign={{"right": "right"}} />
              <Menu icon={emojiOne('😎')}
                dropAlign={{"right": "right"}}>
                <Anchor href='#'
                  className='active'>
                  Home
                </Anchor>
                <Anchor href='#'>
                  Login
                </Anchor>
                <Anchor href='#'>
                  About
                </Anchor>
              </Menu>
            </Box>
          </Header>

          <Section>
            <Game />
          </Section>

          <Footer justify='between'
            size='large'>
            <Title>
              {emoji('🔥')}
            </Title>
            <Box direction='row'
              align='center'
              pad={{"between": "medium"}}>
              <Paragraph margin='none'>
                © 2017 Haolun
              </Paragraph>
              <Menu direction='row'
                size='small'
                dropAlign={{"right": "right"}}>
                <Anchor href='https://github.com/bin4ryio'>
                  GitHub
                </Anchor>
              </Menu>
            </Box>
          </Footer>
        </Article>
      </App>
    )
  }
}

export default Home;
