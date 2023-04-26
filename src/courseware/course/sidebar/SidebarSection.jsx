import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton, Icon } from '@edx/paragon';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { KeyboardArrowUp } from '@edx/paragon/icons';
import { KeyboardArrowDown } from '@edx/paragon/icons';
import SidebarSequenceLink from './SidebarSequenceLink';
import { useModel } from '../../../generic/model-store';

import genericMessages from '../../../generic/messages';
import messages from '../messages';



const SidebarSection = ({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
}) => {
  const {
    complete,
    sequenceIds,
    title,
  } = section;
  const {
    courseBlocks: {
      sequences,
    },
  } = useModel('courseOutlineMeta', courseId);

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionTitle = (
    <div className="row w-100 m-0">
      <div className="col-10 ml-3 p-0 font-weight-bold text-dark-500">
        <span className="align-middle-sidebar">{title}</span>
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
      </div>
      <div className="col-auto p-0" />
    </div>
  );

  return (
    <li>
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        iconWhenClosed={(
          <Icon 
            src={KeyboardArrowUp}
            alt={intl.formatMessage(messages.openSection)}
            icon={faPlus}
            onClick={() => { setOpen(true); }}
            size="sm"
          />
        )}
        iconWhenOpen={(
          <Icon 
          src={KeyboardArrowDown}
          alt={intl.formatMessage(genericMessages.close)}
          onClick={() => { setOpen(false); }}
          size="sm"
           />
        )}
      >
        <ol className="list-unstyled">
          {sequenceIds.map((sequenceId, index) => (
            <SidebarSequenceLink
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              first={index === 0}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
};

SidebarSection.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
};

export default injectIntl(SidebarSection);
