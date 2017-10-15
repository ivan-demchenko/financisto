import 'rxjs';
import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import App from './components/App';
import { reducer as CSVInputReducer, sendDataEpic } from './components/CSVInput';
import { reducer as GroupedDataReducer } from './components/GroupedData';

const epicMiddleware = createEpicMiddleware(
    sendDataEpic
);

const rootReducer = combineReducers({
    csvInput: CSVInputReducer,
    groupedData: GroupedDataReducer
});

const rootStore = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
);

render((
    <Provider store={rootStore}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('app'));