import React from "react";
import { Button, Header, Form, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import _ from "lodash";

import { isValidEmail } from "./../../util/util";
import loginSlice, {
  loginAndInitializeApp,
  clearErrors,
} from "./../../slices/loginSlice";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: "",
      password: "",
      emailError: null,
      passwordError: null,
      formError: null,
      loading: false,
    };
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
    this.props.loginAndInitializeApp(this.state);
  }

  validateFields() {
    const errors = {};
    if (!isValidEmail(this.state.email)) {
      errors.emailError = "Invalid email";
    }

    if (_.isEmpty(this.state.password)) {
      errors.passwordError = "Invalid value";
    }
    return errors;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    if (this.props.lnAuthStatus === "success") {
      return (<Redirect to='/' />);
    }
    return (
      <div className="general-login">
        <div className="general-login-container">
          <Header size="medium" className="general-login-container-header">
            Login to your account
          </Header>
          <Form
            onSubmit={this.handleSubmit}
            loading={this.props.loading}
            error={!_.isNil(this.state.formError)}
          >
            <Form.Input
              autoFocus
              icon="user"
              iconPosition="left"
              name="email"
              placeholder="Email Address"
              value={_.toLower(this.state.email)}
              error={this.state.emailError}
              onChange={this.handleChange}
            ></Form.Input>
            <Form.Input
              icon="lock"
              iconPosition="left"
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              error={this.state.passwordError}
              onChange={this.handleChange}
            ></Form.Input>
            <div className="general-login-row">
              <Button primary type="submit" className="login-btn">
                Login
              </Button>
              <Link className="login-forgot-password" to="/forgotPassword">
                Forgot Password
              </Link>
            </div>
            {this.props.lnAuthStatus === "failed" && (
              <Message negative content="Invalid credentials" />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lnAuthStatus: state.loginState.lnAuthStatus,
  userId: state.loginState.userId,
  loading: state.loginState.loading,
});

const mapDispatchToProps = {
  loginAndInitializeApp,
  clearErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
