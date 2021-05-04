import React from "react";
import FactoryPage from './pages/Factory';
import BuilderPage from './pages/Builder';
import StorePage from './pages/Store';
import "./App.css";
import {HashRouter, Link, Route} from 'react-router-dom';

function App() {
  return (
    <HashRouter>
    <div className="App">
    <Link to='/builder'>Builder</Link>
      <Link to='/store'>Store</Link>
      <Link to='/factory'>Factory</Link>
      
      <Route exact path='/builder'>
        <BuilderPage />
      </Route>
      <Route exact path='/factory'>
        <FactoryPage />
      </Route>
      <Route exact path='/store'>
        <StorePage />
      </Route>
      
      
    </div>
    </HashRouter>
  );
}

export default App;
