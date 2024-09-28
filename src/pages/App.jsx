import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Sticky } from 'semantic-ui-react';
import AppHeader from './AppHeader';
import AppSlider from './AppSlider';
import AppTabs from './AppTabs';
import AppFooter from './AppFooter';
import About from './general/About';
import Contact from './general/Contact';
import Privacy from './general/Privacy';
import Terms from './general/Terms';
import Signup from './general/Signup';
import Login from './general/Login';
import NotFound from './general/NotFound';
import ChangePassword from './general/ChangePassword';
import UpdateProfile from './general/UpdateProfile';
import MedicalJobSeekerJobInfoList from './general/MedicalJobSeekerJobInfoList';
import EmployerJobPosting from './general/EmployerJobPosting';
import PasswordReset from './general/PasswordReset';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <BrowserRouter>
        <div className='app-main' ref={this.ref}>
          <Sticky context={this.ref}>
            <AppHeader />
          </Sticky>
          <AppSlider />
          <Switch>
            <Route path="/" exact component={AppTabs} />
            <Route path="/about" exact component={About} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/privacy" exact component={Privacy} />
            <Route path="/terms" exact component={Terms} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/login" exact component={Login} />
            <Route path="/changePassword" exact component={ChangePassword} />
            <Route path="/updateProfile" exact component={UpdateProfile} />
            <Route path="/updateProfile/jobsInfo" exact component={MedicalJobSeekerJobInfoList} />
            <Route path="/jobPosting" exact component={EmployerJobPosting} />
            <Route path="/forgotPassword" exact component={PasswordReset} />
            <Route path="/" component={NotFound} />
          </Switch>
          <AppFooter />
        </div>
      </BrowserRouter>
    );
  }
}


export default App;
