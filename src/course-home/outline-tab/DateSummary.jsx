import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { FormattedDate } from '@edx/frontend-platform/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useModel } from '../../generic/model-store';
import { isLearnerAssignment } from '../dates-tab/utils';
import './DateSummary.scss';

const DateSummary = ({
  dateBlock,
  userTimezone,
}) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    org,
  } = useModel('courseHomeMeta', courseId);

  const linkedTitle = dateBlock.link && isLearnerAssignment(dateBlock);
  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const logVerifiedUpgradeClick = () => {
    sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
      org_key: org,
      courserun_key: courseId,
      linkCategory: '(none)',
      linkName: 'course_home_dates',
      linkType: 'link',
      pageName: 'course_home',
    });
  };

  return (
    <li className="p-0 mb-3 small">
      <div className="row">
      {/* Date formatted */}
        <div className="ml-1 font-weight-bold" style={{ fontSize: '14px' }}>
          <FormattedDate
            value={dateBlock.date}
            day="numeric"
            month="short"
            weekday="short"
            year="numeric"
            {...timezoneFormatArgs}
          />
        </div>
        {/* date format end */}
      </div>
    </li>
  );
};

DateSummary.propTypes = {
  dateBlock: PropTypes.shape({
    date: PropTypes.string.isRequired,
    dateType: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    linkText: PropTypes.string,
    title: PropTypes.string.isRequired,
    learnerHasAccess: PropTypes.bool,
  }).isRequired,
  userTimezone: PropTypes.string,
};

DateSummary.defaultProps = {
  userTimezone: null,
};

export default DateSummary;
