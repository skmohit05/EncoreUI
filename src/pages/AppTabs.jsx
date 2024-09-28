import React from 'react';
import { connect } from 'react-redux';
import { Tab } from 'semantic-ui-react';

import Jobs from './tabs/Jobs';
import Candidates from './tabs/Candidates';
import HowItWorks from './tabs/HowItWorks';
import MedicalJobSeekerJobs from './tabs/MedicalJobSeekerJobs';
import EmployerPostedJobs from './tabs/EmployerPostedJobs';
import _ from 'lodash';

class AppTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userType: this.props.userType
    };
  }

  static getDerivedStateFromProps(props, state) {
    if(!_.isNil(props)){
      return ({
        ...state,
        userType: props.userType
      });
    }

    return null;
  }

  getPanes(){
    let panes;
    if(this.props.userType === 'JobSeeker'){
      panes = [
        {
          menuItem: 'Find Work',
          render: () => <Tab.Pane><Jobs /></Tab.Pane>,
        },
        {
          menuItem: 'My Jobs',
          render: () => <Tab.Pane><MedicalJobSeekerJobs /></Tab.Pane>
        },
        {
          menuItem: 'How It Works',
          render: () => <Tab.Pane><HowItWorks /></Tab.Pane>
        },
      ]
    }
    else if(this.props.userType === 'Employer'){
      panes = [
        {
          menuItem: 'Find Talent',
          render: () => <Tab.Pane><Candidates /></Tab.Pane>,
        },
        {
          menuItem: 'My Posted Jobs',
          render: () => <Tab.Pane><EmployerPostedJobs {...this.props} /></Tab.Pane>
        },
        {
          menuItem: 'How It Works',
          render: () => <Tab.Pane><HowItWorks /></Tab.Pane>
        },
      ]
    }
    else {
      panes = [
        {
          menuItem: 'Find Work',
          render: () => <Tab.Pane><Jobs /></Tab.Pane>,
        },
        {
          menuItem: 'Find Talent',
          render: () => <Tab.Pane><Candidates /></Tab.Pane>
        },
        {
          menuItem: 'How It Works',
          render: () => <Tab.Pane><HowItWorks /></Tab.Pane>
        },
      ]
    }

    return panes;
  }

  render() {
    const panes = this.getPanes();
    return (
      <Tab panes={panes} className='app-tabs' />
    );
  }
}

const mapStateToProps = (state) => ({
  userType: state.loginState.userType,
});

export default connect(mapStateToProps)(AppTabs);