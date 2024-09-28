import React from "react";
import {
  Button,
  Header,
  Form,
  Message,
  Dropdown,
  Radio,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

import VerificationCodeButton from "./../../components/VerificationCodeButton";
import { isValidEmail } from "./../../util/util";
import signupSlice, {
  verifyOtpAndSignup,
  clearErrors,
} from "./../../slices/signupSlice";
import { getUserTypes } from "./../../util/dataUtil";
import { sendOtp } from "../../slices/otpSlice";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerificationCodeClick = this.handleVerificationCodeClick.bind(
      this
    );
    this.handleUserTypeChange = this.handleUserTypeChange.bind(this);
    this.state = {
      email: "",
      emailError: null,
      verificationCode: "",
      verificationCodeError: null,
      firstName: "",
      firstNameError: null,
      lastName: "",
      lastNameError: null,
      password: "",
      passwordError: null,
      verifyPassword: "",
      verifyPasswordError: null,
      agreeTerms: false,
      agreeTermsError: null,
      formError: null,
      loading: false,
      verificationCodeSent: false,
      registered: false,
      otpVerified: false,
      userType: "JobSeeker",
    };
  }

  handleChange(e, { name, value }) {
    const errorFieldName = name + "Error";
    this.setState({ [name]: value, [errorFieldName]: null, formError: null});
  }

  handleCheckBoxChange(e, { name, checked }) {
    const errorFieldName = name + "Error";
    this.setState({ [name]: checked, [errorFieldName]: null, formError: null});
  }

  handleSubmit() {
    const errors = this.validateFields();
    if (!_.isEmpty(errors)) {
      this.setState({ ...errors });
      return;
    }
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false, registered: true }), 2000);
    this.props.verifyOtpAndSignup(this.state);
  }

  handleVerificationCodeClick() {
    const errors = this.vaidateEmailField();
    if (!_.isEmpty(errors)) {
      this.setState({ ...errors });
      return false;
    }
    this.setState({ verificationCodeSent: true });
    const sendOtpBody = {
      email: this.state.email,
      requestType: 'Registration'
    }
    this.props.sendOtp(sendOtpBody);
    return true;
  }

  vaidateEmailField() {
    const errors = {};
    if (!isValidEmail(this.state.email)) {
      errors.emailError = "Invalid email";
    }
    return errors;
  }

  validateFields() {
    const errors = {};
    if (!isValidEmail(this.state.email)) {
      errors.emailError = "Invalid email";
    }

    if (_.isEmpty(this.state.verificationCode)) {
      errors.verificationCodeError = "Invalid value";
    }

    if (_.isEmpty(this.state.firstName)) {
      errors.firstNameError = "Invalid value";
    }

    if (_.isEmpty(this.state.lastName)) {
      errors.lastNameError = "Invalid value";
    }

    if (_.isEmpty(this.state.password)) {
      errors.passwordError = "Invalid value";
    }

    if (_.isEmpty(this.state.verifyPassword)) {
      errors.verifyPasswordError = "Invalid value";
    }

    if (
      !_.isEmpty(this.state.password) &&
      !_.isEqual(this.state.password, this.state.verifyPassword)
    ) {
      errors.passwordError = "Does not match";
      errors.verifyPasswordError = "Does not match";
    }

    if (!this.state.agreeTerms) {
      errors.agreeTermsError = "Check the box to agree terms";
    }

    return errors;
  }

  isErrorInForm() {
    return (
      this.state.firstNameError ||
      this.state.lastNameError ||
      this.state.passwordError ||
      this.state.verificationCodeError ||
      this.state.verifyPasswordError ||
      this.agreeTermsError
    );
  }

  handleUserTypeChange(e, { value }) {
    this.setState({ userType: value });
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    const userTypeOptions = _.map(getUserTypes(), ({ name, type }, index) => ({
      key: index,
      text: type,
      value: name,
    }));
    return (
      <div className="general-signup">
        <div className="general-signup-container">
          <Header size="medium" className="general-signup-container-header">
            Signup
          </Header>
          {this.props.userRegistrationStatus === "success" ? (
            <React.Fragment>
              <Message positive size="small">
                {this.state.email + " account registered successfully."}
                <Link to="/login"> Login</Link>
              </Message>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Form
                className="general-signup-email-address-form"
                loading={this.props.sendOtpLoading}
              >
                <Form.Input
                  autoFocus
                  icon="user"
                  iconPosition="left"
                  name="email"
                  placeholder="Email Address"
                  disabled={this.props.sendOtpStatus === "success"}
                  value={_.toLower(this.state.email)}
                  error={this.state.emailError}
                  onChange={this.handleChange}
                ></Form.Input>
                {this.props.sendOtpStatus === "success" ? null : (
                  <React.Fragment>
                    <div className='signup-bottom'>
                      <VerificationCodeButton
                        onClick={this.handleVerificationCodeClick}
                        sendOtpStatus={this.props.sendOtpStatus}
                      />
                      <div className='login-link'>
                        <Link to="/login" className="general-signup-login">
                          Already have an account? Login
                        </Link>
                      </div>
                    </div>
                    {this.props.sendOtpStatus === "failed" && (
                      <Message negative content={this.props.sendOtpErrMsg} />
                    )}
                  </React.Fragment>
                )}
              </Form>
              <Form
                onSubmit={this.handleSubmit}
                loading={
                  this.props.verifyOtpLoading ||
                  this.props.userRegisterationLoading
                }
                error={!_.isNil(this.state.formError)}
              >
                {this.props.sendOtpStatus !== "success" ? null : (
                  <React.Fragment>
                    <Message
                      size="tiny"
                      content="Please check your email and enter the verifcation code below. Please check Spam folder just in case."
                    />
                    <Form.Input
                      autoFocus
                      type="input"
                      name="verificationCode"
                      placeholder="Verification Code"
                      value={this.state.verificationCode}
                      error={this.state.verificationCodeError}
                      onChange={this.handleChange}
                    ></Form.Input>
                    <Form.Group widths="equal">
                      <Form.Input
                        type="input"
                        name="firstName"
                        placeholder="First Name"
                        value={this.state.firstName}
                        error={this.state.firstNameError}
                        onChange={this.handleChange}
                      ></Form.Input>
                      <Form.Input
                        type="input"
                        name="lastName"
                        placeholder="Last Name"
                        value={this.state.lastName}
                        error={this.state.lastNameError}
                        onChange={this.handleChange}
                      ></Form.Input>
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        error={this.state.passwordError}
                        onChange={this.handleChange}
                      ></Form.Input>
                      <Form.Input
                        type="password"
                        name="verifyPassword"
                        placeholder="Verify Password"
                        value={this.state.verifyPassword}
                        error={this.state.verifyPasswordError}
                        onChange={this.handleChange}
                      ></Form.Input>
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <Radio
                          label="Job Seeker"
                          name="radioGroup"
                          value="JobSeeker"
                          checked={this.state.userType === "JobSeeker"}
                          onChange={this.handleUserTypeChange}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="Employer"
                          name="radioGroup"
                          value="Employer"
                          checked={this.state.userType === "Employer"}
                          onChange={this.handleUserTypeChange}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Checkbox
                      name="agreeTerms"
                      error={this.state.agreeTermsError}
                      onChange={this.handleCheckBoxChange}
                      className="general-signup-terms"
                      label="By Clicking Register, You agree to our Terms of Service and Privacy Policy"
                    />
                    <Button primary type="submit" size="small">
                      Register
                    </Button>
                  </React.Fragment>
                )}
                {!this.isErrorInForm() && this.props.verifyOtpStatus === "failed" && (
                  <Message negative content={this.props.verifyOtpErrMsg} />
                )}
                {!this.isErrorInForm() && this.props.userRegistrationStatus === "failed" && (
                  <Message
                    negative
                    content={this.props.userRegistrationErrMsg}
                  />
                )}
              </Form>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sendOtpStatus: state.otpState.sendOtpStatus,
  sendOtpLoading: state.otpState.sendOtpLoading,
  sendOtpErrMsg: state.otpState.sendOtpErrMsg,
  verifyOtpLoading: state.otpState.verifyOtpLoading,
  verifyOtpErrMsg: state.otpState.verifyOtpErrMsg,
  userRegisterationLoading: state.signupState.userRegisterationLoading,
  verifyOtpStatus: state.otpState.verifyOtpStatus,
  userRegistrationStatus: state.signupState.userRegistrationStatus,
  userRegistrationErrMsg: state.signupState.userRegistrationErrMsg,
});

const mapDispatchToProps = {
  sendOtp,
  verifyOtpAndSignup,
  clearErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
