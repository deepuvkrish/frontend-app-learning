import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';

const CourseTabsNavigation = ({
  activeTabSlug, className, tabs, intl,
}) => (
  <div id="courseTabsNavigation" className={classNames('course-tabs-navigation')}>
    <div className="container-xl">
      {/* STARTING FROM HERE */}
      <Tabs
        className="nav-underline-tabs"
        aria-label={intl.formatMessage(messages.courseMaterial)}
      >
        {/* NAVBAR STARTING FROM HERE */}
        {tabs.map(({ url, title, slug }) => (
          <a
            key={slug}
            className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
            href={url}
          >
            {title}
          </a>
        ))}
      </Tabs>
    </div>
  </div>
);

CourseTabsNavigation.propTypes = {                                                                                                                                                                                                                                                                                                                                  
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
