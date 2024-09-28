import _ from "lodash";
import FuzzySet from "fuzzyset";

const titles = [
  { title: "CRNA", desc: "Certified Registered Nurse Anesthetist" },
  { title: "DNP", desc: "Doctor of Nursing Practice" },
  { title: "DO", desc: "Doctors of Osteopathic Medicine" },
  { title: "DPM", desc: "Doctor of Podiatric Medicine" },
  { title: "MD", desc: "Doctor of Medicine" },
  { title: "NP", desc: "Nurse Practitioner" },
  { title: "PA", desc: "Physician Assistant" },
  { title: "RN", desc: "Registered Nurse" },
  { title: "STUDENT", desc: "" },
];

// const specialities = [
//   "ADDICTION MEDICINE",
//   "ADDICTION PSYCHIATRY",
//   "AEROSPACE MEDICINE",
//   "ALLERGY",
//   "ALLERGY/IMMUNOLOGY",
//   "ANATOMIC/CLINICAL PATHOLOGY",
//   "ANESTHESIOLOGY",
//   "CARDIAC ELECTROPHYSIOLOGY",
//   "CARDIOVASCULAR DISEASES",
//   "CHILD & ADOLESCENT PSYCHIATRY",
//   "CLINICAL/LABORATORY IMMUNOLOGY",
//   "CRITICAL CARE MEDICINE",
//   "DERMATOLOGY",
//   "DIABETES",
//   "EMERGENCY MEDICINE",
//   "ENDOCRINOLOGY",
//   "FAMILY PRACTICE",
//   "GASTROENTEROLOGY",
//   "GENERAL PRACTICE",
//   "GENERAL PREVENTIVE MEDICINE",
//   "GERIATRIC MEDICINE - FP",
//   "GERIATRIC MEDICINE - IM",
//   "GYNECOLOGICAL ONCOLOGY",
//   "GYNECOLOGY",
//   "HOSPICE AND PALLIATIVE CARE",
//   "HOSPITALIST",
//   "IM/PEDIATRICS",
//   "IMMUNOLOGY",
//   "INFECTIOUS DISEASE",
//   "INTERNAL MEDICINE",
//   "INTERVENTIONAL CARDIOLOGY",
//   "MEDICAL ONCOLOGY",
//   "NEPHROLOGY",
//   "NEUROLOGICAL SURGERY",
//   "NEUROLOGY",
//   "NUCLEAR CARDIOLOGY",
//   "OBSTETRIC CRITICAL CARE MEDICINE",
//   "OBSTETRICS & GYNECOLOGY",
//   "OCCUPATIONAL MEDICINE",
//   "OPHTHALMOLOGY",
//   "ORTHOPEDIC SURGERY",
//   "OTOLARYNGOLOGY",
//   "PAIN MANAGEMENT",
//   "PEDIATRIC ANESTHESIOLOGY",
//   "PEDIATRIC CRITICAL CARE MEDICINE",
//   "PEDIATRIC EMERGENCY MEDICINE",
//   "PEDIATRIC HOSPITALIST",
//   "PEDIATRICS",
//   "PHYSICAL MEDICINE & REHABILITATION",
//   "PSYCHIATRY",
//   "PUBLIC HEALTH & GENERAL PREV. MED",
//   "PULMONARY CRITICAL CARE MEDICINE",
//   "PULMONARY DISEASE",
//   "RHEUMATOLOGY",
//   "SPORTS MEDICINE - EM",
//   "SPORTS MEDICINE - FP",
//   "SPORTS MEDICINE - PEDIATRIC",
//   "SPORTS MEDICINE-IM",
//   "URGENT CARE",
//   "UROLOGY",
//   "VASCULAR MEDICINE",
// ];

