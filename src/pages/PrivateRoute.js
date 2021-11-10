import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../services/firebase';

const PrivateRoute = ({children, ...rest}) => {
    const {currentUser} = useAuth();

    return (
        <Route
            {...rest}
            render={() => (currentUser ? children : <Redirect to='/'/>)}
        >
        </Route>
    );
};

export default PrivateRoute;
