import React from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import _ from "lodash";
import {
  Button,
  Header,
  Form,
  Dropdown,
  Radio,
  Message,
  Label,
  Accordion,
  Icon,
} from "semantic-ui-react";
import {
  saveJobsInfo,
  saveJobInfoLocally,
  clearErrors,
  deleteJobInfo,
} from "../../slices/jobseekerSlice";
import {
  getTitleOptions,
  getSpecialityOptions,
  getFacilityTypeOptions,
  getFacilitySubTypeOptions,
  getShiftTypeOptions,
  getAssignmentTypeOptions,
  getStateOptions,
  getOrganizationTypeOptions,
  newJobEntry,
} from "./../../util/dataUtil";
import { isValidZip } from "../../util/util";

class MedicalJobSeekerJobInfoList extends React.Component {
  constructor(props) {
    super(props);
    const jobsInfo = _.map(this.props.jobsInfo, (job) => ({
      ...job,
      currentlyWorking: _.isNil(job.assignmentToDate),
      bedsChecked: job.beds != 0 && job.beds != "0" && job.beds != "NA",
      avgPatientsInMonthChecked:
        job.avgPatientsInMonth != 0 &&
        job.avgPatientsInMonth != "0" &&
        job.avgPatientsInMonth != "NA",
      peersChecked: job.peers != 0 && job.peers != "0" && job.peers != "NA",
      nursesChecked: job.nurses != 0 && job.nurses != "0" && job.nurses != "NA",
      orsChecked: job.ors != 0 && job.ors != "0" && job.ors != "NA",
    }));
    this.state = {
      activeIndex: 0,
      loading: false,
      jobsInfo: [...jobsInfo],
      updateError: false,
      errMsg: "",
    };

    this.handleFacilityNameChange = this.handleFacilityNameChange.bind(this);
    this.handleOrganizationTypeChange =
      this.handleOrganizationTypeChange.bind(this);
    this.handleFacilityTypeChange = this.handleFacilityTypeChange.bind(this);
    this.handleFacilitySubTypeChange =
      this.handleFacilitySubTypeChange.bind(this);
    this.handleAssignmentTypeChange =
      this.handleAssignmentTypeChange.bind(this);
    this.handleAssignmentShiftTypeChange =
      this.handleAssignmentShiftTypeChange.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleAssignmentFromDateChange =
      this.handleAssignmentFromDateChange.bind(this);
    this.handleAssignmentToDateChange =
      this.handleAssignmentToDateChange.bind(this);
    this.handleBedsChange = this.handleBedsChange.bind(this);
    this.handleAvgPatientsInMonthChange =
      this.handleAvgPatientsInMonthChange.bind(this);
    this.handlePeersChange = this.handlePeersChange.bind(this);
    this.handleNursesChange = this.handleNursesChange.bind(this);
    this.handleORsChange = this.handleORsChange.bind(this);
    this.handleSupervisedChange = this.handleSupervisedChange.bind(this);
    this.handleCompensationChange = this.handleCompensationChange.bind(this);
    this.handleTravelChange = this.handleTravelChange.bind(this);
    this.handleTravelHousingCoverageChange =
      this.handleTravelHousingCoverageChange.bind(this);
    this.addMoreJobs = this.addMoreJobs.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBedsCheckedChange = this.handleBedsCheckedChange.bind(this);
    this.handleAvgPatientsInMonthCheckedCheckedChange =
      this.handleAvgPatientsInMonthCheckedCheckedChange.bind(this);
    this.handlePeersCheckedChange = this.handlePeersCheckedChange.bind(this);
    this.handleNursesCheckedChange = this.handleNursesCheckedChange.bind(this);
    this.handleOrsCheckedChange = this.handleOrsCheckedChange.bind(this);
  }

