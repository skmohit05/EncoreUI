import _ from 'lodash';

import { formatDate } from './dateUtil';

const formatSpeciality = ({ speciality }) => {
  const items = _.split(speciality, ',');
  const captialized = _.map(items, s => _.startCase(_.toLower(_.trim(s))));
  return _.join(captialized, ', ');
}

const formatDuration = ({ assignmentFromDate, assignmentToDate}) => {
  const fromDt = !_.isNil(assignmentFromDate) ? formatDate(assignmentFromDate) : '';
  const toDt= !_.isNil(assignmentToDate) ? formatDate(assignmentToDate) : '';

  if(!_.isEmpty(fromDt) && _.isEmpty(toDt)) {
    return `${fromDt}`;
  } else if (!_.isEmpty(fromDt) && !_.isEmpty(toDt)) {
    return `${fromDt} - ${toDt}`;
  } else if (!_.isEmpty(toDt)) {
    return `Till ${toDt}`;
  } else {
    return '';
  }
}

const formatCompensation = ({ compensation, compensationType, compensationRange }) => {
  if(!_.isNil(compensation)) {
    const compType = !_.isNil(compensationType) ? compensationType : 'Hourly';
    return `$${compensation} ${compType}`;
  }
  if (!_.isNil(compensationRange)) {
    return compensationRange
  }
  return '';
}

export { formatSpeciality, formatDuration, formatCompensation };