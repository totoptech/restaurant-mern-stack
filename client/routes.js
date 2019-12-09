/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Home/pages/BranchesListPage/BranchesListPage');
  require('./modules/Home/pages/ProductListPage/ProductListPage');
  require('./modules/Home/pages/CheckoutPage/CheckoutPage');
  require('./modules/Profile/pages/ProfilePage');
  require('./modules/Profile/pages/Account/Account');
  require('./modules/Profile/pages/OrderHistory/OrderHistory');
  require('./modules/Profile/pages/PaymentMethods/PaymentMethods');
  require('./modules/Profile/pages/Settings/Settings');
  require('./modules/Profile/pages/Address/Address');
  require('./modules/OrderStatus/pages/OrderStatusPage');
  require('./modules/ResetPassword/pages/ResetPassword');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/BranchesListPage/BranchesListPage').default);
        });
      }}
    />
    <Route
      path="/products"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/ProductListPage/ProductListPage').default);
        });
      }}
    />


    <Route
      path="/checkout"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/CheckoutPage/CheckoutPage').default);
        });
      }}
    />
    <Route
      path="/profile"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Profile/pages/ProfilePage').default);
        });
      }}
    >
      <IndexRoute
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Profile/pages/Account/Account').default);
          });
        }}
      />
      <Route
        path="/profile/order"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Profile/pages/OrderHistory/OrderHistory').default);
          });
        }}
      />
      <Route
        path="/profile/payment"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Profile/pages/PaymentMethods/PaymentMethods').default);
          });
        }}
      />
      <Route
        path="/profile/setting"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Profile/pages/Settings/Settings').default);
          });
        }}
      />
      <Route
        path="/profile/address"
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Profile/pages/Address/Address').default);
          });
        }}
      />
    </Route>
    

    <Route
		path='/orderstatus'
		getComponent={(nextState, cb) => {
			require.ensure([], require => {
			cb(null, require('./modules/OrderStatus/pages/OrderStatusPage').default);
		});
      }}
    />
    <Route
      path="/reset/:token" 
      getComponent={(nextState, cb) => {
			require.ensure([], require => {
			cb(null, require('./modules/ResetPassword/pages/ResetPassword').default);
        });
      }}/>
  </Route>
);
