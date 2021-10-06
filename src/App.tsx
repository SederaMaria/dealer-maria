import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { 
  SignIn,
  SignOut, 
  HomeRenderer,
  NewApplicationRender,
  SavedCalculatorsRenderer,
  NewApplicationSteps
} from './components/pages';
import { UserDataContext } from "./contexts/UserDataContext";
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
              <UserDataContext.Provider value={{fullName: auth.getFullName()}}>
                <Switch>
                  <Route exact path="/login">
                    <Redirect to="/home" />
                  </Route>
                  <Route path="/logout" exact component={SignOut} />
                  <Route path="/home" exact component={HomeRenderer} />
                  <Route path="/application" exact component={NewApplicationRender} />
                  <Route path="/applications/:leaseApplicationId/calculators/:LeaseCalculatorId" exact component={NewApplicationSteps} />
                  <Route path="/saved-calculators" exact component={SavedCalculatorsRenderer} />
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                </Switch>
            </UserDataContext.Provider>

          }

        </BrowserRouter>
    </>
  );
}

export default App;
