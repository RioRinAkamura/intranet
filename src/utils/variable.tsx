import moment from 'moment';

export const calcBusinessDays = (dDate1, dDate2) => {
  // input given as Date objects
  var iWeeks,
    iDateDiff,
    iAdjust = 0;
  if (dDate2 < dDate1) return 1; // error code if dates transposed
  if (moment(dDate1).isSameOrAfter(dDate2, 'day')) return 1;

  var iWeekday1 = dDate1.getDay(); // day of week
  var iWeekday2 = dDate2.getDay();
  iWeekday1 = iWeekday1 === 0 ? 7 : iWeekday1; // change Sunday from 0 to 7
  iWeekday2 = iWeekday2 === 0 ? 7 : iWeekday2;

  if (iWeekday1 > 5 && iWeekday2 > 5) iAdjust = 1; // adjustment if both days on weekend

  iWeekday1 = iWeekday1 > 5 ? 5 : iWeekday1; // only count weekdays
  iWeekday2 = iWeekday2 > 5 ? 5 : iWeekday2;

  // calculate difference in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
  iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000);

  if (iWeekday1 < iWeekday2) {
    //Equal to makes it reduce 5 days
    iDateDiff = iWeeks * 5 + (iWeekday2 - iWeekday1);
  } else {
    iDateDiff = (iWeeks + 1) * 5 - (iWeekday1 - iWeekday2);
  }

  iDateDiff -= iAdjust; // take into account both days on weekend

  return Number(iDateDiff + 1); // add 1 because dates are inclusive
};