const states = [
  // { name: "Alabama", code: "AL", active: true },
  // { name: "Alaska", code: "AK", active: true },
  // { name: "Arizona", code: "AZ", active: true },
  // { name: "Arkansas", code: "AR", active: true },
  // { name: "California", code: "CA", active: true },
  // { name: "Colorado", code: "CO", active: true },
  // { name: "Connecticut", code: "CT", active: true },
  // { name: "Delaware", code: "DE", active: true },
  // { name: "Florida", code: "FL", active: true },
  // { name: "Georgia", code: "GA", active: true },
  // { name: "Hawaii", code: "HI", active: true },
  // { name: "Idaho", code: "ID", active: true },
  // { name: "Illinois", code: "IL", active: true },
  // { name: "Indiana", code: "IN", active: true },
  // { name: "Iowa", code: "IA", active: true },
  // { name: "Kansas", code: "KS", active: true },
  // { name: "Kentucky", code: "KY", active: true },
  // { name: "Louisiana", code: "LA", active: true },
  // { name: "Maine", code: "ME", active: true },
  // { name: "Maryland", code: "MD", active: true },
  // { name: "Massachusetts", code: "MA", active: true },
  // { name: "Michigan", code: "MI", active: true },
  // { name: "Minnesota", code: "MN", active: true },
  // { name: "Mississippi", code: "MS", active: true },
  // { name: "Missouri", code: "MO", active: true },
  // { name: "Montana", code: "MT", active: true },
  // { name: "Nebraska", code: "NE", active: true },
  // { name: "Nevada", code: "NV", active: true },
  // { name: "NewHampshire", code: "NH", active: true },
  // { name: "NewJersey", code: "NJ", active: true },
  // { name: "NewMexico", code: "NM", active: true },
  // { name: "NewYork", code: "NY", active: true },
  // { name: "NorthCarolina", code: "NC", active: true },
  // { name: "NorthDakota", code: "ND", active: true },
  { name: "Ohio", code: "OH", active: true },
  // { name: "Oklahoma", code: "OK", active: true },
  // { name: "Oregon", code: "OR", active: true },
  // { name: "Pennsylvania", code: "PA", active: true },
  // { name: "RhodeIsland", code: "RI", active: true },
  // { name: "SouthCarolina", code: "SC", active: true },
  // { name: "SouthDakota", code: "SD", active: true },
  // { name: "Tennessee", code: "TN", active: true },
  // { name: "Texas", code: "TX", active: true },
  // { name: "Utah", code: "UT", active: true },
  // { name: "Vermont", code: "VT", active: true },
  // { name: "Virginia", code: "VA", active: true },
  // { name: "Washington", code: "WA", active: true },
  // { name: "WestVirginia", code: "WV", active: true },
  // { name: "Wisconsin", code: "WI", active: true },
  // { name: "Wyoming", code: "WY", active: true },
];

const getSpecialityTypes = () => [
  { name: "Anesthesiology", type: "Anesthesiology", active: true },
  { name: "Cardiology", type: "Cardiology", active: true },
  { name: "Dermatology", type: "Dermatology", active: true },
  { name: "EmergencyMedicine", type: "Emergency Medicine", active: true },
  { name: "Endocrinology", type: "Endocrinology", active: true },
  { name: "FamilyPractice", type: "Family Practice", active: true },
  { name: "Gastroenterology", type: "Gastroenterology", active: true },
  { name: "GeneralPractice", type: "General Practice", active: true },
  { name: "Gynecology", type: "Gynecology", active: true },
  { name: "InternalMedicine", type: "Internal Medicine", active: true },
  { name: "Nephrology", type: "Nephrology", active: true },
  { name: "Neurology", type: "Neurology", active: true },
  { name: "Pediatrics", type: "Pediatrics", active: true },
  { name: "Psychiatry", type: "Psychiatry", active: true },
  { name: "Pulmonology", type: "Pulmonology", active: true },
];

const countries = [
  { name: "United States of America", code: "US", active: true },
];

const userTypes = [
  { name: "Employer", type: "Employer", active: true },
  { name: "JobSeeker", type: "JobSeeker", active: true },
];

const getJobTypes = () => [
  { name: "LocumTenens", type: "Locum Tenens", active: true },
  { name: "Permanent", type: "Permanent", active: true },
];

const getFacilityTypes = () => [
  { name: "ER", type: "ER", active: true },
  { name: "Hospital", type: "Hospital", active: true },
  { name: "ImagingCenter", type: "Imaging Center", active: true },
  { name: "OP", type: "OP", active: true },
];

const getFacilitySubTypes = () => [
  { name: "CommunityHospital", type: "Community Hospital", active: true },
  { name: "CriticalAccessHospital", type: "Critical Access Hospital", active: true },
  { name: "PrimacyCareCenter", type: "Primacy Care Center", active: true },
  { name: "TertiaryCareCenter", type: "Tertiary Care Center", active: true },
  { name: "TraumaCenter1", type: "Trauma Center 1", active: true },
  { name: "TraumaCenter2", type: "Trauma Center 2", active: true },
  { name: "TraumaCenter3", type: "Trauma Center 3", active: true },
  { name: "UniversityCenter", type: "University Center", active: true },
];

const getAssignmentTypes = () => [
  { name: "ER", type: "ER", active: true },
  { name: "OR", type: "OR", active: true },
  { name: "Outpatient", type: "Outpatient", active: true },
];

const organizationTypes = [
  { name: "Corporate", type: "Corporate", active: true },
  {
    name: "EmployeeBasedPractice",
    type: "Employee Based Practice",
    active: true,
  },
  { name: "PrivatePractice", type: "Private Practice", active: true },
];

const priorityFeatures1 = [
  { name: "Compensation", desc: "Salary" },
  { name: "NumberOfYears", desc: "Years of Experience" },
];

const priorityFeatures2 = [
  { name: "FacilityType", desc: "Facility Type" },
  { name: "MalpracticeCandidate", desc: "Malpractice Candidate Accepted" },
  { name: "PrescriptionAuthority", desc: "Prescription Authority Required" },
  { name: "AssignmentShift", desc: "Shift" },
  { name: "Supervision", desc: "Supervision Required" },
];

