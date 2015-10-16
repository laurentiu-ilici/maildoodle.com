import * as React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { history } from './../history';
import { currentUserStore } from './../stores/index';

import { ThemeManager } from './common/material-ui/index';
import AppTheme from './theme';

import AppComponent from './AppComponent';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import ResetPasswordPage from './pages/auth/reset-password/ResetPasswordPage';
import CreateUserPage from './pages/auth/create-user/CreateUserPage';

import AppHomePage from './pages/app/home/AppHomePage';
import MyAccountPage from './pages/app/my-account/MyAccountPage';

class AppRouter extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    const muiTheme = ThemeManager.getMuiTheme(AppTheme);

    return {
      muiTheme: muiTheme
    };
  }

  requirePublic(nextState, replaceState) {
    if (currentUserStore.getIsLoggedIn()) {
      replaceState({ nextPathname: nextState.location.pathname }, '/app');
    }
  }

  requireAuth(nextState, replaceState) {
    if (!currentUserStore.getIsLoggedIn()) {
      replaceState({ nextPathname: nextState.location.pathname }, '/auth/login');
    }
  }

  render() {
    return (
      <Router path='/' history={history}>
        <Route path='/' component={AppComponent}>
          <IndexRoute component={HomePage} onEnter={this.requirePublic.bind(this)}/>
          <Route path='auth/login' component={LoginPage} onEnter={this.requirePublic.bind(this)}/>
          <Route path='auth/signup' component={CreateUserPage} onEnter={this.requirePublic.bind(this)}/>
          <Route path='auth/resetpassword' component={ResetPasswordPage} onEnter={this.requirePublic.bind(this)}/>

          <Route path='/app' component={AppHomePage} onEnter={this.requireAuth.bind(this)} />
          <Route path='/app/my-account' component={MyAccountPage} onEnter={this.requireAuth.bind(this)} />

          <Route path='*' component={HomePage} />
        </Route>

      </Router>
    );
  }
}

AppRouter.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default AppRouter;
