import React from 'react';
import './assets/css/App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Restaurant from './views/Restaurant'

function App() {
  return (
    <Router>
    <div className="App">

      <Switch>
      <Route exact path="/" component = {Home} />
        <Route exact path="/:id" component = {Restaurant} />
      </Switch>
    </div>
    </Router>
  );
}

const Home = () =>(
  <div className="invalid-index">Invalid Index</div>

)
export default App;
