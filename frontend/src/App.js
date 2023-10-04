import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </div>
  );
};
export default App;