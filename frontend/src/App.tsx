import React from "react";
import FactoryPage from './pages/Factory';
import BuilderPage from './pages/Builder';
import StorePage from './pages/Store';
import PayPage from './pages/Pay';

import "./App.css";
import {HashRouter, Link, Route} from 'react-router-dom';
import {Symfoni} from "./hardhat/SymfoniContext";

function App() {
    return (
        <Symfoni autoInit={true}>
            <HashRouter>
                <Route exact path='/'>
                    <FactoryPage/>
                </Route>
                <Route exact path='/builder/:address'>
                    <BuilderPage/>
                </Route>
                <Route exact path='/store/:address' component={StorePage} />

                <Route exact path='/store/:address/pay/:ether'>
                    <PayPage/>
                </Route>
            </HashRouter>
        </Symfoni>
    );
}

export default App;
