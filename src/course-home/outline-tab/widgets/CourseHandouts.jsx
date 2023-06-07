import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import LmsHtmlFragment from '../LmsHtmlFragment';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseHandouts = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    handoutsHtml,
  } = useModel('outline', courseId);

  if (!handoutsHtml) {
    return null;
  }

  return (
    <></>    // <section className="mb-4">
    //   <span className="course_overview_title">{intl.formatMessage(messages.handouts)}</span>
    //   <span className="course_descrip">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quibusdam error mollitia id molestiae. Tempore quaerat porro quo veniam laboriosam, velit sit quis laudantium, perspiciatis adipisci minus voluptatibus accusantium commodi.</span>
    // </section>
  );
};

CourseHandouts.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseHandouts);
