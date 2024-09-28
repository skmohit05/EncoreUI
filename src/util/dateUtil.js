import _ from 'lodash';
import { format }  from 'date-fns';

const formatDate = (dt) => format(_.isDate(dt) ? dt : new Date(dt), 'MM/dd/yyyy');

const areValidFromToDates = (from, to) => {
  if (_.isEmpty(to)) {
    return true;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const todayDate = new Date();
  return toDate >= fromDate && toDate > todayDate;
}

export { formatDate, areValidFromToDates };