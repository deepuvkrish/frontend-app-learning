import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import { Icon } from '@edx/paragon';
import { KeyboardArrowUp } from '@edx/paragon/icons';
import { Check } from '@edx/paragon/icons';
import EffortEstimate from '../../../shared/effort-estimate';
import { useModel } from '../../../generic/model-store';
import messages from '../messages';

const SidebarSequenceLink = ({
  id,
  intl,
  courseId,
  first,
  sequence,
}) => {
  const {
    complete,
    description,
    due,
    showLink,
    title,
  } = sequence;
  const {
    userTimezone,
  } = useModel('courseOutlineMeta', courseId);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const coursewareUrl = <Link to={`/course/${courseId}/${id}`}>{title}</Link>;
  const displayTitle = showLink ? coursewareUrl : title;

  const dueDateMessage = (
    <FormattedMessage
      id="learning.outline.sequence-due-date-set"
      defaultMessage="{description} due {assignmentDue}"
      description="Used below an assignment title"
      values={{
        assignmentDue: (
          <FormattedTime
            key={`${id}-due`}
            day="numeric"
            month="short"
            year="numeric"
            timeZoneName="short"
            value={due}
            {...timezoneFormatArgs}
          />
        ),
        description: description || '',
      }}
    />
  );

  const noDueDateMessage = (
    <FormattedMessage
      id="learning.outline.sequence-due-date-not-set"
      defaultMessage="{description}"
      description="Used below an assignment title"
      values={{
        assignmentDue: (
          <FormattedTime
            key={`${id}-due`}
            day="numeric"
            month="short"
            year="numeric"
            timeZoneName="short"
            value={due}
            {...timezoneFormatArgs}
          />
        ),
        description: description || '',
      }}
    />
  );

  return (
    <li>
      <div className={classNames( { 'mt-2 pt-2': !first })}>
        <div className="row w-100 m-0" style={{ justifyContent: 'space-evenly' }}>
          <div className="col-auto p-0">
          </div>
          <div className="col-10 p-0 ml-3 text-break">
            <span >{displayTitle}</span>
            <span className="sr-only">
              , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
            </span>
            <EffortEstimate className="ml-3 align-middle" block={sequence} />
          </div>

          
          <Icon src={KeyboardArrowUp} />
        </div>
        <div className="row w-100 m-0 ml-3 pl-3">
          <small className="text-body pl-2">
            {due ? dueDateMessage : noDueDateMessage}
          </small>
        </div>
      </div>
    </li>
  );
};

SidebarSequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
};

export default injectIntl(SidebarSequenceLink);