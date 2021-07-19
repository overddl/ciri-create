import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

export default connect((signer) => ({signer}))(
  class RoutePrivate extends PureComponent {
    render() {
      const { component: Component, signer, ...rest } = this.props;
      return (
        <Route 
          {...rest}
          render={(props) => {
            if(signer.isLogin) {
              return <Component match={props.matchmatch} history={props.history} location={props.location} />
            }else {
              return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            }
          }}
        />
      )
    }
  }
)