  handleChange(name, value, i, notRequired, toggle) {
    const errorFieldName = name + "Error";
    let newVal = [...this.state.jobsInfo];
    let newValAtI = { ...newVal[i] };

    if (toggle) {
      newValAtI[name] = !newValAtI[name];
    } else {
      newValAtI[name] = value;
    }

    let updateError = this.state.updateError;
    if (name === "currentlyWorking" && newValAtI[name] === true) {
      newValAtI.assignmentToDate = "";
      newValAtI.assignmentToDateError = false;
      updateError = false;
    }

    newVal[i] = newValAtI;

    if (notRequired) {
      this.setState({
        jobsInfo: newVal,
        updateError,
      });
    } else {
      newValAtI[errorFieldName] = _.isEmpty(value);
      this.setState({
        jobsInfo: newVal,
        updateError: false,
      });
    }
  }

  handleSpecialityChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].speciality = value;
    newVal[i].specialityError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleFacilityNameChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].facilityName = value;
    newVal[i].facilityNameError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleOrganizationTypeChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].organizationType = value;
    newVal[i].organizationTypeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleFacilityTypeChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].facilityType = value;
    newVal[i].facilityTypeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleFacilitySubTypeChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].facilitySubType = value;
    newVal[i].facilitySubTypeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleAssignmentTypeChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].assignmentType = value;
    newVal[i].assignmentTypeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleAssignmentShiftTypeChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].assignmentShiftType = value;
    newVal[i].assignmentShiftTypeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handlePlaceChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].place = value;
    newVal[i].placeError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleCityChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].city = value;
    newVal[i].cityError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleStateChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].state = value;
    newVal[i].stateError = _.isEmpty(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleZipChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].zip = value;
    newVal[i].zipError = !isValidZip(value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleAssignmentFromDateChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].assignmentFromDate = value;
    newVal[i].assignmentFromDateError =
      _.isEmpty(value) || new Date(value) >= new Date();
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleAssignmentToDateChange(value, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].assignmentToDate = value;
    newVal[i].assignmentToDateError =
      (_.isEmpty(value) && newVal[i].currentlyWorking === false) ||
      !this.areValidFromToDates(newVal[i].assignmentFromDate, value);
    this.setState({
      jobsInfo: newVal,
      updateError: false,
    });
  }

  handleBedsChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].beds = e.target.value;
    newVal[i].bedsError = newVal[i].bedsChecked && (newVal[i].beds === 0 || newVal[i].beds === '0');
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleAvgPatientsInMonthChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].avgPatientsInMonth = e.target.value;
    newVal[i].avgPatientsInMonthError = newVal[i].avgPatientsInMonthChecked && (newVal[i].avgPatientsInMonth === 0 || newVal[i].avgPatientsInMonth === '0');
    this.setState({
      jobsInfo: newVal,
    });
  }

  handlePeersChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].peers = e.target.value;
    newVal[i].peersError = newVal[i].peersChecked && (newVal[i].peers === 0 || newVal[i].peers === '0');
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleNursesChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].nurses = e.target.value;
    newVal[i].nursesError = newVal[i].nursesChecked && (newVal[i].nurses === 0 || newVal[i].nurses === '0');
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleORsChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].ors = e.target.value;
    newVal[i].orsError = newVal[i].orsChecked && (newVal[i].ors === 0 || newVal[i].ors === '0');
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleSupervisedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].supervised = !newVal[i].supervised;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleCompensationChange(e, i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].compensation = e.target.value;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleTravelChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].travel = !newVal[i].travel;
    newVal[i].travelHousingCoverage = newVal[i].travel;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleTravelHousingCoverageChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].travelHousingCoverage = !newVal[i].travelHousingCoverage;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleBedsCheckedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].bedsChecked = !newVal[i].bedsChecked;
    newVal[i].beds = !newVal[i].bedsChecked ? 0 : newVal[i].beds;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleAvgPatientsInMonthCheckedCheckedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].avgPatientsInMonthChecked = !newVal[i].avgPatientsInMonthChecked;
    newVal[i].avgPatientsInMonth = !newVal[i].avgPatientsInMonthChecked
      ? 0
      : newVal[i].avgPatientsInMonth;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handlePeersCheckedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].peersChecked = !newVal[i].peersChecked;
    newVal[i].peers = !newVal[i].peersChecked ? 0 : newVal[i].peers;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleNursesCheckedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].nursesChecked = !newVal[i].nursesChecked;
    newVal[i].nurses = !newVal[i].nursesChecked ? 0 : newVal[i].nurses;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleOrsCheckedChange(i) {
    let newVal = [...this.state.jobsInfo];
    newVal[i].orsChecked = !newVal[i].orsChecked;
    newVal[i].ors = !newVal[i].orsChecked ? 0 : newVal[i].ors;
    this.setState({
      jobsInfo: newVal,
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  addMoreJobs() {
    this.setState((prevState) => ({
      jobsInfo: [...prevState.jobsInfo, newJobEntry],
    }));
  }

  areValidFromToDates(from, to) {
    if (_.isEmpty(to)) {
      return true;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const todayDate = new Date();
    return toDate >= fromDate && todayDate > toDate;
  }

  removeClick(i) {
    let jobsInfo = [...this.state.jobsInfo];
    if (!_.isNil(jobsInfo[i].medicalJobSeekerJobInfoId)) {
      this.props.deleteJobInfo(jobsInfo[i].medicalJobSeekerJobInfoId);
    }

    jobsInfo.splice(i, 1);
    this.setState({ jobsInfo, updateError: false });
  }

  validateFields() {
    const errors = {};
    let errorRows = [];
    errorRows.push("Please fix the errored fields in ");
    let updateError = false;
    let newVal = _.cloneDeep(this.state.jobsInfo);
    _.forEach(this.state.jobsInfo, (job, i) => {
      if (
        _.isEmpty(job.title) ||
        _.isEmpty(job.speciality) ||
        _.isEmpty(job.facilityName) ||
        _.isEmpty(job.organizationType) ||
        _.isEmpty(job.facilityType) ||
        _.isEmpty(job.facilitySubType) ||
        _.isEmpty(job.assignmentType) ||
        _.isEmpty(job.assignmentShiftType) ||
        _.isEmpty(job.place) ||
        _.isEmpty(job.city) ||
        _.isEmpty(job.state) ||
        !isValidZip(job.zip) ||
        _.isEmpty(job.assignmentFromDate) ||
        new Date(job.assignmentFromDate) >= new Date() ||
        (_.isEmpty(job.assignmentToDate) && job.currentlyWorking === false) ||
        !this.areValidFromToDates(
          job.assignmentFromDate,
          job.assignmentToDate
        ) ||
        (job.bedsChecked && (job.beds === 0 || job.beds === "0")) ||
        (job.avgPatientsInMonthChecked &&
          (job.avgPatientsInMonth === 0 || job.avgPatientsInMonth === "0")) ||
        (job.peersChecked && (job.peers === 0 || job.peers === "0")) ||
        (job.nursesChecked && (job.nurses === 0 || job.nurses === "0")) ||
        (job.orsChecked && (job.ors === 0 || job.ors === "0"))
      ) {
        newVal[i].titleError = _.isEmpty(job.title);
        newVal[i].specialityError = _.isEmpty(job.speciality);
        newVal[i].facilityNameError = _.isEmpty(job.facilityName);
        newVal[i].organizationTypeError = _.isEmpty(job.organizationType);
        newVal[i].facilityTypeError = _.isEmpty(job.facilityType);
        newVal[i].facilitySubTypeError = _.isEmpty(job.facilitySubType);
        newVal[i].assignmentTypeError = _.isEmpty(job.assignmentType);
        newVal[i].assignmentShiftTypeError = _.isEmpty(job.assignmentShiftType);
        newVal[i].placeError = _.isEmpty(job.place);
        newVal[i].cityError = _.isEmpty(job.city);
        newVal[i].stateError = _.isEmpty(job.state);
        newVal[i].zipError = !isValidZip(job.zip);
        newVal[i].assignmentFromDateError =
          _.isEmpty(job.assignmentFromDate) ||
          new Date(job.assignmentFromDate) >= new Date();
        newVal[i].assignmentToDateError =
          (_.isEmpty(job.assignmentToDate) && job.currentlyWorking === false) ||
          !this.areValidFromToDates(
            job.assignmentFromDate,
            job.assignmentToDate
          );
        newVal[i].bedsError =
          job.bedsChecked && (job.beds === 0 || job.beds === "0");
        newVal[i].avgPatientsInMonthError =
          job.avgPatientsInMonthChecked &&
          (job.avgPatientsInMonth === 0 || job.avgPatientsInMonth === "0");
        newVal[i].peersError = job.peersChecked && (job.peers === 0 || job.peers === "0");
        newVal[i].nursesError = job.nursesChecked && (job.nurses === 0 || job.nurses === "0");
        newVal[i].orsError = job.orsChecked && (job.ors === 0 || job.ors === "0");

        if (!updateError) {
          updateError = true;
        }

        errorRows.push(<Label>{" " + this.getJobTitle(job, i)}</Label>);
      }
    });

    this.setState({
      jobsInfo: newVal,
      updateError: false,
      errorRows,
    });

    errors.updateError = updateError;
    return errors;
  }

  handleSubmit() {
    const errors = this.validateFields();
    if (errors.updateError) {
      this.setState({ ...errors });
      return;
    }
    this.props.saveJobsInfo(this.state.jobsInfo);
  }

  handleBackClick() {
    this.props.saveJobInfoLocally(this.state.jobsInfo);
    this.props.history.push("/updateProfile");
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  getJobTitle(job, i) {
    if (!_.isEmpty(job.title) && !_.isEmpty(job.assignmentFromDate)) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const fromDate = new Date(job.assignmentFromDate);
      let toDateToShow;
      if (_.isEmpty(job.assignmentToDate)) {
        toDateToShow = "Ongoing";
      } else {
        const td = new Date(job.assignmentToDate);
        toDateToShow = td.toLocaleDateString("en-US", options);
      }

      const fromDateToShow = fromDate.toLocaleDateString("en-US", options);

      return job.title + ": " + fromDateToShow + " to " + toDateToShow;
    } else {
      return "Job " + (i + 1);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { activeIndex } = this.state;
    if (this.props.lnAuthStatus !== "success" ||
      this.props.formStatus === "success") {
      return (<Redirect to='/' />);
    }
    return (
      <div className="general-jobseekerjobinfo">
        <div className="general-jobseekerjobinfo-container">
          <Header size="medium" className="form-header">
            Please update your professional experience {this.props.userName}{" "}
            with the latest first.
          </Header>
          <Form
            error={
              !_.isNil(this.state.formError) ||
              this.props.formStatus === "failed"
            }
            loading={this.props.saveExtInfoLoading || this.props.formLoading}
          >
            <Accordion fluid styled>
              {this.state.jobsInfo.map((job, i) => (
                <div key={i}>
                  <Accordion.Title
                    active={activeIndex === i}
                    index={i}
                    onClick={this.handleClick}
                    key={i}
                  >
                    <div className="jobseekerjobinfo-jobtitle-row">
                      <div className="jobseekerjobinfo-jobtitle-dropdown">
                        <Icon name="dropdown" />
                      </div>
                      <div className="jobseekerjobinfo-jobtitle-label">
                        <Label>{this.getJobTitle(job, i)}</Label>
                      </div>
                      <div className="jobseekerjobinfo-jobtitle-button">
                        {i !== 0 && (
                          <Button
                            icon="delete"
                            color="red"
                            circular
                            size="mini"
                            className="delete-btn"
                            onClick={this.removeClick.bind(this, i)}
                          />
                        )}
                      </div>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content
                    active={activeIndex === i}
                    key={i + 1000}
                  >
                    <div className="jobseekerjobinfo-rows">
                      <div className="jobseekerjobinfo-ts-row">
                        <div className="jobseekerjobinfo-ts-title">
                          <label className="jobseekerjobinfo-ts-title-label">
                            Title
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-ts-title-input"
                            clearable
                            options={getTitleOptions()}
                            selection
                            value={job.title}
                            error={job.titleError}
                            name="title"
                            onChange={(e, { name, value }) =>
                              this.handleChange(name, value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-ts-specialty">
                          <label className="jobseekerjobinfo-ts-specialty-label">
                            Speciality
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-ts-specialty-input"
                            clearable
                            options={getSpecialityOptions()}
                            selection
                            value={job.speciality}
                            error={job.specialityError}
                            name="speciality"
                            onChange={(e, { name, value }) =>
                              this.handleChange(name, value, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-nameorg-row">
                        <div className="jobseekerjobinfo-nameorg-name">
                          <label className="jobseekerjobinfo-nameorg-name-label">
                            Name
                          </label>
                          <Form.Input
                            autoFocus
                            className="jobseekerjobinfo-nameorg-name-input"
                            name="facilityName"
                            value={job.facilityName}
                            error={job.facilityNameError}
                            onChange={(e, { name, value }) =>
                              this.handleChange(name, value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-nameorg-org">
                          <label className="jobseekerjobinfo-nameorg-org-label">
                            Organization Type
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-nameorg-org-input"
                            clearable
                            options={getOrganizationTypeOptions()}
                            selection
                            value={job.organizationType}
                            error={job.organizationTypeError}
                            onChange={(e, { value }) =>
                              this.handleOrganizationTypeChange(value, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-facility-row">
                        <div className="jobseekerjobinfo-facility-type">
                          <label className="jobseekerjobinfo-facility-type-label">
                            Facility Type
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-facility-type-input"
                            clearable
                            options={getFacilityTypeOptions()}
                            selection
                            value={job.facilityType}
                            error={job.facilityTypeError}
                            onChange={(e, { value }) =>
                              this.handleFacilityTypeChange(value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-facility-subtype">
                          <label className="jobseekerjobinfo-facility-subtype-label">
                            Facility Sub-type
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-facility-subtype-input"
                            clearable
                            options={getFacilitySubTypeOptions()}
                            selection
                            value={job.facilitySubType}
                            error={job.facilitySubTypeError}
                            onChange={(e, { value }) =>
                              this.handleFacilitySubTypeChange(value, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-assignment-row">
                        <div className="jobseekerjobinfo-assignment-type">
                          <label className="jobseekerjobinfo-assignment-type-label">
                            Assignment Type
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-assignment-type-input"
                            clearable
                            options={getAssignmentTypeOptions()}
                            selection
                            value={job.assignmentType}
                            error={job.assignmentTypeError}
                            onChange={(e, { value }) =>
                              this.handleAssignmentTypeChange(value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-assignment-shift">
                          <label className="jobseekerjobinfo-assignment-shift-label">
                            Assignment Shift
                          </label>
                          <Dropdown
                            className="jobseekerjobinfo-assignment-shift-input"
                            clearable
                            options={getShiftTypeOptions()}
                            selection
                            value={job.assignmentShiftType}
                            error={job.assignmentShiftTypeError}
                            onChange={(e, { value }) =>
                              this.handleAssignmentShiftTypeChange(value, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-pcsz-row">
                        <div className="jobseekerjobinfo-pcsz-place">
                          <label className="jobseekerjobinfo-pcsz-place-label">
                            Place
                          </label>
                          <Form.Input
                            className="jobseekerjobinfo-pcsz-place-input"
                            name="place"
                            value={job.place}
                            error={job.placeError}
                            onChange={(e, { value }) =>
                              this.handlePlaceChange(value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-pcsz-city">
                          <label className="jobseekerjobinfo-pcsz-city-label">
                            City
                          </label>
                          <Form.Input
                            className="jobseekerjobinfo-pcsz-city-input"
                            name="city"
                            value={job.city}
                            error={job.cityError}
                            onChange={(e, { value }) =>
                              this.handleCityChange(value, i)
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-pcsz-statezip">
                          <div className="jobseekerjobinfo-pcsz-state">
                            <label className="jobseekerjobinfo-pcsz-state-label">
                              State
                            </label>
                            <Dropdown
                              className="jobseekerjobinfo-pcsz-state-input"
                              clearable
                              options={getStateOptions()}
                              selection
                              value={job.state}
                              error={job.stateError}
                              onChange={(e, { value }) =>
                                this.handleStateChange(value, i)
                              }
                            />
                          </div>
                          <div className="jobseekerjobinfo-pcsz-zip">
                            <label className="jobseekerjobinfo-pcsz-zip-label">
                              Zip
                            </label>
                            <Form.Input
                              className="jobseekerjobinfo-pcsz-zip-input"
                              name="zip"
                              value={job.zip}
                              error={job.zipError}
                              onChange={(e, { value }) =>
                                this.handleZipChange(value, i)
                              }
                            />
                        </div>
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-dwheader-row">
                        <label className="jobseekerjobinfo-dwheader-label">
                          Date Worked:
                        </label>
                      </div>
                      <div className="jobseekerjobinfo-dw-row">
                        <div className="jobseekerjobinfo-dw-from">
                          <label className="jobseekerjobinfo-dw-from-label">
                            From
                          </label>
                          <input
                            type="date"
                            className={
                              job.assignmentFromDateError
                                ? "jobseekerjobinfo-dw-from-input jobseekerjobinfo-date-error"
                                : "jobseekerjobinfo-dw-from-input"
                            }
                            name="assignmentFromDate"
                            value={job.assignmentFromDate}
                            onChange={(e) =>
                              this.handleAssignmentFromDateChange(
                                e.target.value,
                                i
                              )
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-dw-to-group">
                          <div className="jobseekerjobinfo-dw-to">
                            <label className="jobseekerjobinfo-dw-to-label">
                              To
                            </label>
                            <input
                              type="date"
                              className={
                                job.assignmentToDateError
                                  ? "jobseekerjobinfo-dw-to-input jobseekerjobinfo-date-error"
                                  : "jobseekerjobinfo-dw-to-input"
                              }
                              name="assignmentToDate"
                              value={job.assignmentToDate}
                              disabled={job.currentlyWorking === true}
                              onChange={(e) =>
                                this.handleAssignmentToDateChange(
                                  e.target.value,
                                  i
                                )
                              }
                            />
                          </div>
                          <div className="jobseekerjobinfo-dw-working">
                            <Form.Checkbox
                              name="currentlyWorking"
                              defaultChecked={_.isNil(job.assignmentToDate)}
                              onChange={(e) =>
                                this.handleChange(
                                  "currentlyWorking",
                                  null,
                                  i,
                                  true,
                                  true
                                )
                              }
                              className="jobseekerjobinfo-dw-working-input"
                              label="Currently Working"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-count-row">
                        <label className="jobseekerjobinfo-count-label">
                          Number of Beds (if hospital):{" "}
                          <span
                            className={
                              job.bedsError
                                ? "jobseekerjobinfo-label-red"
                                : "jobseekerjobinfo-label-blue"
                            }
                          >
                            {job.beds === 0 || job.beds === "0"
                              ? "NA"
                              : job.beds}
                          </span>
                        </label>
                        <div className="jobseekerjobinfo-count-input">
                          <Radio
                            toggle
                            defaultChecked={job.bedsChecked}
                            className="jobseekerjobinfo-count-radio"
                            onChange={(e) => this.handleBedsCheckedChange(i)}
                          />
                          <input
                            type="range"
                            className="jobseekerjobinfo-count-slider"
                            name="beds"
                            disabled={!job.bedsChecked}
                            min={0}
                            max={1000}
                            step={50}
                            value={job.beds === "NA" ? 0 : job.beds}
                            onChange={(e) =>
                              this.handleBedsChange(e, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-count-row">
                        <label className="jobseekerjobinfo-count-label">
                          Average Patients per month:{" "}
                          <span
                            className={
                              job.avgPatientsInMonthError
                                ? "jobseekerjobinfo-label-red"
                                : "jobseekerjobinfo-label-blue"
                            }
                          >
                            {job.avgPatientsInMonth === 0 ||
                            job.avgPatientsInMonth === "0"
                              ? "NA"
                              : job.avgPatientsInMonth}
                          </span>
                        </label>
                        <div className="jobseekerjobinfo-count-input">
                          <Radio
                            toggle
                            defaultChecked={job.avgPatientsInMonthChecked}
                            className="jobseekerjobinfo-count-radio"
                            onChange={(e) =>
                              this.handleAvgPatientsInMonthCheckedCheckedChange(
                                i
                              )
                            }
                          />
                          <input
                            type="range"
                            className="jobseekerjobinfo-count-slider"
                            name="avgPatientsInMonth"
                            disabled={!job.avgPatientsInMonthChecked}
                            min={0}
                            max={250}
                            step={10}
                            value={
                              job.avgPatientsInMonth === "NA"
                                ? 0
                                : job.avgPatientsInMonth
                            }
                            onChange={(e) =>
                              this.handleAvgPatientsInMonthChange(e, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-count-row">
                        <label className="jobseekerjobinfo-count-label">
                          Number of Peers:{" "}
                          <span
                            className={
                              job.peersError
                                ? "jobseekerjobinfo-label-red"
                                : "jobseekerjobinfo-label-blue"
                            }
                          >
                            {job.peers === 0 || job.peers === "0"
                              ? "NA"
                              : job.peers}
                          </span>
                        </label>
                        <div className="jobseekerjobinfo-count-input">
                          <Radio
                            toggle
                            defaultChecked={job.peersChecked}
                            className="jobseekerjobinfo-count-radio"
                            onChange={(e) => this.handlePeersCheckedChange(i)}
                          />
                          <input
                            type="range"
                            className="jobseekerjobinfo-count-slider"
                            disabled={!job.peersChecked}
                            name="peers"
                            min={0}
                            max={25}
                            value={job.peers === "NA" ? 0 : job.peers}
                            onChange={(e) => this.handlePeersChange(e, i)}
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-count-row">
                        <label className="jobseekerjobinfo-count-label">
                          Number of Nurses:{" "}
                          <span
                            className={
                              job.nursesError
                                ? "jobseekerjobinfo-label-red"
                                : "jobseekerjobinfo-label-blue"
                            }
                          >
                            {job.nurses === 0 || job.nurses === "0"
                              ? "NA"
                              : job.nurses}
                          </span>
                        </label>
                        <div className="jobseekerjobinfo-count-input">
                          <Radio
                            toggle
                            defaultChecked={job.nursesChecked}
                            className="jobseekerjobinfo-count-radio"
                            onChange={(e) => this.handleNursesCheckedChange(i)}
                          />
                          <input
                            type="range"
                            className="jobseekerjobinfo-count-slider"
                            disabled={!job.nursesChecked}
                            name="beds"
                            min={0}
                            max={25}
                            value={job.nurses === "NA" ? 0 : job.nurses}
                            onChange={(e) => this.handleNursesChange(e, i)}
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-count-row">
                        <label className="jobseekerjobinfo-count-label">
                          Number of ORs:{" "}
                          <span
                            className={
                              job.orsError
                                ? "jobseekerjobinfo-label-red"
                                : "jobseekerjobinfo-label-blue"
                            }
                          >
                            {job.ors === 0 || job.ors === "0"
                              ? "NA"
                              : job.ors}
                          </span>
                        </label>
                        <div className="jobseekerjobinfo-count-input">
                          <Radio
                            toggle
                            defaultChecked={job.orsChecked}
                            className="jobseekerjobinfo-count-radio"
                            onChange={(e) => this.handleOrsCheckedChange(i)}
                          />
                          <input
                            type="range"
                            className="jobseekerjobinfo-count-slider"
                            disabled={!job.orsChecked}
                            name="ors"
                            min={0}
                            max={10}
                            value={job.ors === "NA" ? 0 : job.ors}
                            onChange={(e) => this.handleORsChange(e, i)}
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-sc-row">
                        <div className="jobseekerjobinfo-sc-supervised">
                          <label className="jobseekerjobinfo-sc-supervised-label">
                            Supervised
                          </label>
                          <Radio
                            toggle
                            defaultChecked={job.supervised}
                            className="jobseekerjobinfo-sc-supervised-input"
                            onChange={(e) =>
                              this.handleChange(
                                "supervised",
                                null,
                                i,
                                true,
                                true
                              )
                            }
                          />
                        </div>
                        <div className="jobseekerjobinfo-row-sc-compensation">
                          <label className="jobseekerjobinfo-sc-compensation-label">
                            Compensation:{" "}
                            <span className="jobseekerjobinfo-label-blue">
                              {job.compensation}
                              {"$/hr"}
                            </span>
                          </label>
                          <input
                            type="range"
                            className="jobseekerjobinfo-sc-compensation-input"
                            name="compensation"
                            min={0}
                            max={1000}
                            step={5}
                            value={job.compensation}
                            onChange={(e) =>
                              this.handleCompensationChange(e, i)
                            }
                          />
                        </div>
                      </div>
                      <div className="jobseekerjobinfo-travel-row">
                        <div className="jobseekerjobinfo-travel-yn">
                          <label className="jobseekerjobinfo-travel-yn-label">
                            Did you Travel?
                          </label>
                          <Radio
                            toggle
                            defaultChecked={job.travel}
                            className="jobseekerjobinfo-travel-yn-input"
                            onChange={(e) => this.handleTravelChange(i)}
                          />
                        </div>
                        <div className="jobseekerjobinfo-travel-covered">
                          <label className="jobseekerjobinfo-travel-covered-label">
                            Travel/House covered?
                          </label>
                          <Radio
                            toggle
                            defaultChecked={job.travelHousingCoverage}
                            disabled={!job.travel}
                            className="jobseekerjobinfo-travel-covered-input"
                            onChange={(e) =>
                              this.handleTravelHousingCoverageChange(i)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Accordion.Content>
                </div>
              ))}
            </Accordion>
            <div className="jobseekerjobinfo-error-row">
              {this.state.updateError && (
                <Message negative content={this.state.errorRows} />
              )}
              {this.props.formStatus === "failed" && (
                <Message negative content={this.props.formErrMsg} />
              )}
            </div>
          </Form>
        </div>
        <div className="jobseekerjobinfo-btn-row">
          <div className="jobseekerjobinfo-btn-back">
            <Button primary onClick={this.handleBackClick}>
              Back
            </Button>
          </div>
          <div className="jobseekerjobinfo-btn-more">
            <Button primary onClick={this.addMoreJobs}>
              I want to add more...
            </Button>
          </div>
          <div className="jobseekerjobinfo-btn-submit">
            <Button primary type="submit" onClick={this.handleSubmit}>
              I am done! Show me my Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lnAuthStatus: state.loginState.lnAuthStatus,
  userName: state.loginState.userName,
  extInfo: state.jobseekerState.extInfo,
  jobsInfo: state.jobseekerState.jobsInfo,
  saveExtInfoLoading: state.jobseekerState.saveExtInfoLoading,
  formStatus: state.jobseekerState.formStatus,
  formLoading: state.jobseekerState.formLoading,
  formErrMsg: state.jobseekerState.formErrMsg,
});

const mapDispatchToProps = {
  saveJobsInfo,
  saveJobInfoLocally,
  deleteJobInfo,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MedicalJobSeekerJobInfoList);
