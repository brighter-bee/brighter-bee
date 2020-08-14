import React from 'react';
import ClippedDrawer from './home';
import LoginPage from './login';
import SignUpPage from './signup';

import {BrowserRouter, Route, Switch} from 'react-router-dom';


// Register app routes
class LandingPage extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/'>
                        <LoginPage/>
                    </Route>
                    <Route exact path='/login'>
                        <LoginPage/>
                    </Route>
                    <Route exact path='/signup' component={SignUpPage}/>
                    <Route path='/home'>
                        <ClippedDrawer/>
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default LandingPage;
