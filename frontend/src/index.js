import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  import * as serviceWorker from './serviceWorker';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);