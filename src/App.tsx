import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import { 
  SignIn,
  SignOut, 
} from './components/pages';

import {
  HomeRenderer,
  NewApplicationRender,
  SavedCalculatorsRenderer,
  ReferenceRenderer
} from './components/pages/dealer';

import { 
  BikeInformationRenderer,
  CalculatorRenderer,
  ApplicantRenderer,
  CoApplicantRenderer,
  SummaryRenderer,
  BankingInformationRenderer,
  AttachmentRenderer
} from './components/pages/dealer/Application';

import { UserDataContext } from "./contexts/UserDataContext";
import { auth, network } from './utils';
import './App.css';
import './components/layouts/styles/MainLayout.css'

// Configure IdleTimer timeout. Default: 60
const ENV_TIMEOUT_MINUTE : string | undefined = process.env.REACT_APP_IDLE_TIMER_TIMEOUT_MINUTE
const TIMEOUT_MINUTE = ENV_TIMEOUT_MINUTE ? parseInt(ENV_TIMEOUT_MINUTE) : 60

function App() {

  const [authenticated] = useState<boolean>(auth.isAuth());

  const validateToken = async () => {
    network.POST(`/api/v1/validate-token`, {})
  }

  const handleOnIdle = (event: any) => {
    auth.logout()
    window.location.href = '/login'
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
              // https://github.com/supremetechnopriest/react-idle-timer#documentation
              <IdleTimer
                events={['keydown', 'wheel', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'visibilitychange']}
                timeout={1000 * 60 * TIMEOUT_MINUTE}
                onIdle={handleOnIdle}
                debounce={500}
                crossTab={{
                  emitOnAllTabs: true
                }}
              />
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
                  <Route path="/applications/:leaseApplicationId/banking-information" exact component ={BankingInformationRenderer} />
                  <Route path="/applications/:leaseApplicationId/attachments" exact component ={AttachmentRenderer} />
                  <Route path="/applications/:leaseApplicationId/references" exact component ={ReferenceRenderer} />
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
