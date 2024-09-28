import React from "react";
import {
  Button,
  Header,
  Form,
  Dropdown,
  Radio,
  Message,
  Label,
} from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";

import jobseekerSlice, {
  clearErrors,
  saveExtInfoState,
} from "./../../slices/jobseekerSlice";
import {
  getStateOptions,
  getCountryOptions,
  getJobTypeOptions,
  getShiftTypeOptions,
  getStates,
  getTitleOptions,
  getSpecialityOptions,
} from "./../../util/dataUtil";
import { isValidZip } from "../../util/util";

class JobSeekerExtendedInfo extends React.Component {
  constructor(props) {
    super(props);

    let stateLevelInfo = [];
    if (!_.isEmpty(this.props.extInfo.stateLevelInfo)) {
      for (var key in this.props.extInfo.stateLevelInfo) {
        let info = {
          stateLicenseCode: key,
          licenseExpirationDate:
            this.props.extInfo.stateLevelInfo[key].licenseExpirationDate,
          prescriptionAuthority:
            this.props.extInfo.stateLevelInfo[key].prescriptionAuthority,
        };

        stateLevelInfo.push(info);
      }
    } else {
      stateLevelInfo = [
        {
          stateLicenseCode: "",
          licenseExpirationDate: "",
          prescriptionAuthority: false,
        },
      ];
    }

    this.state = {
      userId: this.props.userId,
      address1: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.address1,
      address2: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.address2,
      city: _.isEmpty(this.props.extInfo) ? "" : this.props.extInfo.city,
      stateCode: _.isEmpty(this.props.extInfo) ? "" : this.props.extInfo.state,
      zip: _.isEmpty(this.props.extInfo) ? "" : this.props.extInfo.zip,
      country: "United States of America",
      title: _.isEmpty(this.props.extInfo) ? "" : this.props.extInfo.title,
      specialty: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.specialityType,
      malpractice: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.malpractice,
      malpracticeInfo: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.malpracticeInfo,
      boardActions: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.boardActions,
      boardActionsInfo: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.boardActionsInfo,
      disciplinaryActions: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.disciplinaryActions,
      disciplinaryActionsInfo: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.disciplinaryActionsInfo,
      lossOfPrivileges: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.lossOfPrivileges,
      lossOfPrivilegesInfo: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.lossOfPrivilegesInfo,
      epicExperience: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.epicExperience,
      compensation: _.isNil(this.props.extInfo.compensation)
        ? "0"
        : this.props.extInfo.compensation,
      yearsExperience: _.isNil(this.props.extInfo.yearsExperience)
        ? "0"
        : this.props.extInfo.yearsExperience,
      jobPreference: _.isEmpty(this.props.extInfo)
        ? "LocumTenens"
        : this.props.extInfo.jobPreferenceType,
      shiftPreference: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.shiftPreferenceType,
      travel: _.isEmpty(this.props.extInfo) ? true : this.props.extInfo.travel,
      travelStatePreference: _.isEmpty(this.props.extInfo)
        ? ""
        : this.props.extInfo.travelStatePreference,
      callPreference: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.callPreference,
      governmentAssignment: _.isEmpty(this.props.extInfo)
        ? true
        : this.props.extInfo.governmentAssignment,
      loading: false,
      stateLevelInfo,
      updateError: false,
      epicExperienceYearsError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleStateLicenseChange = this.handleStateLicenseChange.bind(this);
    this.handleTravelStatePreferenceChange =
      this.handleTravelStatePreferenceChange.bind(this);
    this.handleJobPreferenceChange = this.handleJobPreferenceChange.bind(this);
    this.handleShiftPreferenceChange =
      this.handleShiftPreferenceChange.bind(this);
    this.handlePrescriptionAuthorityChange =
      this.handlePrescriptionAuthorityChange.bind(this);
    this.handleMalpracticeChange = this.handleMalpracticeChange.bind(this);
    this.handleBoardActionsChange = this.handleBoardActionsChange.bind(this);
    this.handleDisciplinaryActionsChange =
      this.handleDisciplinaryActionsChange.bind(this);
    this.handleLossOfPrivilegesChange =
      this.handleLossOfPrivilegesChange.bind(this);
    this.handleEpicExperienceChange = this.handleEpicExperienceChange.bind(this);
    this.handleTravelChange = this.handleTravelChange.bind(this);
    this.handleCallPreferenceChange =
      this.handleCallPreferenceChange.bind(this);
    this.handleGovernmentAssignmentChange =
      this.handleGovernmentAssignmentChange.bind(this);
    this.handleLicenseExpirationDateChange =
      this.handleLicenseExpirationDateChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCompensationChange = this.handleCompensationChange.bind(this);
    this.handleYearsExperienceChange =
      this.handleYearsExperienceChange.bind(this);
    this.handleSpecialityChange = this.handleSpecialityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, { name, value }) {
    const errorFieldName = name + "Error";
    this.setState({
      [name]: value,
      [errorFieldName]: _.isEmpty(value),
      formError: null,
      updateError: false,
    });
  }

  handleZipChange(e, { name, value }) {
    const re = /^[0-9\-]+$/;
    this.setState({
      zip: value,
      zipError: !isValidZip(value),
      formError: null,
      updateError: false,
    });
  }

  addClick() {
    this.setState((prevState) => ({
      stateLevelInfo: [
        ...prevState.stateLevelInfo,
        {
          stateLicenseCode: "",
          licenseExpirationDate: "",
          prescriptionAuthority: false,
        },
      ],
    }));
  }

  removeClick(i) {
    let stateLevelInfo = [...this.state.stateLevelInfo];
    stateLevelInfo.splice(i, 1);
    this.setState({ stateLevelInfo });
  }

  handleCompensationChange(e) {
    this.setState({
      compensation: e.target.value,
      compensationError: e.target.value === "0",
      updateError: false,
    });
  }

  handleYearsExperienceChange(e) {
    this.setState({
      yearsExperience: e.target.value,
      yearsExperienceError: e.target.value === "0",
      updateError: false,
    });
  }

  handleTitleChange(e, { value }) {
    this.setState({
      title: value,
      titleError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleSpecialityChange(e, { value }) {
    this.setState({
      specialty: value,
      specialtyError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleStateChange(e, { value }) {
    this.setState({
      stateCode: value,
      stateCodeError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleCountryChange(e, { value }) {
    this.setState({
      country: value,
      countryError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleStateLicenseChange(value, i) {
    let newVal = this.state.stateLevelInfo;
    newVal[i].stateLicenseCode = value;
    if (_.isEmpty(newVal[i].stateLicenseCode)) {
      newVal[i].prescriptionAuthority = false;
      newVal[i].licenseExpirationDate = "";
    }
    this.setState({
      stateLevelInfo: newVal,
    });
  }

  handleLicenseExpirationDateChange(value, i) {
    let newVal = this.state.stateLevelInfo;
    newVal[i].licenseExpirationDate = value;
    this.setState({ stateLevelInfo: newVal });
  }

  handleTravelStatePreferenceChange(e, { value }) {
    this.setState({
      travelStatePreference: value,
      travelStatePreferenceError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleJobPreferenceChange(e, { value }) {
    this.setState({
      jobPreference: value,
      jobPreferenceError: _.isEmpty(value),
      updateError: false,
    });
  }

  handleShiftPreferenceChange(e, { value }) {
    this.setState({
      shiftPreference: value,
      shiftPreferenceError: _.isEmpty(value),
      updateError: false,
    });
  }

  handlePrescriptionAuthorityChange(i) {
    let newVal = this.state.stateLevelInfo;
    newVal[i].prescriptionAuthority = !newVal[i].prescriptionAuthority;
    this.setState({ stateLevelInfo: newVal });
  }

  handleGovernmentAssignmentChange(e, { value }) {
    this.setState({ governmentAssignment: !this.state.governmentAssignment });
  }

  handleCallPreferenceChange(e, { value }) {
    this.setState({ callPreference: !this.state.callPreference });
  }

  handleTravelChange(e, { value }) {
    const err =
      !this.state.travel === false
        ? false
        : this.state.travelStatePreferenceError;
    this.setState({
      travel: !this.state.travel,
      travelStatePreference: "",
      travelStatePreferenceError: err,
      updateError: err,
    });
  }

  handleEpicExperienceChange(e, { value }) {
    this.setState({
      epicExperience: !this.state.epicExperience,
    });
  }

  handleLossOfPrivilegesChange(e, { value }) {
    const err =
      !this.state.lossOfPrivileges === false
        ? false
        : this.state.boardActionsInfoError;
    this.setState({
      lossOfPrivileges: !this.state.lossOfPrivileges,
      lossOfPrivilegesInfo: "",
      lossOfPrivilegesInfoError: err,
      updateError: err,
    });
  }

  handleDisciplinaryActionsChange(e, { value }) {
    const err =
      !this.state.disciplinaryActions === false
        ? false
        : this.state.boardActionsInfoError;
    this.setState({
      disciplinaryActions: !this.state.disciplinaryActions,
      disciplinaryActionsInfo: "",
      disciplinaryActionsInfoError: err,
      updateError: err,
    });
  }

  handleBoardActionsChange(e, { value }) {
    const err =
      !this.state.boardActions === false
        ? false
        : this.state.boardActionsInfoError;
    this.setState({
      boardActions: !this.state.boardActions,
      boardActionsInfo: "",
      boardActionsInfoError: err,
      updateError: err,
    });
  }

  handleMalpracticeChange(e, { value }) {
    const err =
      !this.state.malpractice === false
        ? false
        : this.state.malpracticeInfoError;
    this.setState({
      malpractice: !this.state.malpractice,
      malpracticeInfo: "",
      malpracticeInfoError: err,
      updateError: err,
    });
  }

  handleSubmit() {
    const errors = this.validateFields();
    if (errors.updateError) {
      this.setState({ ...errors });
      return;
    }

    this.props.saveExtInfoState(this.state);
    this.props.history.push("/updateProfile/jobsInfo");
  }

  validateFields() {
    const errors = {};
    let updateError = false;

    if (
      _.isEmpty(this.state.address1) ||
      _.isEmpty(this.state.city) ||
      !isValidZip(this.state.zip) ||
      _.isEmpty(this.state.stateCode) ||
      _.isEmpty(this.state.country) ||
      _.isEmpty(this.state.title) ||
      _.isEmpty(this.state.specialty) ||
      _.isEmpty(this.state.jobPreference) ||
      _.isEmpty(this.state.shiftPreference) ||
      (this.state.malpractice && _.isEmpty(this.state.malpracticeInfo)) ||
      (this.state.disciplinaryActions &&
        _.isEmpty(this.state.disciplinaryActionsInfo)) ||
      (this.state.lossOfPrivileges &&
        _.isEmpty(this.state.lossOfPrivilegesInfo)) ||
      (this.state.boardActions && _.isEmpty(this.state.boardActionsInfo)) ||
      (this.state.travel && _.isEmpty(this.state.travelStatePreference)) ||
      this.state.compensation === "0" ||
      this.state.yearsExperience === "0"
    ) {
      updateError = true;
    }

    this.setState({
      ...updateError,
      address1Error: _.isEmpty(this.state.address1),
      cityError: _.isEmpty(this.state.city),
      zipError: !isValidZip(this.state.zip),
      stateCodeError: _.isEmpty(this.state.stateCode),
      countryError: _.isEmpty(this.state.country),
      titleError: _.isEmpty(this.state.title),
      specialtyError: _.isEmpty(this.state.specialty),
      jobPreferenceError: _.isEmpty(this.state.jobPreference),
      shiftPreferenceError: _.isEmpty(this.state.shiftPreference),
      compensationError: this.state.compensation === "0",
      yearsExperienceError: this.state.yearsExperience === "0",
      travelStatePreferenceError:
        this.state.travel && _.isEmpty(this.state.travelStatePreference),
      boardActionsInfoError:
        this.state.boardActions && _.isEmpty(this.state.boardActionsInfo),
      lossOfPrivilegesInfoError:
        this.state.lossOfPrivileges &&
        _.isEmpty(this.state.lossOfPrivilegesInfo),
      disciplinaryActionsInfoError:
        this.state.disciplinaryActions &&
        _.isEmpty(this.state.disciplinaryActionsInfo),
      malpracticeInfoError:
        this.state.malpractice && _.isEmpty(this.state.malpracticeInfo),
    });
    errors.updateError = updateError;
    return errors;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  createUI() {
    return this.state.stateLevelInfo.map((el, i) => (
      <div
        className="jobseekerextinfo-statelicenseinfo"
        key={i}
      >
        <div className="jobseekerextinfo-statelicenseinfo-row">
          <div className="jobseekerextinfo-statelicenseinfo-state">
            <label className="jobseekerextinfo-statelicenseinfo-state-label">
              State License
            </label>
            <Dropdown
              className="jobseekerextinfo-statelicenseinfo-state-input"
              clearable
              options={getStateOptions()}
              selection
              value={el.stateLicenseCode}
              onChange={(e, { value }) => this.handleStateLicenseChange(value, i)}
            />
          </div>
          {!_.isEmpty(el.stateLicenseCode) && (
            <React.Fragment>
              <div className="jobseekerextinfo-statelicenseinfo-pa">
                <label className="jobseekerextinfo-statelicenseinfo-pa-label">
                  Prescription Authority?
                </label>
                <Radio
                  toggle
                  defaultChecked={el.prescriptionAuthority}
                  className="jobseekerextinfo-statelicenseinfo-pa-input"
                  onChange={(e) => this.handlePrescriptionAuthorityChange(i)}
                />
              </div>
              <div className="jobseekerextinfo-statelicenseinfo-led">
                <label className="jobseekerextinfo-statelicenseinfo-led-label">
                  License Expiration
                </label>
                <input
                  type="date"
                  className="jobseekerextinfo-statelicenseinfo-led-input"
                  name="dateOfPublish"
                  value={el.licenseExpirationDate}
                  onChange={(e) =>
                    this.handleLicenseExpirationDateChange(e.target.value, i)
                  }
                />
              </div>
            </React.Fragment>
          )}
          <div className="jobseekerextinfo-statelicenseinfo-buttons">
            {i === this.state.stateLevelInfo.length - 1 && (
              <Button
                className="jobseekerextinfo-statelicenseinfo-add-btn"
                color="blue"
                icon="add"
                disabled={_.isEmpty(el.stateLicenseCode)}
                onClick={this.addClick.bind(this)}
              />
            )}
            {i !== 0 && (
              <Button
                className="jobseekerextinfo-statelicenseinfo-delete-btn"
                icon="delete"
                color="red"
                onClick={this.removeClick.bind(this, i)}
              />
            )}
          </div>
        </div>
      </div>
    ));
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div className="general-jobseekerextinfo">
        <div className="general-jobseekerextinfo-container">
          <Header size="medium" className="form-header">
            Welcome to Encore Time {this.props.userName}.
          </Header>
          <Header.Subheader className="jobseekerextinfo-subheader">
            Please update Your Profile.
          </Header.Subheader>
          <Form
            loading={this.props.saveExtInfoLoading}
            error={!_.isNil(this.state.formError)}
            className="jobseekerextinfo-rows"
          >
            <div className="jobseekerextinfo-address-row">
              <div className="jobseekerextinfo-address-label">
                <label>Address 1</label>
              </div>
              <div className="jobseekerextinfo-address-input">
                <Form.Input
                  autoFocus
                  name="address1"
                  value={this.state.address1}
                  error={this.state.address1Error}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="jobseekerextinfo-address-row">
              <div className="jobseekerextinfo-address-label">
                <label>Address 2</label>
              </div>
              <div className="jobseekerextinfo-address-input">
                <Form.Input
                  name="address2"
                  value={this.state.address2}
                  error={this.state.address2Error}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="jobseekerextinfo-cszc-row">
              <div className="jobseekerextinfo-cszc-city">
                <label className="jobseekerextinfo-cszc-city-label">City</label>
                <Form.Input
                  className="jobseekerextinfo-cszc-city-input"
                  name="city"
                  value={this.state.city}
                  error={this.state.cityError}
                  onChange={this.handleChange}
                />
              </div>
              <div className="jobseekerextinfo-cszc-statezip">
                <div className="jobseekerextinfo-cszc-state">
                  <label className="jobseekerextinfo-cszc-state-label">
                    State
                  </label>
                  <Dropdown
                    className="jobseekerextinfo-cszc-state-input"
                    clearable
                    options={getStateOptions()}
                    selection
                    error={this.state.stateCodeError}
                    value={this.state.stateCode}
                    onChange={this.handleStateChange}
                  />
                </div>
                <div className="jobseekerextinfo-cszc-zip">
                  <label className="jobseekerextinfo-cszc-zip-label">Zip</label>
                  <Form.Input
                    className="jobseekerextinfo-cszc-zip-input"
                    name="zip"
                    value={this.state.zip}
                    error={this.state.zipError}
                    onChange={this.handleZipChange}
                  />
                </div>
              </div>
              <div className="jobseekerextinfo-cszc-country">
                <label className="jobseekerextinfo-cszc-country-label">
                  Country
                </label>
                <Dropdown
                  className="jobseekerextinfo-cszc-country-input"
                  clearable
                  options={getCountryOptions()}
                  selection
                  error={this.state.countryError}
                  value={this.state.country}
                  onChange={this.handleCountryChange}
                />
              </div>
            </div>
            <div className="jobseekerextinfo-ts-row">
              <div className="jobseekerextinfo-ts-title">
                <label className="jobseekerextinfo-ts-title-label">
                  Title
                </label>
                <Dropdown
                  className="jobseekerextinfo-ts-title-input"
                  clearable
                  options={getTitleOptions()}
                  selection
                  value={this.state.title}
                  error={this.state.titleError}
                  onChange={this.handleTitleChange}
                />
              </div>
              <div className="jobseekerextinfo-ts-specialty">
                <label className="jobseekerextinfo-ts-specialty-label">
                  Speciality
                </label>
                <Dropdown
                  className="jobseekerextinfo-ts-specialty-input"
                  clearable
                  options={getSpecialityOptions()}
                  selection
                  value={this.state.specialty}
                  error={this.state.specialtyError}
                  onChange={this.handleSpecialityChange}
                />
              </div>
            </div>
            {this.createUI()}
            <div className="jobseekerextinfo-ha-row">
              <div className="jobseekerextinfo-ha-selection">
                <label className="jobseekerextinfo-ha-selection-label">
                  Malpractice History?
                </label>
                <label title="Any Events?">
                  <Radio
                    toggle
                    defaultChecked={this.state.malpractice}
                    className="jobseekerextinfo-ha-selection-radio"
                    onChange={this.handleMalpracticeChange}
                  />
                </label>
              </div>
              <div className="jobseekerextinfo-ha-info">
                <label className="jobseekerextinfo-ha-info-label">
                  Malpractice Info
                </label>
                <Form.Input
                  className="jobseekerextinfo-ha-info-input"
                  name="malpracticeInfo"
                  disabled={!this.state.malpractice}
                  value={this.state.malpracticeInfo}
                  error={this.state.malpracticeInfoError}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-ha-row">
              <div className="jobseekerextinfo-ha-selection">
                <label className="jobseekerextinfo-ha-selection-label">
                  Board Action Record?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.boardActions}
                  className="jobseekerextinfo-ha-selection-radio"
                  onChange={this.handleBoardActionsChange}
                />
              </div>
              <div className="jobseekerextinfo-ha-info">
                <label className="jobseekerextinfo-ha-info-label">
                  Board Action Info
                </label>
                <Form.Input
                  className="jobseekerextinfo-ha-info-input"
                  name="boardActionsInfo"
                  disabled={!this.state.boardActions}
                  value={this.state.boardActionsInfo}
                  error={this.state.boardActionsInfoError}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-ha-row">
              <div className="jobseekerextinfo-ha-selection">
                <label className="jobseekerextinfo-ha-selection-label">
                  Disciplinary Actions?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.disciplinaryActions}
                  className="jobseekerextinfo-ha-selection-radio"
                  onChange={this.handleDisciplinaryActionsChange}
                />
              </div>
              <div className="jobseekerextinfo-ha-info">
                <label className="jobseekerextinfo-ha-info-label">
                  Disciplinary Actions Info
                </label>
                <Form.Input
                  className="jobseekerextinfo-ha-info-input"
                  name="disciplinaryActionsInfo"
                  disabled={!this.state.disciplinaryActions}
                  value={this.state.disciplinaryActionsInfo}
                  error={this.state.disciplinaryActionsInfoError}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-ha-row">
              <div className="jobseekerextinfo-ha-selection">
                <label className="jobseekerextinfo-ha-selection-label">
                  Loss of Privileges?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.lossOfPrivileges}
                  className="jobseekerextinfo-ha-selection-radio"
                  onChange={this.handleLossOfPrivilegesChange}
                />
              </div>
              <div className="jobseekerextinfo-ha-info">
                <label className="jobseekerextinfo-ha-info-label">
                  Loss of Privileges Info
                </label>
                <Form.Input
                  className="jobseekerextinfo-ha-info-input"
                  name="lossOfPrivilegesInfo"
                  disabled={!this.state.lossOfPrivileges}
                  value={this.state.lossOfPrivilegesInfo}
                  error={this.state.lossOfPrivilegesInfoError}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="jobseekerextinfo-ha-row">
              <div className="jobseekerextinfo-ha-selection">
                <label className="jobseekerextinfo-ha-selection-label">
                  Epic Experience?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.epicExperience}
                  className="jobseekerextinfo-ha-selection-radio"
                  onChange={this.handleEpicExperienceChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-compensation-row">
              <label className="jobseekerextinfo-compensation-label">
                Compensation:{" "}
                <span
                  className={
                    this.state.compensationError
                      ? "jobseekerextinfo-label-red"
                      : "jobseekerextinfo-label-blue"
                  }
                >
                  {this.state.compensation}{"$/hr"}
                </span>
              </label>
              <input
                type="range"
                className="jobseekerextinfo-compensation-slider"
                name="compensation"
                min={0}
                max={1000}
                step={5}
                value={this.state.compensation}
                onChange={this.handleCompensationChange}
              />
            </div>
            <div className="jobseekerextinfo-experience-row">
              <label className="jobseekerextinfo-experience-label">
                Number of Years Experience:{" "}
                <span
                  className={
                    this.state.yearsExperienceError
                      ? "jobseekerextinfo-label-red"
                      : "jobseekerextinfo-label-blue"
                  }
                >
                  {this.state.yearsExperience}
                </span>
              </label>
              <input
                type="range"
                className="jobseekerextinfo-experience-slider"
                name="yearsExperience"
                min={0}
                max={35}
                value={this.state.yearsExperience}
                onChange={this.handleYearsExperienceChange}
              />
            </div>

            <div className="jobseekerextinfo-typepreference-row">
              <label className="jobseekerextinfo-typepreference-label">
                Job Type Preference
              </label>
              <Dropdown
                clearable
                options={getJobTypeOptions()}
                selection
                className="jobseekerextinfo-typepreference-input"
                value={this.state.jobPreference}
                error={this.state.jobPreferenceError}
                onChange={this.handleJobPreferenceChange}
              />
            </div>

            <div className="jobseekerextinfo-travelpreference-row">
              <div className="jobseekerextinfo-travelpreference-interested">
                <label className="jobseekerextinfo-travelpreference-interested-label">
                  Interested to Travel?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.travel}
                  className="jobseekerextinfo-travelpreference-interested-input"
                  onChange={this.handleTravelChange}
                />
              </div>
              <div className="jobseekerextinfo-travelpreference-state">
                <label className="jobseekerextinfo-travelpreference-state-label">
                  Preferred State
                </label>
                <Dropdown
                  clearable
                  options={getStateOptions()}
                  selection
                  className="jobseekerextinfo-travelpreference-state-input"
                  disabled={!this.state.travel}
                  value={this.state.travelStatePreference}
                  error={this.state.travelStatePreferenceError}
                  onChange={this.handleTravelStatePreferenceChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-shiftpreference-row">
              <div className="jobseekerextinfo-shiftpreference-selection">
                <label className="jobseekerextinfo-shiftpreference-selection-label">
                  Shift Preference
                </label>
                <Dropdown
                  clearable
                  options={getShiftTypeOptions()}
                  selection
                  className="jobseekerextinfo-shiftpreference-selection-input"
                  value={this.state.shiftPreference}
                  error={this.state.shiftPreferenceError}
                  onChange={this.handleShiftPreferenceChange}
                />
              </div>
              <div className="jobseekerextinfo-shiftpreference-oncall">
                <label className="jobseekerextinfo-shiftpreference-oncall-label">
                  Interested in Oncall?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.callPreference}
                  className="jobseekerextinfo-shiftpreference-oncall-input"
                  onChange={this.handleCallPreferenceChange}
                />
              </div>
            </div>

            <div className="jobseekerextinfo-governmentassignment-row">
              <label className="jobseekerextinfo-governmentassignment-label">
                Interested in Government Assignment?
              </label>
              <Radio
                toggle
                className="jobseekerextinfo-governmentassignment-input"
                defaultChecked={this.state.governmentAssignment}
                onChange={this.handleGovernmentAssignmentChange}
              />
            </div>
            <div className="jobseekerextinfo-continuebtn-row">
              <Button
                primary
                type="submit"
                className="jobseekerextinfo-continuebtn-submit"
                onClick={this.handleSubmit}
              >
                Continue to add your Experience Information {">>>"}
              </Button>
            </div>
            {this.state.updateError && (
              <Message negative content="Please fill the errored fields!" />
            )}
            {this.props.saveExtInfoStatus === "failed" && (
              <Message negative content={this.props.saveExtInfoErrMsg} />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  saveExtInfoLoading: state.jobseekerState.saveExtInfoLoading,
  saveExtInfoErrMsg: state.jobseekerState.saveExtInfoErrMsg,
  lnAuthStatus: state.loginState.lnAuthStatus,
  userId: state.loginState.userId,
  userName: state.loginState.userName,
  extInfo: state.jobseekerState.extInfo,
});

const mapDispatchToProps = {
  saveExtInfoState,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobSeekerExtendedInfo);
