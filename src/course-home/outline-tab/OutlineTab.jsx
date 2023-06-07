import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { history } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Button, Icon } from '@edx/paragon';
import { CalendarMonth, BookmarkAdd } from '@edx/paragon/icons';
import { Timer } from '@edx/paragon/icons';

import { AlertList } from '../../generic/user-messages';

import CourseDates from './widgets/CourseDates';
import CourseHandouts from './widgets/CourseHandouts';
import StartOrResumeCourseCard from './widgets/StartOrResumeCourseCard';
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

const OutlineTab = ({
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
    courseImage,
    shortDescription,
  } = useModel('coursedetailsMeta', courseId);
  

  // const tryex = JSON.stringify(media);
  // const exa = JSON.parse(tryex)
  // console.log("hoii" +  tryex)
  // console.log('hii'+ exa)
  // const newtrydata = exa.image.small


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

        {/* Background image added here  */}
        <div className="grid row">
          <div className="back_grad">
            <div className='radial_grad'></div>
            <img src={courseImage} className='back_img'/> 
            


            <div className="course_details_left col-xl-8 col-md-8 col-sm-8">
              <div className="course_title_description">
                <span className="course_title_name">{title}</span>
                <span className="course_title_short_description">{shortDescription}</span>
                
              
              </div>
              <div className="course_timing_description row">
                <div className="course_dates col-8">
                  <div className="course_start_date col">
                    <div className="course_time_icon">
                      <Icon src={CalendarMonth} />Starts On
                    </div>
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
                  <div className="col course_seperator">|</div>
                  <div className="course_end_date col">
                    <div className="course_time_icon">
                      <Icon src={CalendarMonth} />Ends On
                    </div>
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
                  <div className="course_duration col-3">
                    <div className="course_time_icon">
                    <Icon src={Timer} />Duration
                    </div>
                    <ol className="list-unstyled" style={{ marginLeft: '10px;' }}>
                      <span className="course_total_time">1 hour 30 minutes </span>
                    </ol>
                </div>
                </div>
                <div className="course_bookmark col-3">
                  <CourseTools/>
                </div>
              </div>
            </div>
            <div className="course_status_right col-xl-4 col-md-4 col-sm-4">
              <StartOrResumeCourseCard />
            </div>

          </div>
        </div>




        <div className="row course-outline-tab" >
            <div className="col col-12 col-md-8">

            <CourseTabsNavigation tabs={tabs} className="mb-3" activeTabSlug={activeTabSlug} />

            <AccountActivationAlert />
            <div className="col-12">
              <AlertList
                topic="outline-private-alerts"
                customAlerts={{
                  ...privateCourseAlert,
                }}
              />
            </div>

            <div data-learner-type={learnerType} className="row w-100 mx-0 my-3 justify-content-between">
              <div className="course_expand_section col-12 p-0">
                <div role="heading" aria-level="1" className="course_desc_abt">About the Course
                </div>
                <div className="col-12 col-md-auto p-0">
                  <Button className="expandBtn" block onClick={() => { setExpandAll(!expandAll); }} style={{ border: 'none', color:'#000' }}>
                    {expandAll ? intl.formatMessage(messages.collapseAll) : intl.formatMessage(messages.expandAll)}
                  </Button>
                </div>
              </div>
            </div>
              <hr className="hr_course"/>

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
            <WelcomeMessage courseId={courseId} />


            {rootCourseId && (
            <>
              <ol id="courseHome-outline" className="list-unstyled">
                {courses[rootCourseId].sectionIds.map((sectionId) => (
                  <Section
                    key={sectionId}
                    courseId={courseId}
                    defaultOpen={sections[sectionId].resumeBlock}
                    expand={expandAll}
                    section={sections[sectionId]}
                  />
                ))}
              </ol>
            </>
            )}
          </div>




          {rootCourseId && (
          <div className="col col-12 col-md-4 left_section_course">
            <ProctoringInfoPanel />
            { /** Defer showing the goal widget until the ProctoringInfoPanel has resolved or has been determined as
             disabled to avoid components bouncing around too much as screen is rendered */ }
            {(!enableProctoredExams || proctoringPanelStatus === 'loaded') && weeklyLearningGoalEnabled && (
              <WeeklyLearningGoalCard
                daysPerWeek={selectedGoal && 'daysPerWeek' in selectedGoal ? selectedGoal.daysPerWeek : null}
                subscribedToReminders={selectedGoal && 'subscribedToReminders' in selectedGoal ? selectedGoal.subscribedToReminders : false}
              />
            )}


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

            <section className="mb-4">
              <span className="course_overview_title">{intl.formatMessage(messages.handouts)}</span>
              <span className="course_descrip">{shortDescription}</span>
            </section>


            
            <UpgradeNotification
              offer={offer}
              verifiedMode={verifiedMode}
              accessExpiration={accessExpiration}
              contentTypeGatingEnabled={datesBannerInfo.contentTypeGatingEnabled}
              marketingUrl={marketingUrl}
              upsellPageName="course_home"
              userTimezone={userTimezone}
              shouldDisplayBorder
              timeOffsetMillis={timeOffsetMillis}
              courseId={courseId}
              org={org}
            />
          </div>
          )}
        </div>

      </div>
    </>
  );
};

OutlineTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OutlineTab);
