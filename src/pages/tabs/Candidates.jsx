import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import {
  getAnonymousCandidatesCount,
  getCandidates,
  setPriorityFeatures,
} from "./../../slices/candidatesSlice";
import SearchBar from "./../../components/SearchBar";
import {
  Message,
  Loader,
  Card,
  Form,
  Dropdown,
  Radio,
  Modal,
  TransitionablePortal,
} from "semantic-ui-react";
import CandidateCard from "./../../components/CandidateCard";
import {
  getFacilityTypeOptions,
  getPriorityFeature1Options,
  getPriorityFeature2Options,
  getShiftTypeOptions,
  priorityFeatures1,
  priorityFeatures2,
} from "../../util/dataUtil";
import CandidateDetails from "../../components/CandidateDetails";

class Candidates extends React.Component {
  constructor(props) {
    super(props);
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
      yearsExperience,
      compensation,
      supervised,
      prescriptionAuthorityNeeded,
      assignmentShiftType,
      malpracticeCandidateAcceptable,
      facilityType,
    } = this.props.priorityFeatures;
    this.state = {
      loading: false,
      compensation: _.isNil(compensation) ? "0" : compensation,
      yearsExperience: _.isNil(yearsExperience) ? "0" : yearsExperience,
      prescriptionAuthorityNeeded: _.isNil(prescriptionAuthorityNeeded)
        ? true
        : prescriptionAuthorityNeeded,
      supervised: _.isNil(supervised) ? true : supervised,
      assignmentShiftType: _.isNil(assignmentShiftType)
        ? ""
        : assignmentShiftType,
      malpracticeCandidateAcceptable: _.isNil(malpracticeCandidateAcceptable)
        ? true
        : malpracticeCandidateAcceptable,
      facilityType: _.isNil(facilityType) ? "" : facilityType,
      priorityFeatureType1: _.isNil(priorityFeatureType1)
        ? ""
        : priorityFeatureType1,
      priorityFeatureType2: _.isNil(priorityFeatureType2)
        ? ""
        : priorityFeatureType2,
      priorityFeatureType3: _.isNil(priorityFeatureType3)
        ? ""
        : priorityFeatureType3,
      priorityFeatureType4: _.isNil(priorityFeatureType4)
        ? ""
        : priorityFeatureType4,
      priorityFeatureType5: _.isNil(priorityFeatureType5)
        ? ""
        : priorityFeatureType5,
      updateError: false,
      showModal: false, selectedCandidate: null
    };
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleTransisitonModalOpen =
      this.handleTransisitonModalOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleShowModal(candidate) {
    this.setState({ showModal: true, selectedCandidate: candidate });
  }

  handleHideModal() {
    this.setState({ showModal: false, selectedCandidate: null });
  }

  handleTransisitonModalOpen() {
    setTimeout(() => document.body.classList.add("modal-fade-in"), 0);
  }

  handlePaginationChange(e, { activePage }) {
    this.props.changeActivePage(activePage);
  }

  handleChange(name, value, notRequired) {
    const errorFieldName = name + "Error";

    if (notRequired) {
      this.setState({
        [name]: value,
      });
    } else {
      this.setState({
        [name]: value,
        [errorFieldName]: _.isEmpty(value),
        updateError: false,
      });
    }
  }

  getPriorityValueMap() {
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
      compensation,
      yearsExperience,
      prescriptionAuthorityNeeded,
      supervised,
      assignmentShiftType,
      malpracticeCandidateAcceptable,
      facilityType,
    } = this.state;
    const valueMap = [
      {
        name: "NumberOfYears",
        value: yearsExperience,
        error: yearsExperience === "0",
        errorField: "yearsExperienceError",
      },
      {
        name: "Compensation",
        value: compensation,
        error: compensation === "0",
        errorField: "compensationError",
      },
      { name: "Supervision", value: supervised, error: false },
      {
        name: "PrescriptionAuthority",
        value: prescriptionAuthorityNeeded,
        error: false,
      },
      {
        name: "AssignmentShift",
        value: assignmentShiftType,
        error: _.isEmpty(assignmentShiftType),
        errorField: "assignmentShiftTypeError",
      },
      {
        name: "MalpracticeCandidate",
        value: malpracticeCandidateAcceptable,
        error: false,
      },
      {
        name: "FacilityType",
        value: facilityType,
        error: _.isEmpty(facilityType),
        errorField: "facilityTypeError",
      },
    ];

    const p1v = _.find(valueMap, ["name", priorityFeatureType1]);
    const p2v = _.find(valueMap, ["name", priorityFeatureType2]);
    const p3v = _.find(valueMap, ["name", priorityFeatureType3]);
    const p4v = _.find(valueMap, ["name", priorityFeatureType4]);
    const p5v = _.find(valueMap, ["name", priorityFeatureType5]);

