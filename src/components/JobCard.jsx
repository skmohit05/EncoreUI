import React from "react";
import _ from "lodash";
import { Card, Icon, Label } from "semantic-ui-react";

import { formatDate } from "./../util/dateUtil";
import {
  formatSpeciality,
  formatDuration,
  formatCompensation,
} from "../util/jobsUtil";
import { blueBorderStyle } from "./../styles/inlinestyles";

class JobCard extends React.Component {
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
    const fmtPostedDate = !_.isNil(this.props.job.postedDate)
      ? formatDate(this.props.job.postedDate)
      : "";
    const fmtCompensation = formatCompensation(this.props.job);
    const fmtDuration = formatDuration(this.props.job);
    const fmtSpeciality = formatSpeciality(this.props.job);

    return (
      <Card
        className="job-card"
        style={this.state.style}
        raised={true}
        onMouseMove={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeave}
      >
        <Card.Content className="job-card-content">
          <Card.Meta>
            <span className="date">{fmtPostedDate}</span>
            {this.props.userAuthorized === "success" && this.props.index === 0 && (
              <Label color="blue" tag className="job-index" size="mini">
                Best Match
              </Label>
            )}
          </Card.Meta>
          <Card.Description>
            <Icon name="plus square" disabled />
            {this.props.job.title}
          </Card.Description>
          <Card.Description>
            <Icon name="building" disabled />
            {this.props.job.organizationName}
          </Card.Description>
          <Card.Description>
            <Icon name="doctor" disabled />
            {fmtSpeciality}
          </Card.Description>
          <Card.Description>
            <Icon name="map marker alternate" disabled />
            {this.props.job.state}
          </Card.Description>
          <Card.Description>
            <Icon name="calendar alternate outline" disabled />
            {fmtDuration}
          </Card.Description>
          <Card.Description>
            <Icon name="payment" disabled />
            {fmtCompensation}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default JobCard;
