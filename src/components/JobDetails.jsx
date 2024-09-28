import React from 'react';
import { connect } from 'react-redux';
import { Modal, Table, Button, Message } from 'semantic-ui-react';
import _ from 'lodash';

import { formatDate } from './../util/dateUtil';
import { formatSpeciality, formatDuration, formatCompensation } from '../util/jobsUtil';
import { addJob, unsaveJob, clearSavedUnsavedJobStatus, applyJob } from './../slices/jobsSlice';
import ApplyJobConfirmationModal from '../pages/general/ApplyJobConfirmationModal';

class JobDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      job: this.props.job,
      userId: this.props.userId,
      userType: this.props.userType
    };
    this.handleSaveJobClick = this.handleSaveJobClick.bind(this);
    this.handleUnsaveJobClick = this.handleUnsaveJobClick.bind(this);
    this.handleJobApplyClick = this.handleJobApplyClick.bind(this);
  }

  handleSaveJobClick() {
    if(this.state.userType === 'JobSeeker'){
      this.props.addJob(this.state);
    }
  }

  handleUnsaveJobClick() {
    if(this.state.userType === 'JobSeeker'){
      this.props.unsaveJob(this.state);
    }
  }

  handleJobApplyClick() {
    if(this.state.userType === 'JobSeeker'){
      this.props.applyJob(this.state.job);
    }
  }

  componentWillUnmount() {
    this.props.clearJobStatus();
  }

  render() {
    const fmtPostedDate = !_.isNil(this.props.job.postedDate)
      ? formatDate(this.props.job.postedDate)
      : "";
    const fmtCompensation = formatCompensation(this.props.job);
    const fmtDuration = formatDuration(this.props.job);
    const fmtSpeciality = formatSpeciality(this.props.job);
    const fmtLicensingCoverage = this.props.job.licensingCoverage ? 'Yes' : 'No';
    const fmtMalpracticeCoverage = this.props.job.malpracticeCoverage ? 'Yes' : 'No';
    const fmtTravelHousingCoverage = this.props.job.travelHousingCoverage ? 'Yes' : 'No';
    const fmtSupervised = this.props.job.supervised ? 'Yes' : 'No';
    const fmtPrescriptionAuthorityNeeded = this.props.job.prescriptionAuthorityNeeded ? 'Yes' : 'No';

    return(
      <React.Fragment>
        <Modal.Header>{this.props.job.name}</Modal.Header>
        {this.state.userType !== 'JobSeeker' ? null :
        <div className='job-details-modal-button-row'>
          {_.some(this.props.savedJobs, {jobPostingId: this.props.job.medicalEmployerJobPostingId}) ?
          <Button primary onClick={this.handleUnsaveJobClick}>Unsave</Button> :
          <Button primary onClick={this.handleSaveJobClick}>Save</Button>}
          <ApplyJobConfirmationModal applyJob={this.handleJobApplyClick} disabled={_.some(this.props.appliedJobs, {jobPostingId: this.props.job.medicalEmployerJobPostingId})} />
        </div>}
        <div className='job-details-modal-savejob-status'>
          {this.props.saveJobStatus === 'saved' && <Message positive content="Job saved to Favorites" />}
          {this.props.saveJobStatus === 'unsaved' && <Message negative content="Job removed from Favorites" />}
        </div>
        <Modal.Content scrolling>
          <Table basic='very' collapsing>
            <Table.Body>
            <Table.Row>
                <Table.Cell>Posted</Table.Cell>
                <Table.Cell>{fmtPostedDate}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Title</Table.Cell>
                <Table.Cell>{this.props.job.title}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Organization</Table.Cell>
                <Table.Cell>{this.props.job.organizationName}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Specialty</Table.Cell>
                <Table.Cell>{fmtSpeciality}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Location</Table.Cell>
                <Table.Cell>{this.props.job.state}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Shift Type</Table.Cell>
                <Table.Cell>{this.props.job.assignmentShiftType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Prescription Authority Needed</Table.Cell>
                <Table.Cell>{fmtPrescriptionAuthorityNeeded}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Supervised</Table.Cell>
                <Table.Cell>{fmtSupervised}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Duration</Table.Cell>
                <Table.Cell>{fmtDuration}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Compensation</Table.Cell>
                <Table.Cell>{fmtCompensation}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Years of Experience</Table.Cell>
                <Table.Cell>{this.props.job.yearsExperience}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Licensing Coverage</Table.Cell>
                <Table.Cell>{fmtLicensingCoverage}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Malpractice Coverage</Table.Cell>
                <Table.Cell>{fmtMalpracticeCoverage}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Travel Housing Coverage</Table.Cell>
                <Table.Cell>{fmtTravelHousingCoverage}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
      </React.Fragment>
    );
  }
}

//{_.map(this.props.job.jobDescription, (line, index) => {
//  return (<div key={index}>{line}</div>);

//<Table.Row>
//<Table.Cell>Others</Table.Cell>
//<Table.Cell>{_.map(this.props.others, (line, index) => {
//  return (<div key={index}>{line}</div>);
//})}</Table.Cell>
//</Table.Row>


//<Table.Row>
//<Table.Cell>Schedule</Table.Cell>
//<Table.Cell>{_.map(this.props.job.schedule, (line, index) => {
//  return (<div key={index}>{line}</div>);
//})}</Table.Cell>
//</Table.Row>

const mapStateToProps = (state, ownProps) => {
  // const job = _.find(state.jobsState.jobs, job => job.medicalEmployerJobPostingId === ownProps.jobId);
  return {
    userId: state.loginState.userId,
    userType: state.loginState.userType,
    savedJobs: state.jobsState.savedJobs,
    appliedJobs: state.jobsState.appliedJobs,
    saveJobStatus: state.jobsState.saveJobStatus,
  };
};

const mapDispatchToProps = {
  addJob,
  unsaveJob,
  applyJob,
  clearJobStatus: clearSavedUnsavedJobStatus,
};


export default connect(mapStateToProps, mapDispatchToProps)(JobDetails);
