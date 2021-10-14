import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { 
  SignIn,
  SignOut, 
} from './components/pages';

import {
  HomeRenderer,
  NewApplicationRender,
  SavedCalculatorsRenderer,
} from './components/pages/dealer';

import { 
  BikeInformationRenderer,
  CalculatorRenderer,
  ApplicantRenderer,
  CoApplicantRenderer,
  SummaryRenderer
} from './components/pages/dealer/Application';

import { UserDataContext } from "./contexts/UserDataContext";
import { auth, network } from './utils';
import './App.css';
import './components/layouts/styles/MainLayout.css'

function App() {

  const [authenticated] = useState<boolean>(auth.isAuth());

  const validateToken = async () => {
    network.POST(`/api/v1/validate-token`, {})
  }

  useEffect(() => {
    // if (authenticated) { validateToken() }
  }, []);

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
                  <Route path="/applications/:leaseApplicationId/calculators/:LeaseCalculatorId/bike" exact component={BikeInformationRenderer} />
                  <Route path="/applications/:leaseApplicationId/calculators/:LeaseCalculatorId/calculator" exact component={CalculatorRenderer} />
                  <Route path="/applications/:leaseApplicationId/applicant" exact component={ApplicantRenderer} />
                  <Route path="/applications/:leaseApplicationId/co-applicant" exact component={CoApplicantRenderer} />
                  <Route path="/applications/:leaseApplicationId/summary" exact component={SummaryRenderer} />
                  
                  
                  
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
