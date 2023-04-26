import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { history } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';


import { Button, Icon } from '@edx/paragon';
import { CalendarMonth, BookmarkAdd } from '@edx/paragon/icons';


import { AlertList } from '../../generic/user-messages';


import CourseDates from './widgets/CourseDates';
import CourseHandouts from './widgets/CourseHandouts';
import StartOrResumeCourseCard from './widgets/StartOrResumeCourseCard';
import StartAssessmentCard from './widgets/StartAssessmentsCard';
import WeeklyLearningGoalCard from './widgets/WeeklyLearningGoalCard';
import CourseTools from './widgets/CourseTools';
import { fetchOutlineTab } from '../data';
import messages from './messages';
import Section from './Section';
import ShiftDatesAlert from '../suggested-schedule-messaging/ShiftDatesAlert';
import UpgradeNotification from '../../generic/upgrade-notification/UpgradeNotification';
import UpgradeToShiftDatesAlert from '../suggested-schedule-messaging/UpgradeToShiftDatesAlert';
import useCertificateAvailableAlert from './alerts/certificate-status-alert';
import useCourseEndAlert from './alerts/course-end-alert';
import useCourseStartAlert from '../../alerts/course-start-alert';
import usePrivateCourseAlert from './alerts/private-course-alert';
import useScheduledContentAlert from './alerts/scheduled-content-alert';
import { useModel } from '../../generic/model-store';
import WelcomeMessage from './widgets/WelcomeMessage';
import ProctoringInfoPanel from './widgets/ProctoringInfoPanel';
import AccountActivationAlert from '../../alerts/logistration-alert/AccountActivationAlert';


import DateSummary from './DateSummary';
import { CourseTabsNavigation } from '../../course-tabs';


