import React from 'react';
import ReactDOM,{unstable_createRoot} from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

var root = unstable_createRoot(document.getElementById('root'));
root.render(<App />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
