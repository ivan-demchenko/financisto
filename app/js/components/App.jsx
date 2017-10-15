import * as React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import CSVInput from './CSVInput';
import Report from './GroupedData';
import "./App.styl";

export default class App extends React.Component {
    render() {
        return (
            <div className="container">
                <header className="header">Financier</header>
                <main className="main-content">
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/upload" component={CSVInput} />
                    <Route exact path="/report" component={Report} />
                </main>
                <footer className="footer">Copyright &copy; Ivan Demchenko</footer>
            </div>
        );
    }
}