const getShiftTypes = () => [
  { name: "All", desc: "All", active: true },
  { name: "AllDay", desc: "All Day", active: true },
  { name: "Day", desc: "Day", active: true },
  { name: "Night", desc: "Night", active: true },
  { name: "NoPreference", desc: "No Preference", active: true },
  { name: "Variable", desc: "Variable", active: true },
  { name: "Weekend", desc: "Weekend", active: true },
];;

// const specialities = [

// ];

const getMatchingState = (condition) => {
  // const conditionUpperCase = _.toUpper(_.trim(condition));
  // if  (_.size(conditionUpperCase) === 2) {
  //   const codeMatchIndex = _.findIndex(states, (state) =>  conditionUpperCase === state.code);
  //   if (codeMatchIndex > -1) {
  //     return states[codeMatchIndex].name;
  //   }
  // }

  const stateNames = _.map(states, "name");
  const fs = FuzzySet(stateNames);
  const matches = fs.get(condition);
  if (!_.isEmpty(matches)) {
    console.log(matches);
    return matches[0][1];
  }

  const stateCodes = _.map(states, "code");
  const fsCodes = FuzzySet(stateCodes);
  const matchesCodes = fsCodes.get(condition);
  if (!_.isEmpty(matchesCodes)) {
    console.log(matchesCodes);
    return matchesCodes[0][1];
  }
};

// const getMatchingSpecialty = (condition) => {
//   const fs = FuzzySet(specialities);
//   const matches = fs.get(condition);
//   if (!_.isEmpty(matches)) {
//     console.log(matches);
//     return matches[0][1];
//   }
// };

const getTitles = () => _.map(titles, "title");

const getStates = () => _.filter(states, { active: true });

const getCountries = () => _.filter(countries, { active: true });

const getUserTypes = () => _.filter(userTypes, { active: true });

const getPriorityFeatures1 = (arr) =>
  priorityFeatures1.filter((el) => !arr.includes(el.name));

const getPriorityFeatures2 = (arr) =>
  priorityFeatures2.filter((el) => !arr.includes(el.name));

const getStateOptions = () =>
  _.map(getStates(), ({ name, code }, index) => ({
    key: index,
    text: code,
    value: name,
  }));

const getCountryOptions = () =>
  _.map(getCountries(), ({ name, code }, index) => ({
    key: index,
    text: code,
    value: name,
  }));

const getJobTypeOptions = () =>
  _.map(getJobTypes(), ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getShiftTypeOptions = () =>
  _.map(getShiftTypes(), ({ name, desc }, index) => ({
    key: index,
    text: desc,
    value: name,
  }));

const getTitleOptions = () =>
  _.map(getTitles(), (title, index) => ({
    key: index,
    text: title,
    value: title,
  }));

const getSpecialityOptions = () =>
  _.map(getSpecialityTypes(), ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getFacilityTypeOptions = () =>
  _.map(getFacilityTypes(), ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getFacilitySubTypeOptions = () =>
  _.map(getFacilitySubTypes(), ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getAssignmentTypeOptions = () =>
  _.map(getAssignmentTypes(), ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getOrganizationTypeOptions = () =>
  _.map(organizationTypes, ({ name, type }, index) => ({
    key: index,
    text: type,
    value: name,
  }));

const getPriorityFeature1Options = (arr) =>
  _.map(getPriorityFeatures1(arr), ({ name, desc }, index) => ({
    key: index,
    text: desc,
    value: name,
  }));

const getPriorityFeature2Options = (arr) =>
  _.map(getPriorityFeatures2(arr), ({ name, desc }, index) => ({
    key: index,
    text: desc,
    value: name,
  }));

export const newJobEntry = {
  title: "",
  speciality: "",
  facilityName: "",
  organizationType: "",
  facilityType: "",
  facilitySubType: "",
  assignmentType: "",
  assignmentShiftType: "",
  place: "",
  city: "",
  state: "",
  zip: "",
  assignmentFromDate: "",
  assignmentToDate: "",
  beds: "NA",
  peers: "NA",
  nurses: "NA",
  avgPatientsInMonth: "NA",
  ors: "NA",
  supervised: true,
  compensation: 0,
  travel: true,
  travelHousingCoverage: true,
};

export {
  getTitles,
  getStates,
  getMatchingState,
  getUserTypes,
  getCountries,
  getShiftTypes,
  getJobTypes,
  getStateOptions,
  getCountryOptions,
  getJobTypeOptions,
  getShiftTypeOptions,
  getTitleOptions,
  getSpecialityOptions,
  getFacilityTypeOptions,
  getFacilitySubTypeOptions,
  getAssignmentTypeOptions,
  getOrganizationTypeOptions,
  getPriorityFeature1Options,
  getPriorityFeature2Options,
  priorityFeatures1,
  priorityFeatures2
};
