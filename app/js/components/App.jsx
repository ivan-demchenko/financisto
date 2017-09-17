import 'rxjs';
import * as React from 'react';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Component } from 'react';
import "./App.styl";

import CSVInput, { reducer as CSVInputReducer, sendDataEpic } from './CSVInput';

const epicMiddleware = createEpicMiddleware(sendDataEpic);
const rootReducer = combineReducers({
    csvInput: CSVInputReducer
});
const rootStore = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
);

export default class App extends Component {
    render() {
        return (
            <Provider store={rootStore}>
            <div className="container">
                <header className="header">Financier</header>
                <main className="main-content">
                    <CSVInput />
                </main>
                <footer className="footer">Copyright &copy; Ivan Demchenko</footer>
            </div>
            </Provider>
        );
    }
}