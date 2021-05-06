import React from "react";
import FactoryPage from './pages/Factory';
import BuilderPage from './pages/Builder';
import StorePage from './pages/Store';
import PayPage from './pages/Pay';

import "./App.css";
import {HashRouter, Link, Route} from 'react-router-dom';

function App() {
  return (
    <HashRouter>
    <div className="App">
    <Link to='/builder/123'>Builder</Link>
      <Link to='/store/123'>Store</Link>
      <Link to='/factory'>Factory</Link>
      <Link to='/store/123/pay/4'>Pay</Link>
      
      <Route exact path='/builder/:address'>
        <BuilderPage />
      </Route>
      <Route exact path='/factory'>
        <FactoryPage />
      </Route>
      <Route exact path='/store/:address'>
        <StorePage />
      </Route>

      <Route exact path='/store/:address/pay/:ether'>
        <PayPage />
      </Route>
      
      
    </div>
    </HashRouter>
  );
}

export default App;
