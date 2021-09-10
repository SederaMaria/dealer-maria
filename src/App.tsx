import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import './components/layouts/styles/MainLayout.css'
import { SignIn, 
  DealerRenderer,  
  HomeRenderer,
  NewApplicationRender,
  SavedCalculatorsRenderer,
  NewApplicationSteps
} from './components/pages';

function App() {
  return (
    <>
        <BrowserRouter>
            <Switch>
              <Route path="/login" exact component={SignIn} />
              <Route path="/dealer" exact component={DealerRenderer} />
              <Route path="/home" exact component={HomeRenderer} />
              <Route path="/new-application" exact component={NewApplicationRender} />
              <Route path="/new-application/steps" exact component={NewApplicationSteps} />
              <Route path="/saved-calculators" exact component={SavedCalculatorsRenderer} />
            </Switch>
        </BrowserRouter>
    </>
  );
}

export default App;
