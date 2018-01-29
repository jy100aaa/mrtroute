import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import reducers from './reducer';
import { browserHistory, Router } from 'react-router';
import routes from './routes';

const finalCreateStore = compose(
   // any middleware to add
)(createStore);

const store = finalCreateStore(reducers);

render(
    <Provider store={ store }>
      <Router
          history={ browserHistory }
          routes={ routes } />
    </Provider>,
    document.getElementById('root')
);
