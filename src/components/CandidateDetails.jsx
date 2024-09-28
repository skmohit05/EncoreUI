import React from 'react';
import { connect } from 'react-redux';
import { Modal, Table } from 'semantic-ui-react';
import _ from 'lodash';

import { formatSpeciality, formatCompensation } from '../util/jobsUtil';

class CandidateDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      candidate: this.props.candidate,
      userId: this.props.userId,
      userType: this.props.userType
    };
  }

  render() {
    const fmtCompensation = formatCompensation(this.props.candidate.candidateDetails);
    const fmtSpeciality = formatSpeciality({speciality: this.props.candidate.specialityType});
    const fmtMalpractice = this.props.candidate.candidateDetails.malpractice ? 'Yes' : 'No';
    const fmtTravel = this.props.candidate.candidateDetails.travel ? 'Yes' : 'No';

    return(
      <React.Fragment>
        <Modal.Header>{this.props.candidate.name}</Modal.Header>
        <Modal.Content scrolling>
          <Table basic='very' collapsing>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Title</Table.Cell>
                <Table.Cell>{this.props.candidate.title}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Specialty</Table.Cell>
                <Table.Cell>{fmtSpeciality}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Location</Table.Cell>
                <Table.Cell>{this.props.candidate.location}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Compensation</Table.Cell>
                <Table.Cell>{fmtCompensation}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Years of Experience</Table.Cell>
                <Table.Cell>{this.props.candidate.candidateDetails.yearsExperience}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Shift Preference Type</Table.Cell>
                <Table.Cell>{this.props.candidate.candidateDetails.shiftPreferenceType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Job Preference Type</Table.Cell>
                <Table.Cell>{this.props.candidate.candidateDetails.jobPreferenceType}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Malpractice</Table.Cell>
                <Table.Cell>{fmtMalpractice}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Travel</Table.Cell>
                <Table.Cell>{fmtTravel}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(CandidateDetails);
