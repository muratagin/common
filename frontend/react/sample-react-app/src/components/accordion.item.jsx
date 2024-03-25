import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import classNames from 'classnames';
import Icon from './icon';

export const AccordionItem = ({
  expanded,
  id,
  title,
  handleChange,
  children,
  detailsStyle,
  className,
  onHoverExpanded,
  icon,
}) => {
  return (
    <div
      onMouseLeave={event => onHoverExpanded && handleChange(id)(event, false)}
    >
      <Accordion
        expanded={expanded === id}
        onChange={!onHoverExpanded && handleChange(id)}
        className="!rounded-3xl shadow-md"
        sx={{ '&:before': { height: 0 } }}
      >
        <AccordionSummary
          onMouseOver={event =>
            onHoverExpanded && handleChange(id)(event, true)
          }
          expandIcon={
            <Icon icon={icon || 'FaPlus'} className="h-5 w-5 text-black" />
          }
          id={`${id}-header`}
          className={classNames({
            'flex h-12 flex-row-reverse gap-x-2 px-7': true,
            [className]: className,
          })}
        >
          <h5 className="my-0 py-0 text-sm font-medium md:text-lg">{title}</h5>
        </AccordionSummary>
        <AccordionDetails
          className="flex w-full max-w-5xl flex-wrap justify-start gap-x-10 gap-y-7 px-2 font-light lg:px-7"
          style={detailsStyle}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
