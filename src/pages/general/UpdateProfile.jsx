import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import JobSeekerExtendedInfo from './JobSeekerExtendedInfo';
import EmployerExtendedInfo from './EmployerExtendedInfo';

class UpdateProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.lnAuthStatus !== "success") {
      return (<Redirect to='/' />);
    }
    return(
      <div className='app-main' >
        {this.props.userType === 'JobSeeker' && <JobSeekerExtendedInfo {...this.props} />}
        {this.props.userType === 'Employer' && <EmployerExtendedInfo {...this.props} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userType: state.loginState.userType,
  lnAuthStatus: state.loginState.lnAuthStatus,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
