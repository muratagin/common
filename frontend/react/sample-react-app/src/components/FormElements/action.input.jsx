import { Fragment } from 'react';
import { checkIf } from '@libs/utils';
import TooltipComp from '../TooltipComp';
import { Button } from '@radix-ui/themes';
import Icon from '../icon';

const ActionInput = ({
  getErrorClass,
  setClaimReasonHistory,
  claimReasonHistory,
  ...props
}) => {
  return (
    <div className={`form-field ${getErrorClass()}`}>
      {props.action?.items.map((actionItem, index) => (
        <Fragment key={index}>
          <TooltipComp tooltipContent={actionItem.label}>
            <Button
              className="table-icon"
              disabled={props.readonly}
              data-tip
              data-for=""
              variant="primary"
              onClick={() =>
                props.model?.edit === 'claimReasonHistory' &&
                checkIf(props.boundId) &&
                setClaimReasonHistory({
                  show: true,
                  boundId: props.boundId,
                })
              }
              key={actionItem.label}
            >
              <Icon icon={actionItem.icon || 'FaPlus'} />
            </Button>
          </TooltipComp>
        </Fragment>
      ))}
    </div>
  );
};

export default ActionInput;
