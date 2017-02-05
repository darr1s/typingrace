import React from 'react';
import ReactDOM from 'react-dom';
import Home from './containers/Home';

import 'grommet/scss/vanilla/index.scss';
import './styles/Main.scss';

let element = document.getElementById('content');
ReactDOM.render(<Home />, element);

document.body.classList.remove('loading');
