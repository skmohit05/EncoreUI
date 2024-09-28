import React from "react";
import {
  Button,
  Header,
  Form,
  Message,
  Dropdown,
  Radio,
  Label,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import _ from "lodash";
import { saveJobPostingAndFilterCandidates, clearErrors } from "../../slices/employerSlice";
import {
  getAssignmentTypeOptions,
  getTitleOptions,
  getSpecialityOptions,
  getShiftTypeOptions,
  getPriorityFeature1Options,
  getPriorityFeature2Options,
} from "../../util/dataUtil";
import { areValidFromToDates } from "../../util/dateUtil";

class EmployerJobPosting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      medicalEmployerJobPostingId: _.isNil(this.props.job) ? undefined : this.props.job.medicalEmployerJobPostingId,
      assignmentType: _.isNil(this.props.job) ? "" : this.props.job.assignmentType,
      title: _.isNil(this.props.job) ? "" : this.props.job.title,
      speciality: _.isNil(this.props.job) ? "" : this.props.job.speciality,
      assignmentShiftType: _.isNil(this.props.job) ? "" : this.props.job.assignmentShiftType,
      supervised: _.isNil(this.props.job) ? true : this.props.job.supervised,
      prescriptionAuthorityNeeded: _.isNil(this.props.job) ? true : this.props.job.prescriptionAuthorityNeeded,
      assignmentFromDate: _.isNil(this.props.job) ? "" : this.props.job.assignmentFromDate,
      assignmentToDate: _.isNil(this.props.job) ? "" : this.props.job.assignmentToDate,
      compensation: _.isNil(this.props.job) ? "0" : this.props.job.compensation,
      yearsExperience: _.isNil(this.props.job) ? "0" : this.props.job.yearsExperience,
      priorityFeatureType1: _.isNil(this.props.job) ? "" : this.props.job.priorityFeatureType1,
      priorityFeatureType2: _.isNil(this.props.job) ? "" : this.props.job.priorityFeatureType2,
      priorityFeatureType3: _.isNil(this.props.job) ? "" : this.props.job.priorityFeatureType3,
      priorityFeatureType4: _.isNil(this.props.job) ? "" : this.props.job.priorityFeatureType4,
      priorityFeatureType5: _.isNil(this.props.job) ? "" : this.props.job.priorityFeatureType5,
      postedDate: _.isNil(this.props.job) ? undefined : this.props.job.postedDate,
      statusType: "Active",
      updateError: false,
      errMsg: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, value, notRequired) {
    this.setState({ expiryDate: this.state.assignmentToDate });
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

  handleSubmit() {
    const errors = this.validateFields();
    if (errors.updateError) {
      this.setState({ ...errors });
      return;
    }

    this.props.saveJobPostingAndFilterCandidates(this.state);
  }

  validateFields() {
    const errors = {};
    const {
      assignmentType,
      title,
      speciality,
      assignmentShiftType,
      assignmentFromDate,
      assignmentToDate,
      compensation,
      yearsExperience,
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
    } = this.state;
    let updateError = false;

    if (
      _.isEmpty(assignmentType) ||
      _.isEmpty(title) ||
      _.isEmpty(speciality) ||
      _.isEmpty(assignmentShiftType) ||
      _.isEmpty(priorityFeatureType1) ||
      _.isEmpty(priorityFeatureType2) ||
      _.isEmpty(priorityFeatureType3) ||
      _.isEmpty(priorityFeatureType4) ||
      _.isEmpty(priorityFeatureType5) ||
      compensation === "0" ||
      yearsExperience === "0" ||
      _.isEmpty(assignmentFromDate) ||
      (new Date() > new Date(assignmentFromDate)) ||
      _.isEmpty(assignmentToDate) ||
      !areValidFromToDates(assignmentFromDate, assignmentToDate)
    ) {
      updateError = true;
    }

    this.setState({
      ...updateError,
      assignmentTypeError: _.isEmpty(assignmentType),
      titleError: _.isEmpty(title),
      specialityError: _.isEmpty(speciality),
      assignmentShiftTypeError: _.isEmpty(assignmentShiftType),
      priorityFeatureType1Error: _.isEmpty(priorityFeatureType1),
      priorityFeatureType2Error: _.isEmpty(priorityFeatureType2),
      priorityFeatureType3Error: _.isEmpty(priorityFeatureType3),
      priorityFeatureType4Error: _.isEmpty(priorityFeatureType4),
      priorityFeatureType5Error: _.isEmpty(priorityFeatureType5),
      assignmentFromDateError: _.isEmpty(assignmentFromDate) || (new Date() > new Date(assignmentFromDate)),
      assignmentToDateError:
        _.isEmpty(assignmentToDate) ||
        !areValidFromToDates(assignmentFromDate, assignmentToDate),
      yearsExperienceError: yearsExperience === "0",
      compensationError: compensation === "0",
    });

    errors.updateError = updateError;
    return errors;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    if (
      this.props.lnAuthStatus !== "success" ||
      this.props.formStatus === "success"
    ) {
      return (<Redirect to='/' />);
    }

    const {
      priorityFeatureType1,
      priorityFeatureType2,
      priorityFeatureType3,
      priorityFeatureType4,
      priorityFeatureType5,
    } = this.state;

    return (
      <div className="general-empjobposting">
        <div className="general-empjobposting-container">
          <Header size="medium" className="form-header">
            Welcome to Encore Time {this.props.userName}.
          </Header>
          <Header.Subheader className="empjobposting-subheader">
            Please post a job to find the best talent that matches what you are
            looking for.
          </Header.Subheader>
          <Form
            loading={this.props.formLoading}
            error={
              !_.isNil(this.state.formError) ||
              this.props.formStatus === "failed"
            }
            className="empjobposting-rows"
          >
            <div className="empjobposting-assigntype-row">
              <div className="empjobposting-assigntype-label">
                <label>Assignment Type</label>
              </div>
              <Dropdown
                autoFocus
                clearable
                options={getAssignmentTypeOptions()}
                selection
                name="assignmentType"
                value={this.state.assignmentType}
                error={this.state.assignmentTypeError}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
                className="empjobposting-assigntype-input"
              />
            </div>
            <div className="empjobposting-ts-row">
              <div className="empjobposting-ts-title">
                <div className="empjobposting-ts-title-label">
                  <label>Title</label>
                </div>
                <Dropdown
                  className="empjobposting-ts-title-input"
                  clearable
                  options={getTitleOptions()}
                  selection
                  name="title"
                  value={this.state.title}
                  error={this.state.titleError}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
              <div className="empjobposting-ts-specialty">
                <div className="empjobposting-ts-specialty-label">
                  <label>Speciality</label>
                </div>
                <Dropdown
                  className="empjobposting-ts-specialty-input"
                  clearable
                  options={getSpecialityOptions()}
                  selection
                  name="speciality"
                  value={this.state.speciality}
                  error={this.state.specialityError}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
            </div>
            <div className="empjobposting-shift-row">
              <div className="empjobposting-shift-label">
                <label>Shift</label>
              </div>
              <Dropdown
                className="empjobposting-shift-input"
                clearable
                options={getShiftTypeOptions()}
                selection
                name="assignmentShiftType"
                value={this.state.assignmentShiftType}
                error={this.state.assignmentShiftTypeError}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-sp-row">
              <div className="empjobposting-sp-supervision">
                <label className="empjobposting-sp-supervision-label">
                  Need Supervision Experience?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.supervised}
                  className="empjobposting-sp-supervision-input"
                  onChange={(e) =>
                    this.handleChange(
                      "supervised",
                      !this.state.supervised,
                      true
                    )
                  }
                />
              </div>
              <div className="empjobposting-sp-prescription">
                <label className="empjobposting-sp-prescription-label">
                  Need Prescription Authority?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.prescriptionAuthorityNeeded}
                  className="empjobposting-sp-prescription-input"
                  onChange={(e) =>
                    this.handleChange(
                      "prescriptionAuthorityNeeded",
                      !this.state.prescriptionAuthorityNeeded,
                      true
                    )
                  }
                />
              </div>
            </div>
            <div className="empjobposting-assignment-row">
              <div className="empjobposting-assignment-from">
                <div className="empjobposting-assignment-from-label">
                  <label>Assignment From</label>
                </div>
                <input
                  type="date"
                  className={
                    this.state.assignmentFromDateError
                      ? "empjobposting-assignment-from-input empjobposting-date-error"
                      : "empjobposting-assignment-from-input"
                  }
                  name="assignmentFromDate"
                  value={this.state.assignmentFromDate}
                  onChange={(e) =>
                    this.handleChange(
                      "assignmentFromDate",
                      e.target.value,
                      false
                    )
                  }
                />
              </div>
              <div className="empjobposting-assignment-to">
                <div className="empjobposting-assignment-to-label">
                  <label>Assignment To</label>
                </div>
                <input
                  type="date"
                  className={
                    this.state.assignmentToDateError
                      ? "empjobposting-assignment-to-input empjobposting-date-error"
                      : "empjobposting-assignment-to-input"
                  }
                  name="assignmentToDate"
                  value={this.state.assignmentToDate}
                  onChange={(e) =>
                    this.handleChange("assignmentToDate", e.target.value, false)
                  }
                />
              </div>
            </div>
            <div className="empjobposting-compensation-row">
              <label className="empjobposting-compensation-label">
                Compensation:{" "}
                <span
                  className={
                    this.state.compensationError
                      ? "empjobposting-label-red"
                      : "empjobposting-label-blue"
                  }
                >
                  {this.state.compensation}{"$/hr"}
                </span>
              </label>
              <input
                type="range"
                className="empjobposting-compensation-input"
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
            <div className="empjobposting-experience-row">
              <label className="empjobposting-experience-label">
                Number of Years Experience Needed:{" "}
                <span
                  className={
                    this.state.yearsExperienceError
                      ? "empjobposting-label-red"
                      : "empjobposting-label-blue"
                  }
                >
                  {this.state.yearsExperience}
                </span>
              </label>
              <input
                type="range"
                className="empjobposting-experience-input"
                name="yearsExperience"
                min={0}
                max={35}
                value={this.state.yearsExperience}
                onChange={(e) =>
                  this.handleChange("yearsExperience", e.target.value, false)
                }
              />
            </div>
            <div className="empjobposting-priorityheader-row">
              <label className="empjobposting-priorityheader-label">
                Please provide your priority so we can find the best match.
                You can always change your priority in Find Talent page that
                fits your needs.
              </label>
            </div>
            <div className="empjobposting-priority-row">
              <div className="empjobposting-priority-label">
                <label>Priority 1</label>
              </div>
              <Dropdown
                className="empjobposting-priority-input"
                clearable
                options={getPriorityFeature1Options([priorityFeatureType2])}
                selection
                name="priorityFeatureType1"
                value={priorityFeatureType1}
                error={this.state.priorityFeatureType1Error}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-priority-row">
              <div className="empjobposting-priority-label">
                <label>Priority 2</label>
              </div>
              <Dropdown
                className="empjobposting-priority-input"
                clearable
                options={getPriorityFeature1Options([priorityFeatureType1])}
                selection
                name="priorityFeatureType2"
                value={priorityFeatureType2}
                error={this.state.priorityFeatureType2Error}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-priority-row">
              <div className="empjobposting-priority-label">
                <label>Priority 3</label>
              </div>
              <Dropdown
                className="empjobposting-priority-input"
                clearable
                options={getPriorityFeature2Options([
                  priorityFeatureType4,
                  priorityFeatureType5,
                ])}
                selection
                name="priorityFeatureType3"
                value={priorityFeatureType3}
                error={this.state.priorityFeatureType3Error}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-priority-row">
              <div className="empjobposting-priority-label">
                <label>Priority 4</label>
              </div>
              <Dropdown
                className="empjobposting-priority-input"
                clearable
                options={getPriorityFeature2Options([
                  priorityFeatureType3,
                  priorityFeatureType5,
                ])}
                selection
                name="priorityFeatureType4"
                value={priorityFeatureType4}
                error={this.state.priorityFeatureType4Error}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-priority-row">
              <div className="empjobposting-priority-label">
                <label>Priority 5</label>
              </div>
              <Dropdown
                className="empjobposting-priority-input"
                clearable
                options={getPriorityFeature2Options([
                  priorityFeatureType3,
                  priorityFeatureType4,
                ])}
                selection
                name="priorityFeatureType5"
                value={priorityFeatureType5}
                error={this.state.priorityFeatureType5Error}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="empjobposting-btn-row">
              <Button primary type="submit" onClick={this.handleSubmit}>
                Find Best Matched Talent!
              </Button>
            </div>
            {this.state.updateError && (
              <Message negative content="Please fill the errored fields!" />
            )}
            {this.props.formStatus === "failed" && (
              <Message negative content={this.props.formErrMsg} />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lnAuthStatus: state.loginState.lnAuthStatus,
  userName: state.loginState.userName,
  extInfo: state.employerState.extInfo,
  formStatus: state.employerState.jobPostingFormStatus,
  formLoading: state.employerState.formLoading,
  formErrMsg: state.employerState.formErrMsg,
  job: state.employerState.editJob,
});

const mapDispatchToProps = {
  saveJobPostingAndFilterCandidates,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployerJobPosting);
