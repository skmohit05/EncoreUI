import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Accordion, Card, Icon,
  Modal,
  TransitionablePortal, } from "semantic-ui-react";
import EmployerPostedJobCard from "../../components/EmployerPostedJobCard";
import { editJob } from "../../slices/employerSlice";
import JobDetails from "../../components/JobDetails";

class EmployerPostedJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndexes: [0,1],
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleTransisitonModalOpen =
      this.handleTransisitonModalOpen.bind(this);
  }

  handleShowModal(job) {
    this.setState({ showModal: true, selectedJob: job });
  }

  handleHideModal() {
    this.setState({ showModal: false, selectedJob: null });
  }

  handleTransisitonModalOpen() {
    setTimeout(() => document.body.classList.add("modal-fade-in"), 0);
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndexes } = this.state;
    if (_.includes(activeIndexes, index)) {
      _.pull(activeIndexes, index);
    } else {
      activeIndexes.push(index);
    }

    this.setState({ activeIndexes: activeIndexes });
  };

  render() {
    const { activeIndexes } = this.state;
    let pastJobs = [];
    let activeJobs = [];
    const currDate = new Date();
    _.map(this.props.jobs, job => {
      if(!_.isNil(job.assignmentFromDate) && _.isNil(job.assignmentToDate)){
        activeJobs.push(job);
      }
      else {
        const fromDate = new Date(job.assignmentFromDate);
        if(fromDate >= currDate){
          activeJobs.push(job);
        } else {
          pastJobs.push(job);
        }
      }
    });
    return (
      <div className="tab-postedjobs">
        <Accordion fluid styled>
          <Accordion.Title
            active={_.includes(activeIndexes, 0)}
            index={0}
            onClick={this.handleClick}
          >
            <div className="postedjobs-jobtitle">
              <Icon name="dropdown" />
              <p>Actively Hiring</p>
            </div>
          </Accordion.Title>
          <Accordion.Content active={_.includes(activeIndexes, 0)}>
            <div className="jobs-search-results">
              {_.size(activeJobs) < 1 ? (
                this.props.loading ? null : (
                  <h4>No jobs found</h4>
                )
              ) : (
                <React.Fragment>
                  <Card.Group stackable={true} textAlign="right">
                    {_.map(activeJobs, (job, i) => (
                      <EmployerPostedJobCard
                        key={job.medicalEmployerJobPostingId}
                        job={job}
                        location={this.props.location}
                        index={i}
                        pastJob={false}
                        history={this.props.history}
                        editJob={this.props.editJob}
                      />
                    ))}
                  </Card.Group>
                </React.Fragment>
              )}
            </div>
          </Accordion.Content>

          
          <TransitionablePortal
            open={this.state.showModal}
            onOpen={this.handleTransisitonModalOpen}
            transition={{ animation: "scale", duration: 250 }}
          >
            <Modal
              open={this.state.showModal}
              onClose={this.handleHideModal}
              closeIcon={true}
              className="job-details-modal"
            >
              <JobDetails job={this.state.selectedJob} />
            </Modal>
          </TransitionablePortal>
          <Accordion.Title
            active={_.includes(activeIndexes, 1)}
            index={1}
            onClick={this.handleClick}
          >
            <div className="postedjobs-jobtitle">
              <Icon name="dropdown" />
              <p>Past Positions</p>
            </div>
          </Accordion.Title>
          <Accordion.Content active={_.includes(activeIndexes, 1)}>
            <div className="jobs-search-results">
              {_.size(pastJobs) < 1 ? (
                <h4>No jobs found</h4>
              ) : (
                <React.Fragment>
                  <Card.Group stackable={true} textAlign="right">
                    {_.map(pastJobs, (job, i) => (
                      <EmployerPostedJobCard
                        key={job.medicalEmployerJobPostingId}
                        job={job}
                        location={this.props.location}
                        index={i}
                        pastJob={true}
                        showModal={() =>
                          this.handleShowModal(job)
                        }
                      />
                    ))}
                  </Card.Group>
                </React.Fragment>
              )}
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jobs: state.employerState.jobPostings,
  location: !_.isEmpty(state.employerState.extInfo)
    ? state.employerState.extInfo.state
    : null,
});

const mapDispatchToProps = {
  editJob,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPostedJobs);
