import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'

import './styles/global.scss';
import store from './store';
import reportWebVitals from './reportWebVitals';
import App from './pages/App';
import { setAPIServerURL } from './commons';

setAPIServerURL(process.env.REACT_APP_API_URL);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
