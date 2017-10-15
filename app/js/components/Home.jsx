import * as React from 'react';
import { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends PureComponent {
    render() {
        return (
            <div>
                <h1>Hi there!</h1>
                <p><Link to="/upload">Upload your data</Link> and them you can see the report</p>
            </div>
        );
    }
}