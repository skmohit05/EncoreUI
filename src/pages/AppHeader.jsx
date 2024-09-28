import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { logout } from './../slices/loginSlice';
import Settings from './general/Settings';

class AppHeader extends React.Component {
  render() {
    return(
      <div className='app-header'>
        <Link to="/"><img src={process.env.PUBLIC_URL + '/logo.png'} alt='Encore Time' className='app-header-logo' /></Link>
        <div className='app-header-buttons'>
        {this.props.lnAuthStatus !== 'success' && <Link to='/signup'><Button primary>Signup</Button></Link>}
        {this.props.lnAuthStatus === 'success' ?
        <Settings {...this.props} /> :
        <Link to='/login'><Button primary>Login</Button></Link>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lnAuthStatus: state.loginState.lnAuthStatus,
  userType: state.loginState.userType
});

const mapDispatchToProps = {
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
