import React from "react";
import { connect } from "react-redux";
import { Accordion, Card, Icon,
  Modal,
  TransitionablePortal, } from "semantic-ui-react";
import _ from "lodash";
import MedicalJobSeekerJobCard from "../../components/MedicalJobSeekerJobCard";
import { applyJob } from './../../slices/jobsSlice';
import JobDetails from "../../components/JobDetails";

class MedicalJobSeekerJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndexes: [0,1,2],
      showModal: false, selectedJob: null
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
    return (
      <div className="tab-postedjobs">
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
        <Accordion fluid styled>
          <Accordion.Title
            active={_.includes(activeIndexes, 0)}
            index={0}
            onClick={this.handleClick}
          >
            <div className="postedjobs-jobtitle">
              <Icon name="dropdown" />
              <p>Applied Jobs</p>
            </div>
          </Accordion.Title>
          <Accordion.Content active={_.includes(activeIndexes, 0)}>
            <div className="jobs-search-results">
              {_.size(this.props.appliedJobs) < 1 ? (
                this.props.loading ? null : (
                  <h4>No jobs found</h4>
                )
              ) : (
                <React.Fragment>
                  <Card.Group stackable={true} textAlign="right">
                    {_.map(this.props.appliedJobs, (job, i) => (
                      <MedicalJobSeekerJobCard
                        key={job.jobPostingId}
                        job={job.jobPostingDetails}
                        index={i}
                        jobIndex={0}
                        showModal={() =>
                          this.handleShowModal(job.jobPostingDetails)
                        }
                      />
                    ))}
                  </Card.Group>
                </React.Fragment>
              )}
            </div>
          </Accordion.Content>

          <Accordion.Title
            active={_.includes(activeIndexes, 1)}
            index={1}
            onClick={this.handleClick}
          >
            <div className="postedjobs-jobtitle">
              <Icon name="dropdown" />
              <p>Saved Jobs</p>
            </div>
          </Accordion.Title>
          <Accordion.Content active={_.includes(activeIndexes, 1)}>
            <div className="jobs-search-results">
              {_.size(this.props.savedJobs) < 1 ? (
                <h4>No jobs found</h4>
              ) : (
                <React.Fragment>
                  <Card.Group stackable={true} textAlign="right">
                    {_.map(this.props.savedJobs, (job, i) => (
                      <MedicalJobSeekerJobCard
                        key={job.jobPostingId}
                        job={job.jobPostingDetails}
                        index={i}
                        jobIndex={1}
                        applyJob={this.props.applyJob}
                        appliedJobs={this.props.appliedJobs}
                        showModal={() =>
                          this.handleShowModal(job.jobPostingDetails)
                        }
                      />
                    ))}
                  </Card.Group>
                </React.Fragment>
              )}
            </div>
          </Accordion.Content>

          <Accordion.Title
            active={_.includes(activeIndexes, 2)}
            index={2}
            onClick={this.handleClick}
          >
            <div className="postedjobs-jobtitle">
              <Icon name="dropdown" />
              <p>Past Jobs</p>
            </div>
          </Accordion.Title>
          <Accordion.Content active={_.includes(activeIndexes, 2)}>
            <div className="jobs-search-results">
              <h4>No jobs found</h4>
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  savedJobs: state.jobsState.savedJobs,
  appliedJobs: state.jobsState.appliedJobs,
});

const mapDispatchToProps = {
  applyJob,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MedicalJobSeekerJobs);
