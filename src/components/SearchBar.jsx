import React from "react";
import { Button, Dropdown, Message } from "semantic-ui-react";
import _ from "lodash";

import {
  getTitles,
  getStates,
  getSpecialityOptions,
} from "./../util/dataUtil";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      noUser: this.props.userId === "" ? true : false,
      userType: this.props.userType,
      title:
        !_.isNil(this.props.title) &&
        getTitles().some((i) => i === this.props.title)
          ? this.props.title
          : "",
      specialty: this.props.specialty,
      stateCode: !_.isNil(this.props.stateCode) ? this.props.stateCode : "",
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSpecialtyChange = this.handleSpecialtyChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleTitleChange(e, { value }) {
    this.setState({ title: value });
  }

  handleSpecialtyChange(e, { value }) {
    this.setState({ specialty: value });
  }

  handleStateChange(e, { value }) {
    this.setState({ stateCode: value });
  }

  handleSearchClick() {
    if (this.props.tab === "find-talent") {
      if (_.isEmpty(this.props.userType)) {
        this.props.getAnonymousCandidatesCount(this.state);
      } else if (this.props.userType === "Employer") {
        const { title, specialty, stateCode } = this.state;
        this.props.handleSubmit(title, specialty, stateCode);
      }
    } else {
      this.props.getJobs(this.state);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      !state.noUser &&
      props.title === "" &&
      props.specialty === "" &&
      props.stateCode === ""
    ) {
      return ({
        ...state,
        title: "",
        specialty: "",
        stateCode: "",
        userType: "",
        noUser: props.userId === "",
        userId: "",
      });
    }
    return null;
  }

  isProfileNotFilled(){
    if(this.props.userType === 'JobSeeker' && _.isEmpty(this.props.jobseekerExtInfo)){
      return true;
    } else if(this.props.userType === "Employer" && _.isEmpty(this.props.employerExtInfo)){
      return true;
    }

    return false;
  }

  render() {
    const titleOptions = _.map(getTitles(), (title, index) => ({
      key: index,
      text: title,
      value: title,
    }));
    const stateOptions = _.map(getStates(), ({ name, code }, index) => ({
      key: index,
      text: code,
      value: name,
    }));
    return (
      <div className="search-bar-main">
        <div className="search-bar">
          <div className="search-bar-child">
            <label className="search-bar-child-label">Title</label>
            <Dropdown
              compact
              className="search-bar-title"
              clearable
              options={titleOptions}
              selection
              placeholder="Title"
              disabled={this.isProfileNotFilled()}
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className="search-bar-child">
            <label className="search-bar-child-label">Specialty</label>
            <Dropdown
              compact
              className="search-bar-specialty"
              clearable
              options={getSpecialityOptions()}
              selection
              placeholder="Specialty"
              disabled={this.isProfileNotFilled()}
              value={this.state.specialty}
              onChange={this.handleSpecialtyChange}
            />
          </div>
          <div className="search-bar-child">
            <label className="search-bar-child-label">State</label>
            <Dropdown
              compact
              className="search-bar-state"
              clearable
              options={stateOptions}
              selection
              placeholder="State"
              disabled={this.isProfileNotFilled()}
              value={this.state.stateCode}
              onChange={this.handleStateChange}
            />
          </div>
          <div className="search-bar-child">
            <Button
              primary
              type='submit'
              disabled={this.isProfileNotFilled()}
              onClick={this.handleSearchClick}
              className="search-bar-button"
            >
              Search
            </Button>
          </div>
        </div>
        {_.isEmpty(this.props.userType) && (
          <div className="section-extrainfo">
            <Message info compact>
              <p>
                Please Register/Login for most custom results that matches your
                experience.
              </p>
            </Message>
          </div>
        )}
        {this.props.userDataInitialized && this.props.userType === "Employer" &&
          _.isEmpty(this.props.empExtInfo) && (
            <div className="section-extrainfo">
              <Message info compact>
                <p>
                  Please update your profile for the best match to your
                  experience and also to customize your results based on your
                  liking (compensation, pager duty, off-hours etc.)
                </p>
              </Message>
            </div>
          )}
        {this.props.userDataInitialized && this.props.userType === "JobSeeker" &&
          _.isEmpty(this.props.jobseekerExtInfo) && (
            <div className="section-extrainfo">
              <Message info compact>
                <p>
                  Please update your profile for the best match to your
                  experience and also to customize your results based on your
                  liking (compensation, pager duty, off-hours etc.)
                </p>
              </Message>
            </div>
          )}
      </div>
    );
  }
}

export default SearchBar;
