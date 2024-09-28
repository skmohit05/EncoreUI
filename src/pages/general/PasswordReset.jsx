import React from "react";
import {
  Button,
  Header,
  Form,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";

import VerificationCodeButton from "../../components/VerificationCodeButton";
import { isValidEmail } from "../../util/util";
import { sendOtp } from "../../slices/otpSlice";
import { clearErrors, verifyOtpAndResetPassword } from "../../slices/userSlice";

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: null,
      verificationCode: "",
      verificationCodeError: null,
      password: "",
      passwordError: null,
      verifyPassword: "",
      verifyPasswordError: null,
      formError: null,
      loading: false,
      verificationCodeSent: false,
      passwordReset: false,
      otpVerified: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerificationCodeClick = this.handleVerificationCodeClick.bind(
      this
    );
  }

  handleChange(e, { name, value }) {
    const errorFieldName = name + "Error";
    this.setState({ [name]: value, [errorFieldName]: null, formError: null });
  }

  handleSubmit() {
    const errors = this.validateFields();
    if (!_.isEmpty(errors)) {
      this.setState({ ...errors });
      return;
    }
    this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false, passwordReset: true }), 2000);
    this.props.verifyOtpAndResetPassword(this.state);
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
      requestType: 'PasswordReset'
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

    return errors;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    return (
      <div className="general-pwdreset">
        <div className="general-pwdreset-container">
          <Header size="medium">
            Password Reset
          </Header>
          {this.props.resetPasswordStatus === "success" ? (
            <React.Fragment>
              <Message positive size="small">
                {this.state.email + " account password reset successfully."}
                <Link to="/login"> Login</Link>
              </Message>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Form
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
                    <div className="general-pwdreset-row">
                      <VerificationCodeButton
                        onClick={this.handleVerificationCodeClick}
                        sendOtpStatus={this.props.sendOtpStatus}
                      />
                      <Link to="/login" className="general-pwdreset-login">
                        Login
                      </Link>
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
                  this.props.resetPasswordLoading
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
                    <Button primary type="submit" size="small">
                      Reset Password
                    </Button>
                  </React.Fragment>
                )}
                {this.props.verifyOtpStatus === "failed" && (
                  <Message negative content={this.props.verifyOtpErrMsg} />
                )}
                {this.props.resetPasswordStatus === "failed" && (
                  <Message
                    negative
                    content={this.props.resetPasswordErrMsg}
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
  verifyOtpStatus: state.otpState.verifyOtpStatus,
  resetPasswordLoading: state.userState.resetPasswordLoading,
  resetPasswordStatus: state.userState.resetPasswordStatus,
  resetPasswordErrMsg: state.userState.resetPasswordErrMsg,
});

const mapDispatchToProps = {
  sendOtp,
  verifyOtpAndResetPassword,
  clearErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
