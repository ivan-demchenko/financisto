import * as React from 'react';
import { Component } from 'react';

export default class App extends Component {
    render() {
        let time = new Date().toLocaleTimeString();
        return <span>{ time }</span>;
    }
}