import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useModel } from '../../../../../generic/model-store';
import UpgradeNotification from '../../../../../generic/upgrade-notification/UpgradeNotification';
import messages from '../../../messages';
import SidebarBase from '../../common/SidebarBase';
import SidebarContext from '../../SidebarContext';
import NotificationTrigger, { ID } from './NotificationTrigger';
import SidebarSection from '../../SidebarSection';

const NotificationTray = ({ intl }) => {
  const {
    courseId,
    onNotificationSeen,
    shouldDisplayFullScreen,
    upgradeNotificationCurrentState,
    setUpgradeNotificationCurrentState,
  } = useContext(SidebarContext);

  const [expandAll, setExpandAll] = useState(false);
  const course = useModel('coursewareMeta', courseId);
  const {
    courseBlocks: {
      courses,
      sections,
    } 
    } = useModel('courseOutlineMeta', courseId);
    
  const rootCourseId = courses && Object.keys(courses)[0];

  const {
    
    contentTypeGatingEnabled,
    marketingUrl,
    offer,
    timeOffsetMillis,
    userTimezone,
  } = course;

  const {
    org,
    verifiedMode,
  } = useModel('courseHomeMeta', courseId);

  // After three seconds, update notificationSeen (to hide red dot)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setTimeout(onNotificationSeen, 3000); }, []);

  return (
    <SidebarBase
      title={intl.formatMessage(messages.coursetree)}
      ariaLabel={intl.formatMessage(messages.coursetree)}
      sidebarId={ID}
      className={classNames({ 'h-100': !verifiedMode && !shouldDisplayFullScreen })}
    >

              <ol id="courseware-outline" className="list-unstyled">
                {courses[rootCourseId].sectionIds.map((sectionId) => (
                  <SidebarSection
                    key={sectionId}
                    courseId={courseId}
                    defaultOpen={sections[sectionId].resumeBlock}
                    expand={expandAll}
                    section={sections[sectionId]}
                  />
                ))}
              </ol>
         

      <div>

      
      </div>
    </SidebarBase>
  );
};

NotificationTray.propTypes = {
  intl: intlShape.isRequired,
};

NotificationTray.Trigger = NotificationTrigger;
NotificationTray.ID = ID;

export default injectIntl(NotificationTray);
