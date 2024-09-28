import React from "react";
import _ from "lodash";
import { Card, Icon, Label } from "semantic-ui-react";
import { blueBorderStyle } from "../styles/inlinestyles";

class CandidateCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { style: {} };
  }

  handleMouseEnter(e) {
    this.setState({ style: { ...blueBorderStyle } });
  }

  handleMouseLeave(e) {
    this.setState({ style: {} });
  }

  handleClick(e) {
    e.preventDefault();
    this.props.showModal();
  }

  //<Card.Header>{this.props.job.name}</Card.Header>

  render() {
    const fmtCompensation = _.isNil(this.props.candidate.compensation)
      ? ""
      : "$" + this.props.candidate.compensation + " Hourly";

    return (
      <Card
        className="job-card"
        style={this.state.style}
        raised={true}
        onMouseMove={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeave}
        onClick={this.handleClick}
      >
        <Card.Content className="job-card-content">
          <Card.Description>
            <Icon name="user" disabled />
            {this.props.candidate.name}
            {this.props.userAuthorized === 'success' && this.props.index === 0 && (
              <Label color="blue" tag className="job-index" size='mini'>
                Best Match
              </Label>
            )}
          </Card.Description>
          <Card.Description>
            <Icon name="plus square" disabled />
            {this.props.candidate.title}
          </Card.Description>
          <Card.Description>
            <Icon name="doctor" disabled />
            {this.props.candidate.specialityType.toUpperCase()}
          </Card.Description>
          <Card.Description>
            <Icon name="map marker alternate" disabled />
            {this.props.candidate.location}
          </Card.Description>
          <Card.Description>
            <Icon name="payment" disabled />
            {fmtCompensation}
          </Card.Description>
          <br />
          <Card.Description>
            <Icon name="arrow circle up" disabled />
            Rank: {this.props.index + 1}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default CandidateCard;
