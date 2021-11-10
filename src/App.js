import React, { useState } from 'react';
import Info from './pages/info/Info';
import Header from './pages/header/Header';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Privacity from './pages/privacity/Privacity';
import Account from './pages/account/Account';
import LoginAndSecurity from './pages/account/login-and-security/LoginAndSecurity';
import Footer from './pages/footer/Footer';
import { AuthProvider } from './services/firebase'; 
import PrivateRoute from './pages/PrivateRoute';
import NotFound from './pages/NotFound';

function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Info />
        <Router>
          <Header />
          <Switch>
            <Route exact path='/privacity'>
              <Privacity />
            </Route>
            <PrivateRoute exact path='/account-settings'>
              <Account />
            </PrivateRoute>
            <PrivateRoute exact path='/account-settings/login-and-security'>
              <LoginAndSecurity />
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
