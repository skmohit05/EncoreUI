import React from "react";
import { Button } from "semantic-ui-react";

class VerificationCodeButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      label: "Send Verification Code",
      enabled: true,
      sentCounter: 0,
    };
  }

  handleClick() {
    const success = this.props.onClick();
    if (!success) {
      return;
    }
  }

  render() {
    if (!this.state.enabled) {
      return null;
    }
    return (
      <Button
        primary
        type="input"
        onClick={this.handleClick}
        disabled={!this.state.enabled}
        size={this.props.size}
      >
        {this.state.label}
      </Button>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    clearInterval(this.timer);
  }
}

VerificationCodeButton.defaultProps = {
  size: "small",
  retries: 1,
  retryWaitSeconds: 30,
};

export default VerificationCodeButton;
