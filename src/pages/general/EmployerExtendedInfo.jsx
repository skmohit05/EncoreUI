import React from "react";
import {
  Button,
  Header,
  Form,
  Message,
  Dropdown,
  Radio,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import _ from "lodash";
import { saveExtInfoState, clearErrors } from "../../slices/employerSlice";
import {
  getStateOptions,
  getCountryOptions,
  getOrganizationTypeOptions,
  getFacilityTypeOptions,
  getFacilitySubTypeOptions,
} from "../../util/dataUtil";
import { isValidZip } from "../../util/util";

class EmployerExtendedInfo extends React.Component {
  constructor(props) {
    super(props);
    const { extInfo, userInfo } = this.props;
    const org = userInfo.organization;
    this.state = {
      loading: false,
      organizationRole: _.isEmpty(extInfo) ? "" : extInfo.organizationRole,
      organizationName: _.isEmpty(org) ? "" : org.organizationName,
      organizationType: _.isEmpty(org) ? "" : org.organizationType,
      facilityType: _.isEmpty(org) ? "" : org.facilityType,
      facilitySubType: _.isEmpty(org) ? "" : org.facilitySubType,
      address1: _.isEmpty(extInfo) ? "" : extInfo.address1,
      address2: _.isEmpty(extInfo) ? "" : extInfo.address2,
      city: _.isEmpty(extInfo) ? "" : extInfo.city,
      state: _.isEmpty(extInfo) ? "" : extInfo.state,
      zip: _.isEmpty(extInfo) ? "" : extInfo.zip,
      country: "United States of America",
      phone: _.isEmpty(extInfo) ? "" : extInfo.phone,
      malpracticeCandidateAcceptable: _.isEmpty(extInfo)
        ? true
        : extInfo.malpracticeCandidateAcceptable,
      boardActionsCandidateAcceptable: _.isEmpty(extInfo)
        ? true
        : extInfo.boardActionsCandidateAcceptable,
      disciplinaryActionsCandidateAcceptable: _.isEmpty(extInfo)
        ? true
        : extInfo.disciplinaryActionsCandidateAcceptable,
      malpracticeCoverage: _.isEmpty(extInfo)
        ? true
        : extInfo.malpracticeCoverage,
      credentialingCoverage: _.isEmpty(extInfo)
        ? true
        : extInfo.credentialingCoverage,
      licenseCoverage: _.isEmpty(extInfo) ? true : extInfo.licenseCoverage,
      updateError: false,
      errMsg: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postJobClick = this.postJobClick.bind(this);
  }

  handleChange(name, value, notRequired) {
    const errorFieldName = name + "Error";
    let newVal = { ...this.state.extInfo };

    if (notRequired) {
      this.setState({
        [name]: value,
      });
    } else {
      this.setState({
        [name]: value,
        [errorFieldName]: _.isEmpty(value) || (name === 'zip' && !isValidZip(value)) || (name === 'phone' && _.size(value) != 10),
        updateError: false,
      });
    }
  }

  validateFields() {
    const errors = {};
    const {
      address1,
      city,
      state,
      zip,
      country,
      phone,
      organizationRole,
      organizationName,
      organizationType,
      facilityType,
      facilitySubType,
    } = this.state;
    let updateError = false;

    if (
      _.isEmpty(address1) ||
      _.isEmpty(city) ||
      !isValidZip(zip) ||
      _.isEmpty(state) ||
      _.isEmpty(country) ||
      _.isEmpty(phone) ||
      (_.size(phone) != 10) ||
      _.isEmpty(organizationRole) ||
      _.isEmpty(organizationName) ||
      _.isEmpty(organizationType) ||
      _.isEmpty(facilityType) ||
      _.isEmpty(facilitySubType)
    ) {
      updateError = true;
    }

    this.setState({
      ...updateError,
      address1Error: _.isEmpty(address1),
      cityError: _.isEmpty(city),
      zipError: !isValidZip(zip),
      stateError: _.isEmpty(state),
      countryError: _.isEmpty(country),
      phoneError: _.isEmpty(phone) || (_.size(phone) != 10),
      organizationRoleError: _.isEmpty(organizationRole),
      organizationNameError: _.isEmpty(organizationName),
      organizationTypeError: _.isEmpty(organizationType),
      facilityTypeError: _.isEmpty(facilityType),
      facilitySubTypeError: _.isEmpty(facilitySubType),
    });

    errors.updateError = updateError;
    return errors;
  }

  handleSubmit() {
    const errors = this.validateFields();
    if (errors.updateError) {
      this.setState({ ...errors });
      return false;
    }

    let userInfo = { ...this.props.userInfo };
    let organization = { ...userInfo.organization };
    organization.organizationName = this.state.organizationName;
    organization.organizationType = this.state.organizationType;
    organization.facilityType = this.state.facilityType;
    organization.facilitySubType = this.state.facilitySubType;
    userInfo.organization = organization;
    this.props.saveExtInfoState(this.state, userInfo);
    return true;
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  postJobClick() {
    if(this.handleSubmit()){
      this.props.history.push("/jobPosting");
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    if (this.props.lnAuthStatus !== "success" ||
      this.props.formStatus === "success") {
      return (<Redirect to='/' />);
    }

    return (
      <div className="general-employerextinfo">
        <div className="general-employerextinfo-container">
          <Header size="medium" className="form-header">
            Welcome to Encore Time {this.props.userName}.
          </Header>
          <Header.Subheader className="employerextinfo-subheader">
            Please update Your Profile.
          </Header.Subheader>
          <Form
            loading={this.props.formLoading}
            error={
              !_.isNil(this.state.formError) ||
              this.props.formStatus === "failed"
            }
            className="employerextinfo-rows"
          >
            <div className="employerextinfo-orgrole-row">
              <label className="employerextinfo-orgrole-label">
                Organization Role
              </label>
              <Form.Input
                autoFocus
                className="employerextinfo-orgrole-input"
                name="organizationRole"
                value={this.state.organizationRole}
                error={this.state.organizationRoleError}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-orgname-row">
              <label className="employerextinfo-orgname-label">
                Organization Name
              </label>
              <Form.Input
                className="employerextinfo-orgname-input"
                name="organizationName"
                value={this.state.organizationName}
                error={this.state.organizationNameError}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-orgtype-row">
              <label className="employerextinfo-orgtype-label">
                Organization Type
              </label>
              <Dropdown
                className="employerextinfo-orgtype-input"
                clearable
                options={getOrganizationTypeOptions()}
                selection
                value={this.state.organizationType}
                error={this.state.organizationTypeError}
                name="organizationType"
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-factype-row">
              <label className="employerextinfo-factype-label">
                Facility Type
              </label>
              <Dropdown
                className="employerextinfo-factype-input"
                clearable
                options={getFacilityTypeOptions()}
                selection
                value={this.state.facilityType}
                error={this.state.facilityTypeError}
                name="facilityType"
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-facsubtype-row">
              <label className="employerextinfo-facsubtype-label">
                Facility Sub Type
              </label>
              <Dropdown
                className="employerextinfo-facsubtype-input"
                clearable
                options={getFacilitySubTypeOptions()}
                selection
                value={this.state.facilitySubType}
                error={this.state.facilitySubTypeError}
                name="facilitySubType"
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-address-row">
              <div className="employerextinfo-address-label">
                <label>Address 1</label>
              </div>
              <div className="employerextinfo-address-input">
                <Form.Input
                  name="address1"
                  value={this.state.address1}
                  error={this.state.address1Error}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
            </div>
            <div className="employerextinfo-address-row">
              <div className="employerextinfo-address-label">
                <label>Address 2</label>
              </div>
              <div className="employerextinfo-address-input">
                <Form.Input
                  name="address2"
                  value={this.state.address2}
                  error={this.state.address2Error}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
            </div>
            <div className="employerextinfo-cszc-row">
              <div className="employerextinfo-cszc-city">
                <label className="employerextinfo-cszc-city-label">City</label>
                <Form.Input
                  className="employerextinfo-cszc-city-input"
                  name="city"
                  value={this.state.city}
                  error={this.state.cityError}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
              <div className="employerextinfo-cszc-state">
                <label className="employerextinfo-cszc-state-label">
                  State
                </label>
                <Dropdown
                  className="employerextinfo-cszc-state-input"
                  clearable
                  name="state"
                  options={getStateOptions()}
                  selection
                  error={this.state.stateError}
                  value={this.state.state}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
              <div className="employerextinfo-cszc-zip">
                <label className="employerextinfo-cszc-zip-label">Zip</label>
                <Form.Input
                  className="employerextinfo-cszc-zip-input"
                  name="zip"
                  value={this.state.zip}
                  error={this.state.zipError}
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
              <div className="employerextinfo-cszc-country">
                <label className="employerextinfo-cszc-country-label">
                  Country
                </label>
                <Dropdown
                  className="employerextinfo-cszc-country-input"
                  clearable
                  options={getCountryOptions()}
                  selection
                  error={this.state.countryError}
                  value={this.state.country}
                  name="country"
                  onChange={(e, { name, value }) =>
                    this.handleChange(name, value, false)
                  }
                />
              </div>
            </div>
            <div className="employerextinfo-phone-row">
              <label className="employerextinfo-phone-label">Phone</label>
              <Form.Input
                className="employerextinfo-phone-input"
                name="phone"
                value={this.state.phone}
                error={this.state.phoneError}
                onChange={(e, { name, value }) =>
                  this.handleChange(name, value, false)
                }
              />
            </div>
            <div className="employerextinfo-hcheader-row">
              <label className="employerextinfo-hcheader-label">
                Interested to hire candidates with
              </label>
            </div>
            <div className="employerextinfo-hc-row">
              <div className="employerextinfo-hc-field">
                <label className="employerextinfo-hc-label">
                  Malpractice Record?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.malpracticeCandidateAcceptable}
                  className="employerextinfo-hc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "malpracticeCandidateAcceptable",
                      !this.state.malpracticeCandidateAcceptable,
                      true
                    )
                  }
                />
              </div>
              <div className="employerextinfo-hc-field">
                <label className="employerextinfo-hc-label">
                  Board Actions Record?
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.boardActionsCandidateAcceptable}
                  className="employerextinfo-hc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "boardActionsCandidateAcceptable",
                      !this.state.boardActionsCandidateAcceptable,
                      true
                    )
                  }
                />
              </div>
              <div className="employerextinfo-hc-field">
                <label className="employerextinfo-hc-label">
                  Disciplinary Actions Record
                </label>
                <Radio
                  toggle
                  defaultChecked={
                    this.state.disciplinaryActionsCandidateAcceptable
                  }
                  className="employerextinfo-hc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "disciplinaryActionsCandidateAcceptable",
                      !this.state.disciplinaryActionsCandidateAcceptable,
                      true
                    )
                  }
                />
              </div>
            </div>

            <div className="employerextinfo-svcheader-row">
              <label className="employerextinfo-svcheader-label">
                Interested in the following services
              </label>
            </div>
            <div className="employerextinfo-svc-row">
              <div className="employerextinfo-svc-field">
                <label className="employerextinfo-svc-label">
                  Malpractice Coverage
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.malpracticeCoverage}
                  className="employerextinfo-svc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "malpracticeCoverage",
                      !this.state.malpracticeCoverage,
                      true
                    )
                  }
                />
              </div>
              <div className="employerextinfo-svc-field">
                <label className="employerextinfo-svc-label">
                  Credentialing Coverage
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.credentialingCoverage}
                  className="employerextinfo-svc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "credentialingCoverage",
                      !this.state.credentialingCoverage,
                      true
                    )
                  }
                />
              </div>
              <div className="employerextinfo-svc-field">
                <label className="employerextinfo-svc-label">
                  License Coverage
                </label>
                <Radio
                  toggle
                  defaultChecked={this.state.licenseCoverage}
                  className="employerextinfo-svc-input"
                  onChange={(e) =>
                    this.handleChange(
                      "licenseCoverage",
                      !this.state.licenseCoverage,
                      true
                    )
                  }
                />
              </div>
            </div>
            <div className="employerextinfo-btn-row">
              <div className="employerextinfo-row-child">
                <Button primary type="submit" onClick={this.handleSubmit}>
                  Update My Profile!
                </Button>
              </div>
              <div className="employerextinfo-row-child">
                <Button primary type="submit" onClick={this.postJobClick}>
                  Post Jobs
                </Button>
              </div>
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
  formStatus: state.employerState.extInfoFormStatus,
  formLoading: state.employerState.formLoading,
  formErrMsg: state.employerState.formErrMsg,
  userInfo: state.userState.user,
});

const mapDispatchToProps = {
  saveExtInfoState,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployerExtendedInfo);
