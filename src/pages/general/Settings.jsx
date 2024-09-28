import React from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "./../../slices/loginSlice";

class Settings extends React.Component {
  render() {
    return (
      <Dropdown icon="setting" direction="left">
        <Dropdown.Menu>
          <Dropdown.Item
            text="Update Profile"
            as={Link}
            to="/updateProfile"
          />
          {this.props.userType === "Employer" && (
            <Dropdown.Item text="Post Jobs" as={Link} to="/jobPosting" />
          )}
          <Dropdown.Item
            text="Change Password"
            as={Link}
            to="/changePassword"
          />
          <Dropdown.Item text="Logout" onClick={this.props.logout} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