const AssessOutline = ({
 intl,
 activeTabSlug,
 children,
 metadataModel,
 unitId,
}) => {
 const {
   courseId,
   proctoringPanelStatus,
 } = useSelector(state => state.courseHome);


 const {


   celebrations,
   originalUserIsStaff,
   isSelfPaced,
   org,
   tabs,
   title,
   userTimezone,
 } = useModel('courseHomeMeta', courseId);


 const {


   course_image,
   short_description,
 } = useModel('coursewareMeta', courseId);


 const {
   accessExpiration,
   courseBlocks: {
     courses,
     sections,
   },
   courseGoals: {
     selectedGoal,
     weeklyLearningGoalEnabled,
   } = {},
   datesBannerInfo,
   datesWidget: {
     courseDateBlocks,
   },
   enableProctoredExams,
   offer,
   timeOffsetMillis,
   verifiedMode,
 } = useModel('outline', courseId);


 const {
   marketingUrl,
 } = useModel('coursewareMeta', courseId);


 const [expandAll, setExpandAll] = useState(false);


 const eventProperties = {
   org_key: org,
   courserun_key: courseId,
 };


 const {


   courseImage,
   shortDescription,
 } = useModel('coursewareMeta', courseId);




 // Below the course title alerts (appearing in the order listed here)
 const courseStartAlert = useCourseStartAlert(courseId);
 const courseEndAlert = useCourseEndAlert(courseId);
 const certificateAvailableAlert = useCertificateAvailableAlert(courseId);
 const privateCourseAlert = usePrivateCourseAlert(courseId);
 const scheduledContentAlert = useScheduledContentAlert(courseId);


 const rootCourseId = courses && Object.keys(courses)[0];


 const hasDeadlines = courseDateBlocks && courseDateBlocks.some(x => x.dateType === 'assignment-due-date');


 const logUpgradeToShiftDatesLinkClick = () => {
   sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
     ...eventProperties,
     linkCategory: 'personalized_learner_schedules',
     linkName: 'course_home_upgrade_shift_dates',
     linkType: 'button',
     pageName: 'course_home',
   });
 };


 const isEnterpriseUser = () => {
   const authenticatedUser = getAuthenticatedUser();
   const userRoleNames = authenticatedUser ? authenticatedUser.roles.map(role => role.split(':')[0]) : [];


   return userRoleNames.includes('enterprise_learner');
 };


 /** show post enrolment survey to only B2C learners */
 const learnerType = isEnterpriseUser() ? 'enterprise_learner' : 'b2c_learner';


 const location = useLocation();


 useEffect(() => {
   const currentParams = new URLSearchParams(location.search);
   const startCourse = currentParams.get('start_course');
   if (startCourse === '1') {
     sendTrackEvent('enrollment.email.clicked.startcourse', {});


     // Deleting the course_start query param as it only needs to be set once
     // whenever passed in query params.
     currentParams.delete('start_course');
     history.replace({
       search: currentParams.toString(),
     });
   }
 }, [location.search]);


 return (
   <>
     <div className="container-fluid">
       <div data-learner-type={learnerType} className="row w-100 mx-0 my-3 justify-content-between">
       <div className="col-8 col-sm-auto p-0 assessment_title">
         {/* <img src={courseImage}></img> */}
         <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--rTwykorI--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://thepracticaldev.s3.amazonaws.com/i/acj7wmyd64eku8uh45f9.jpeg" className='assessment_title_logo'/>
           <div role="heading" aria-level="1" className="h2 assessment_title_name">{title}</div>
       </div>
       <div className='col-5'>


         <div className='row course_dates'>
             {/* start date  */}
             <div className='col-3 px-3 text-center'>
               <div className="h5 row px-3 course_time_icon"> Starts On</div>
               <div className='row small'>
                 <ol className="list-unstyled" style={{ marginLeft: '10px;' }}>
                     {courseDateBlocks.map((courseDateBlock) => (
                       <DateSummary
                         key={courseDateBlock.date}
                         dateBlock={courseDateBlock}
                         userTimezone={userTimezone}
                       />
                     ))}
                   </ol>
               </div>
             </div>


             <div className="col course_seperator">|</div>
             {/* End date  */}
             <div className='col-3 px-3 text-center'>
               <div className="h5 row px-3">Ends On</div>
               <div className='row small'>
               <ol className="list-unstyled" style={{ marginLeft: '10px;' }}>
                   {courseDateBlocks.map((courseDateBlock) => (
                     <DateSummary
                       key={courseDateBlock.date}
                       dateBlock={courseDateBlock}
                       userTimezone={userTimezone}
                     />
                   ))}
                 </ol>


               </div>
             </div>


             <div className="col course_seperator">|</div>
             {/* Duration  */}
             <div className='col-3 px-3'>
               <div className="h5 row px-3">Time</div>
               <div className='row small'>120 mins</div>
             </div>
         </div>   
       </div>


     
     </div>
     <hr></hr>








       <div className="row course-outline-tab" >
         <AccountActivationAlert />
         <div className="col-8">
             <AlertList
                 topic="outline-course-alerts"
                 className="mb-3"
                 customAlerts={{
                   ...certificateAvailableAlert,
                   ...courseEndAlert,
                   ...courseStartAlert,
                   ...scheduledContentAlert,
                 }}
               />
               {isSelfPaced && hasDeadlines && (
               <>
                 <ShiftDatesAlert model="outline" fetch={fetchOutlineTab} />
                 <UpgradeToShiftDatesAlert model="outline" logUpgradeLinkClick={logUpgradeToShiftDatesLinkClick} />
               </>
               )}
            
             <div className='row h3 assessment_guidelines'>Assessment Guidelines</div>
             <div className='row my-3'>
               <p>This assessment has a time limit associated with it. To pass this exam, you must complete the exam in the time allowed. After you select I am ready   to start the exam, you will have
                 45 minutes to complete and submit the exam.</p>
               <p>Click on Start Assessment to start the test and ensure that you are attempting the test using
               the correct email ID.</p>
               <p>You must click End My Exam after you are done with the test.</p>
               <p>Once the test has started, the timer cannot be paused. You have to complete the test in
               one attempt.</p>
               <p>The candidate may not use his or her textbook, course notes, or receive help from a
               proctor or any other outside source.</p>
               <p>It is recommended that you ensure that your system meets Discoveri's compatibility
               requirements sent over email and check your Internet connection before starting the test.</p>
               <p>It is recommended that you attempt the test in an incognito or private window so that any
               extensions installed do not interfere with the test environment.</p>
               <p>We recommend that you close all other windows and tabs to ensure that there are no
               distractions.</p>




               <label class='checkbox black'>
                 <input type='checkbox'></input>
                 <span class='indicator'></span>
                 I have read all the instructions carefully and I'm ready to start the assessments
             </label>


             </div>
             <StartAssessmentCard />
        
         </div>
       </div>






     </div>




   </>
 );
};


AssessOutline.propTypes = {
 intl: intlShape.isRequired,
};


export default injectIntl(AssessOutline);





