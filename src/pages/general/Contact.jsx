import React from "react";
import { Header, Label } from "semantic-ui-react";

class Contact extends React.Component {
  render() {
    return (
      <div className="general-contact">
        <Header color="blue">Contact Us</Header>
        <Label className="contact-block">
          <Header>Customer Support 24x7</Header>
          <p>support@encoretime.co</p>
        </Label>
      </div>
    );
  }
}

export default Contact;
