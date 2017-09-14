import 'rxjs';
import * as React from 'react';
import { Component } from 'react';


export default class App extends Component {
    render() {
        return (
            <div className="container">
                <header className="header">Financier</header>
                <main className="main-content">main content</main>
                <footer className="footer">Copyright &copy; Ivan Demchenko</footer>
            </div>
        );
    }
}