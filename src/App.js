import React, { useEffect, useState } from 'react';
import Info from './pages/info/Info';
import Header from './pages/header/Header';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Privacity from './pages/privacity/Privacity';
import Account from './pages/account/Account';
import LoginAndSecurity from './pages/account/login-and-security/LoginAndSecurity';
import PersonalInfo from './pages/account/personal-info/PersonalInfo';
import Footer from './pages/footer/Footer';
import { AuthProvider } from './services/firebase'; 
import PrivateRoute from './pages/PrivateRoute';
import NotFound from './pages/NotFound';
import { useUserAgent } from '@oieduardorabelo/use-user-agent';
import Axios from 'axios';
import LoadingPage from './pages/login/LoadingPage';
import CookieAcept from './pages/CookieAcept';


function App() {
  const details = useUserAgent();
  const [userDetails, setUserDetails] = useState(null);

  useEffect( () => {
    if (details){
      Axios.get('https://ipapi.co/json/').then((res) => {
        setUserDetails([res.data, details]);
      });
    }
  }, [details])

  return (
    <div className="App">
      <AuthProvider>
        <Info />
        <Router>
          <CookieAcept/>
          <Header user={userDetails}/>
          <LoadingPage/>
          <Switch>
            <Route exact path='/privacity'>
                <Privacity />
            </Route>
            <PrivateRoute exact path='/account-settings'>
                <Account />
            </PrivateRoute>
            <PrivateRoute exact path='/account-settings/login-and-security'>
                <LoginAndSecurity user={userDetails}/>
            </PrivateRoute>
            <PrivateRoute exact path='/account-settings/personal-info'>
                <PersonalInfo user={userDetails}/>
            </PrivateRoute>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route component={NotFound} />
          </Switch>
          <Footer/>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
