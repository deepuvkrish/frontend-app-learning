import React from 'react';
import { Button, Card, Icon } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { PlayCircleOutline } from '@edx/paragon/icons';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const StartOrResumeCourseCard = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    org,
  } = useModel('courseHomeMeta', courseId);

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const {
    resumeCourse: {
      hasVisitedCourse,
      url: resumeCourseUrl,
    },
  } = useModel('outline', courseId);

  if (!resumeCourseUrl) {
    return null;
  }

  const logResumeCourseClick = () => {
    sendTrackingLogEvent('edx.course.home.resume_course.clicked', {
      ...eventProperties,
      event_type: hasVisitedCourse ? 'resume' : 'start',
      url: resumeCourseUrl,
    });
  };

  return (
    <div className="mb-3 raised-card" data-testid="start-resume-card">
      <Card.Header
        actions={(
          <Button
            className="startResumeBtn" 
            block
            href={resumeCourseUrl}
            onClick={() => logResumeCourseClick()}
          >
            <Icon src={PlayCircleOutline} />
            {hasVisitedCourse ? intl.formatMessage(messages.resume) : intl.formatMessage(messages.start)}
          </Button>
        )}
      />
    </div>
  );
};

StartOrResumeCourseCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartOrResumeCourseCard);