    return [p1v, p2v, p3v, p4v, p5v];
  }

  handleSubmit(title, specialty, stateCode) {
    const errors = this.validateFields();
    if (errors.updateError) {
      this.setState({ ...errors });
      return;
    }
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
      compensation,
      yearsExperience,
      prescriptionAuthorityNeeded,
      supervised,
      assignmentShiftType,
      malpracticeCandidateAcceptable,
      facilityType,
    } = this.state;

    const valueMap = this.getPriorityValueMap();
    if (
      !_.isEmpty(priorityFeatureType1) &&
      !_.isEmpty(priorityFeatureType2) &&
      !_.isEmpty(priorityFeatureType3) &&
      !_.isEmpty(priorityFeatureType4) &&
      !_.isEmpty(priorityFeatureType5)
    ) {
      const P1 = _.find(priorityFeatures1, ["name", priorityFeatureType1]).desc;
      const P2 = _.find(priorityFeatures1, ["name", priorityFeatureType2]).desc;
      const P3 = _.find(priorityFeatures2, ["name", priorityFeatureType3]).desc;
      const P4 = _.find(priorityFeatures2, ["name", priorityFeatureType4]).desc;
      const P5 = _.find(priorityFeatures2, ["name", priorityFeatureType5]).desc;

      const filter = {
        title,
        specialty,
        stateCode,
        P1,
        P2,
        P3,
        P4,
        P5,
        P1value: valueMap[0].value,
        P2value: valueMap[1].value,
        P3value: valueMap[2].value,
        P4value: valueMap[3].value,
        P5value: valueMap[4].value,
      };
      const priorityFeatures = {
        priorityFeatureType1,
        priorityFeatureType2,
        priorityFeatureType3,
        priorityFeatureType4,
        priorityFeatureType5,
        yearsExperience,
        compensation,
        supervised,
        prescriptionAuthorityNeeded,
        assignmentShiftType,
        malpracticeCandidateAcceptable,
        facilityType,
      };
      this.props.setPriorityFeatures(priorityFeatures);
      this.props.getCandidates(filter);
    }
  }

  validateFields() {
    const errors = {};
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
    } = this.state;
    let updateError = false;

    this.setState({
      ...updateError,
      priorityFeatureType1Error: _.isEmpty(priorityFeatureType1),
      priorityFeatureType2Error: _.isEmpty(priorityFeatureType2),
      priorityFeatureType3Error: _.isEmpty(priorityFeatureType3),
      priorityFeatureType4Error: _.isEmpty(priorityFeatureType4),
      priorityFeatureType5Error: _.isEmpty(priorityFeatureType5),
    });

    _.forEach(this.getPriorityValueMap(), (item) => {
      if (!_.isNil(item) && item.error) {
        const errField = item.errorField;
        updateError = true;
        this.setState({ [errField]: true });
      }
    });

    if (
      _.isEmpty(priorityFeatureType1) ||
      _.isEmpty(priorityFeatureType2) ||
      _.isEmpty(priorityFeatureType3) ||
      _.isEmpty(priorityFeatureType4) ||
      _.isEmpty(priorityFeatureType5)
    ) {
      updateError = true;
    }

    errors.updateError = updateError;
    return errors;
  }

  getCompensationComponent() {
    return (
      <div className="priority-row">
        <div className="priority-row-child">
          <div className="priority-row-child-label3">
            <label>
              <span
                className={
                  this.state.compensationError
                    ? "priority-slider-label-red"
                    : "priority-slider-label-blue"
                }
              >
                {this.state.compensation}
              </span>
            </label>
          </div>
        </div>
        <div className="priority-row-child">
          <input
            type="range"
            className="priority-slider"
            name="compensation"
            min={0}
            max={1000}
            step={5}
            value={this.state.compensation}
            onChange={(e) =>
              this.handleChange("compensation", e.target.value, false)
            }
          />
        </div>
      </div>
    );
  }

  getYearsExperienceComponent() {
    return (
      <div className="priority-row">
        <div className="priority-row-child">
          <div className="priority-row-child-label3">
            <label>
              <span
                className={
                  this.state.yearsExperienceError
                    ? "priority-slider-label-red"
                    : "priority-slider-label-blue"
                }
              >
                {this.state.yearsExperience}
              </span>
            </label>
          </div>
        </div>
        <div className="priority-row-child">
          <input
            type="range"
            className="priority-slider"
            name="yearsExperience"
            min={0}
            max={35}
            value={this.state.yearsExperience}
            onChange={(e) =>
              this.handleChange("yearsExperience", e.target.value, false)
            }
          />
        </div>
      </div>
    );
  }

  getMalpracticeComponent() {
    return (
      <Radio
        toggle
        defaultChecked={this.state.malpracticeCandidateAcceptable}
        className="employerextinfo-radio"
        onChange={(e) =>
          this.handleChange(
            "malpracticeCandidateAcceptable",
            !this.state.malpracticeCandidateAcceptable,
            true
          )
        }
      />
    );
  }

  getPrescriptionAuthorityComponent() {
    return (
      <Radio
        toggle
        defaultChecked={this.state.prescriptionAuthorityNeeded}
        className="employerextinfo-radio"
        onChange={(e) =>
          this.handleChange(
            "prescriptionAuthorityNeeded",
            !this.state.prescriptionAuthorityNeeded,
            true
          )
        }
      />
    );
  }

  getSupervisionComponent() {
    return (
      <Radio
        toggle
        defaultChecked={this.state.supervised}
        className="employerextinfo-radio"
        onChange={(e) =>
          this.handleChange("supervised", !this.state.supervised, true)
        }
      />
    );
  }

  getShiftComponent() {
    return (
      <Dropdown
        clearable
        options={getShiftTypeOptions()}
        selection
        placeholder="Shift"
        name="assignmentShiftType"
        value={this.state.assignmentShiftType}
        error={this.state.assignmentShiftTypeError}
        onChange={(e, { name, value }) => this.handleChange(name, value, false)}
      />
    );
  }

  getFacilityTypeComponent() {
    return (
      <Dropdown
        clearable
        options={getFacilityTypeOptions()}
        selection
        placeholder="Facility Type"
        name="facilityType"
        value={this.state.facilityType}
        error={this.state.facilityTypeError}
        onChange={(e, { name, value }) => this.handleChange(name, value, false)}
      />
    );
  }

  getComponent(priorityFeature) {
    if (priorityFeature === "NumberOfYears") {
      return this.getYearsExperienceComponent();
    } else if (priorityFeature === "Compensation") {
      return this.getCompensationComponent();
    } else if (priorityFeature === "MalpracticeCandidate") {
      return this.getMalpracticeComponent();
    } else if (priorityFeature === "AssignmentShift") {
      return this.getShiftComponent();
    } else if (priorityFeature === "FacilityType") {
      return this.getFacilityTypeComponent();
    } else if (priorityFeature === "Supervision") {
      return this.getSupervisionComponent();
    } else if (priorityFeature === "PrescriptionAuthority") {
      return this.getPrescriptionAuthorityComponent();
    }
  }

  render() {
    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
    } = this.state;

    return (
      <div className="tab-candidates">
        <div className="section-candidates">
          <SearchBar
            {...this.props}
            priorityFeatures={
              this.props.userType === "Employer" ? this.state : null
            }
            setPriorityFeatures={this.props.setPriorityFeatures}
            handleSubmit={this.handleSubmit}
          />
          <Loader active={this.props.loading} />
          <div className="candidates-search-results">
            {this.props.userType === "Employer" && (
              <div className="priority-form">
                <Form
                  error={!_.isNil(this.state.formError)}
                  onSubmit={this.handleSubmit}
                >
                  <div className="priority-box">
                    <div className="priority-row">
                      <div className="priority-row-child">
                        <div className="priority-row-child-label">
                          <label>Priority 1</label>
                        </div>
                        <Dropdown
                          clearable
                          options={getPriorityFeature1Options([
                            priorityFeatureType2,
                          ])}
                          selection
                          disabled={_.isEmpty(this.props.empExtInfo)}
                          placeholder="Priority 1"
                          name="priorityFeatureType1"
                          value={priorityFeatureType1}
                          error={this.state.priorityFeatureType1Error}
                          onChange={(e, { name, value }) =>
                            this.handleChange(name, value, false)
                          }
                        />
                      </div>
                    </div>
                    {!_.isEmpty(this.state.priorityFeatureType1) &&
                      this.getComponent(this.state.priorityFeatureType1)}
                  </div>
                  <div className="priority-box">
                    <div className="priority-row">
                      <div className="priority-row-child">
                        <div className="priority-row-child-label">
                          <label>Priority 2</label>
                        </div>
                        <Dropdown
                          clearable
                          options={getPriorityFeature1Options([
                            priorityFeatureType1,
                          ])}
                          selection
                          placeholder="Priority 2"
                          name="priorityFeatureType2"
                          value={priorityFeatureType2}
                          disabled={_.isEmpty(this.props.empExtInfo)}
                          error={this.state.priorityFeatureType2Error}
                          onChange={(e, { name, value }) =>
                            this.handleChange(name, value, false)
                          }
                        />
                      </div>
                    </div>
                    {!_.isEmpty(this.state.priorityFeatureType2) &&
                      this.getComponent(this.state.priorityFeatureType2)}
                  </div>
                  <div className="priority-box">
                    <div className="priority-row">
                      <div className="priority-row-child">
                        <div className="priority-row-child-label">
                          <label>Priority 3</label>
                        </div>
                        <Dropdown
                          clearable
                          options={getPriorityFeature2Options([
                            priorityFeatureType4,
                            priorityFeatureType5,
                          ])}
                          selection
                          placeholder="Priority 3"
                          name="priorityFeatureType3"
                          value={priorityFeatureType3}
                          disabled={_.isEmpty(this.props.empExtInfo)}
                          error={this.state.priorityFeatureType3Error}
                          onChange={(e, { name, value }) =>
                            this.handleChange(name, value, false)
                          }
                        />
                      </div>
                      <div className="priority-row-child">
                        {!_.isEmpty(this.state.priorityFeatureType3) &&
                          this.getComponent(this.state.priorityFeatureType3)}
                      </div>
                    </div>
                  </div>
                  <div className="priority-box">
                    <div className="priority-row">
                      <div className="priority-row-child">
                        <div className="priority-row-child-label">
                          <label>Priority 4</label>
                        </div>
                        <Dropdown
                          clearable
                          options={getPriorityFeature2Options([
                            priorityFeatureType3,
                            priorityFeatureType5,
                          ])}
                          selection
                          placeholder="Priority 4"
                          name="priorityFeatureType4"
                          value={priorityFeatureType4}
                          disabled={_.isEmpty(this.props.empExtInfo)}
                          error={this.state.priorityFeatureType4Error}
                          onChange={(e, { name, value }) =>
                            this.handleChange(name, value, false)
                          }
                        />
                      </div>
                      <div className="priority-row-child">
                        {!_.isEmpty(this.state.priorityFeatureType4) &&
                          this.getComponent(this.state.priorityFeatureType4)}
                      </div>
                    </div>
                  </div>
                  <div className="priority-box">
                    <div className="priority-row">
                      <div className="priority-row-child">
                        <div className="priority-row-child-label">
                          <label>Priority 5</label>
                        </div>
                        <Dropdown
                          clearable
                          options={getPriorityFeature2Options([
                            priorityFeatureType4,
                            priorityFeatureType3,
                          ])}
                          selection
                          placeholder="Priority 5"
                          name="priorityFeatureType5"
                          value={priorityFeatureType5}
                          disabled={_.isEmpty(this.props.empExtInfo)}
                          error={this.state.priorityFeatureType5Error}
                          onChange={(e, { name, value }) =>
                            this.handleChange(name, value, false)
                          }
                        />
                      </div>
                      <div className="priority-row-child">
                        {!_.isEmpty(this.state.priorityFeatureType5) &&
                          this.getComponent(this.state.priorityFeatureType5)}
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            )}
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
              <CandidateDetails candidate={this.state.selectedCandidate} />
            </Modal>
          </TransitionablePortal>
            <div className="priority-results">
              {_.isEmpty(this.props.userType) &&
                (_.isNil(this.props.anonymousCandidateSearchCount) ||
                this.props.anonymousCandidateSearchCount < 1 ? (
                  <h4>No match found</h4>
                ) : (
                  <h4>
                    {this.props.anonymousCandidateSearchCount} potential
                    candidates found. Please login to find more details
                  </h4>
                ))}
              {this.props.userType === "Employer" &&
                (_.size(this.props.candidates) < 1 ? _.isEmpty(this.props.employerExtInfo) ? null : (
                  <h4>No match found</h4>
                ) : (
                  <React.Fragment>
                    <Card.Group stackable={true} textAlign="right">
                      {_.map(this.props.candidates, (candidate, i) => (
                        <CandidateCard
                          key={i}
                          candidate={candidate}
                          index={i}
                          userAuthorized={this.props.lnAuthStatus}
                          showModal={() =>
                            this.handleShowModal(candidate)
                          }
                        />
                      ))}
                    </Card.Group>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tab: "find-talent",
  loading: state.candidatesState.loading,
  anonymousCandidateSearchCount:
    state.candidatesState.anonymousCandidateSearchCount,
  candidates: state.candidatesState.candidates,
  searchCondition: state.candidatesState.searchCondition,
  lnAuthStatus: state.loginState.lnAuthStatus,
  userId: state.loginState.userId,
  userType: state.loginState.userType,
  empExtInfo: state.employerState.extInfo,
  title: state.employerState.title,
  specialty: state.employerState.speciality,
  stateCode: !_.isNil(state.employerState.extInfo.state)
    ? state.employerState.extInfo.state
    : state.loginState.stateCode,
  priorityFeatures: state.candidatesState.priorityFeatures,
  employerExtInfo: state.employerState.extInfo,
  userDataInitialized: state.loginState.userDataInitialized
});

const mapDispatchToProps = {
  getAnonymousCandidatesCount,
  getCandidates,
  setPriorityFeatures,
};

export default connect(mapStateToProps, mapDispatchToProps)(Candidates);
