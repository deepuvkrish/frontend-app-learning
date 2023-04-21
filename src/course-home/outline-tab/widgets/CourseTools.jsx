import React from 'react';
import { useSelector } from 'react-redux';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark, faCertificate, faInfo, faCalendar, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';

import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseTools = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const { org } = useModel('courseHomeMeta', courseId);
  const {
    courseTools,
  } = useModel('outline', courseId);

  if (courseTools.length === 0) {
    return null;
  }

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const logClick = (analyticsId) => {
    const { administrator } = getAuthenticatedUser();
    sendTrackingLogEvent('edx.course.tool.accessed', {
      ...eventProperties,
      course_id: courseId, // should only be courserun_key, but left as-is for historical reasons
      is_staff: administrator,
      tool_name: analyticsId,
    });
  };

  const renderIcon = (iconClasses) => {
    switch (iconClasses) {
      case 'edx.bookmarks':
        return faBookmark;
      case 'edx.tool.verified_upgrade':
        return faCertificate;
      case 'edx.tool.financial_assistance':
        return faInfo;
      case 'edx.calendar-sync':
        return faCalendar;
      case 'edx.updates':
        return faNewspaper;
      case 'edx.reviews':
        return faStar;
      default:
        return null;
    }
  };

  return (
    <section className="mb-4 course_tools_section">
      <span className="course_overview_title">{intl.formatMessage(messages.informative)}</span>
      <div className="course_auth_list">
        <div className="couse_inform">
          <span className='course_left'>Author Name</span>
          <span className='course_right'>Pratian</span>
        </div>
        <div className="couse_inform">
          <span className='course_left'>Level</span>
          <span className='course_right'>Beginner</span>
        </div>
        <div className="couse_inform">
          <span className='course_left'>Duration </span>
          <span className='course_right'>1h 40min</span>
        </div>
        <div className="couse_inform">
          <span className='course_left'>Updated</span>
          <span className='course_right'>12 Jan 2023</span>
        </div>
      </div>

      
    </section>
  );
};

CourseTools.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseTools);
