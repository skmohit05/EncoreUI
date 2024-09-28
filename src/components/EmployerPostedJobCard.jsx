import React from "react";
import _ from "lodash";
import { Card, Icon } from "semantic-ui-react";
import { blueBorderStyle } from "../styles/inlinestyles";
import { formatDuration } from "../util/jobsUtil";
import { formatDate } from "../util/dateUtil";

class EmployerPostedJobCard extends React.Component {
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
    if (!this.props.pastJob) {
      this.props.editJob(this.props.job, this.props.history);
    } else {
      this.props.showModal();
    }
  }

  //<Card.Header>{this.props.job.name}</Card.Header>

  render() {
    const fmtPostedDate = !_.isNil(this.props.job.postedDate)
      ? formatDate(this.props.job.postedDate)
      : "";
    const fmtDuration = formatDuration(this.props.job);
    const fmtCompensation = _.isNil(this.props.job.compensation)
      ? ""
      : "$" + this.props.job.compensation + " Hourly";
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
          <Card.Meta>
            <span className="date">{fmtPostedDate}</span>
          </Card.Meta>
          <Card.Description>
            <Icon name="plus square" disabled />
            {this.props.job.title}
          </Card.Description>
          <Card.Description>
            <Icon name="doctor" disabled />
            {this.props.job.speciality.toUpperCase()}
          </Card.Description>
          <Card.Description>
            <Icon name="map marker alternate" disabled />
            {this.props.location}
          </Card.Description>
          <Card.Description>
            <Icon name="calendar alternate outline" disabled />
            {fmtDuration}
          </Card.Description>
          <Card.Description>
            <Icon name="payment" disabled />
            {fmtCompensation}
          </Card.Description>
          {!this.props.pastJob && (
            <Card.Description>
              <Icon name="info circle" disabled />
              {this.props.job.statusType}
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default EmployerPostedJobCard;
