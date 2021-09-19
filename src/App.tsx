import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { 
  SignIn,
  SignOut, 
  DealerRenderer,  
  HomeRenderer,
  NewApplicationRender,
  SavedCalculatorsRenderer,
  NewApplicationSteps
} from './components/pages';
import { fullName } from "./contexts/UserDataContext";
import { auth } from './utils';
import './App.css';
import './components/layouts/styles/MainLayout.css'

function App() {

  const [authenticated] = useState<boolean>(auth.isAuth());

  return (
    <>
        <BrowserRouter>
          {
            !authenticated && 
            <Route>
              <Redirect to="/login" />
              <Route path="/login" exact component={SignIn} />
          </Route>
          }

          {
            authenticated && 
            <fullName.Provider value={auth.getFullName()}>
              <Switch>
                <Route exact path="/login">
                  <Redirect to="/home" />
                </Route>
                <Route path="/logout" exact component={SignOut} />
                <Route path="/dealer" exact component={DealerRenderer} />
                <Route path="/home" exact component={HomeRenderer} />
                <Route path="/new-application" exact component={NewApplicationRender} />
                <Route path="/new-application/steps" exact component={NewApplicationSteps} />
                <Route path="/saved-calculators" exact component={SavedCalculatorsRenderer} />
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </Switch>
          </fullName.Provider>

          }

        </BrowserRouter>
    </>
  );
}

export default App;
