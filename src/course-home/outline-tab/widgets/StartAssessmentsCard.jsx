import React from 'react';
import { Button, Card, Icon } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';


import { useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { PlayCircleOutline } from '@edx/paragon/icons';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';


const StartAssessmentCard = ({ intl }) => {
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
   <div className="row mb-5" data-testid="start-resume-card"> 
     <Card.Header
       actions={(
         <Button
           block
           href={resumeCourseUrl}
           onClick={() => logResumeCourseClick()}
           className="start_assessment"
         >
         {intl.formatMessage(messages.startassess)}
         </Button>
       )}
     />
   </div>
 );
};


StartAssessmentCard.propTypes = {
 intl: intlShape.isRequired,
};


export default injectIntl(StartAssessmentCard);





