import * as React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import "../styles/main.styl";

// render an instance of Clock into <body>:
render(<App />, document.getElementById('app'));