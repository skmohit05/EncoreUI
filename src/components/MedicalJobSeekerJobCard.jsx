import React from "react";
import _ from "lodash";
import { Button, Card, Icon } from "semantic-ui-react";
import { blueBorderStyle } from "../styles/inlinestyles";
import { formatDuration } from "../util/jobsUtil";
import ApplyJobConfirmationModal from "../pages/general/ApplyJobConfirmationModal";

class MedicalJobSeekerJobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { style: {} };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleJobApplyClick = this.handleJobApplyClick.bind(this);
  }

  handleMouseEnter(e) {
    this.setState({ style: { ...blueBorderStyle } });
  }

  handleMouseLeave(e) {
    this.setState({ style: {} });
  }

  handleJobApplyClick() {
    this.props.applyJob(this.props.job);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.showModal();
  }

  //<Card.Header>{this.props.job.name}</Card.Header>

  render() {
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
            {this.props.job.speciality.toUpperCase()}
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
          {this.props.jobIndex == 0 && (
            <Card.Description>
              <Icon name="info circle" disabled />
              Employer Review
            </Card.Description>
          )}
        </Card.Content>
        <div className='myjobs-apply'>
        {this.props.jobIndex == 1 && (
              <ApplyJobConfirmationModal
                applyJob={this.handleJobApplyClick}
                disabled={_.some(this.props.appliedJobs, {
                  jobPostingId: this.props.job.medicalEmployerJobPostingId,
                })}
                size="mini"
              />
          )}
        </div>

      </Card>
    );
  }
}

export default MedicalJobSeekerJobCard;
