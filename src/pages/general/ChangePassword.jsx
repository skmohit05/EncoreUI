import React from "react";
import { Button, Header, Form, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import _ from "lodash";

import userSlice, {
  updatePassword,
  clearErrors,
} from "./../../slices/userSlice";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      existingPassword: "",
      newPassword: "",
      confirmNewPassword: "",
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

    this.props.updatePassword(this.state);
  }

  validateFields() {
    const errors = {};
    if (_.isEmpty(this.state.existingPassword)) {
      errors.existingPasswordError = "Invalid value";
    }

    if (_.isEmpty(this.state.newPassword)) {
      errors.newPasswordError = "Invalid value";
    }

    if (_.isEmpty(this.state.confirmNewPassword)) {
      errors.confirmNewPasswordError = "Invalid value";
    }

    if (
      !_.isEmpty(this.state.newPassword) &&
      !_.isEqual(this.state.newPassword, this.state.confirmNewPassword)
    ) {
      errors.newPasswordError = "Does not match";
      errors.confirmNewPasswordError = "Does not match";
    }
    return errors;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    if (this.props.updatePasswordStatus === "success" ||
      this.props.lnAuthStatus !== "success") {
      return (<Redirect to='/' />);
    }
    return (
      <div className="general-changepassword">
        <div className="general-changepassword-container">
          <Header size="medium" className="general-login-changepassword-header">
            Change your password
          </Header>
          <Form
            onSubmit={this.handleSubmit}
            loading={this.state.updatePasswordLoading}
            error={!_.isNil(this.state.formError)}
          >
            <Form.Input
              autoFocus
              icon="lock"
              iconPosition="left"
              type="password"
              name="existingPassword"
              placeholder="Current Password"
              value={_.toLower(this.state.existingPassword)}
              error={this.state.existingPasswordError}
              onChange={this.handleChange}
            ></Form.Input>
            <Form.Input
              icon="lock"
              iconPosition="left"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={this.state.newPassword}
              error={this.state.newPasswordError}
              onChange={this.handleChange}
            ></Form.Input>
            <Form.Input
              icon="lock"
              iconPosition="left"
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={this.state.confirmNewPassword}
              error={this.state.confirmNewPasswordError}
              onChange={this.handleChange}
            ></Form.Input>
            <Button primary type="submit">
              Submit
            </Button>
            {this.props.updatePasswordStatus === "failed" && (
              <Message negative content={this.props.updatePasswordErrMsg} />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  updatePasswordLoading: state.userState.updatePasswordLoading,
  updatePasswordStatus: state.userState.updatePasswordStatus,
  updatePasswordErrMsg: state.userState.updatePasswordErrMsg,
  lnAuthStatus: state.loginState.lnAuthStatus,
});

const mapDispatchToProps = {
  updatePassword,
  clearErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
