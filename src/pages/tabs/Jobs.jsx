import React from "react";
import {
  Card,
  Modal,
  TransitionablePortal,
  Loader,
  Message,
} from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";

import jobsSlice, { fetchJobs } from "./../../slices/jobsSlice";
import SearchBar from "./../../components/SearchBar";
import JobCard from "./../../components/JobCard";
import JobDetails from "./../../components/JobDetails";

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleTransisitonModalOpen =
      this.handleTransisitonModalOpen.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.state = { showModal: false, selectedJob: null };
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

  handlePaginationChange(e, { activePage }) {
    this.props.changeActivePage(activePage);
  }

  render() {
    return (
      <div className="tab-jobs">
        <SearchBar {...this.props} />
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
        <Loader active={this.props.loading} />
        <div className="jobs-search-results">
          {_.size(this.props.jobs) < 1 ? (
            this.props.loading || _.isEmpty(this.props.jobseekerExtInfo) ? null : (
              <h4>No match found</h4>
            )
          ) : (
            <React.Fragment>
              <Card.Group stackable={true} textAlign="right">
                {_.map(this.props.jobs, (job, i) => (
                  <JobCard
                    key={job.medicalEmployerJobPostingId}
                    job={job}index={i}
                    userAuthorized={this.props.lnAuthStatus}
                    showModal={() =>
                      this.handleShowModal(job)
                    }
                  />
                ))}
              </Card.Group>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

//<Pagination activePage={this.props.activePage} totalPages={this.props.totalPages} className='job-details-pagination'
//  onPageChange={this.handlePaginationChange} showEllipsis={true} />

const mapStateToProps = (state) => ({
  tab: 'find-jobs',
  lnAuthStatus: state.loginState.lnAuthStatus,
  jobs: state.jobsState.jobs,
  searchCondition: state.jobsState.searchCondition,
  loading: state.jobsState.loading,
  activePage: state.jobsState.activePage,
  totalPages: state.jobsState.totalPages,
  userId: state.loginState.userId,
  userType: state.loginState.userType,
  title: !_.isNil(state.jobseekerState.extInfo.title)
    ? state.jobseekerState.extInfo.title
    : state.loginState.title,
  specialty: !_.isNil(state.jobseekerState.extInfo.specialityType)
    ? state.jobseekerState.extInfo.specialityType
    : state.loginState.specialty,
  stateCode: !_.isNil(state.jobseekerState.extInfo.state)
    ? state.jobseekerState.extInfo.state
    : state.loginState.stateCode,
  jobseekerExtInfo: state.jobseekerState.extInfo,
  userDataInitialized: state.loginState.userDataInitialized
});

const mapDispatchToProps = {
  getJobs: fetchJobs,
  changeActivePage: jobsSlice.actions.changeActivePage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
