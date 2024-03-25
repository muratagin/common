import * as Tooltip from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
const Trigger = forwardRef(({ children, ...props }, forwardedRef) => (
  <div {...props} ref={forwardedRef}>
    {children}
  </div>
));
const TooltipComp = ({ children, tooltipContent }) => {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Trigger>{children}</Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5}>
            {tooltipContent}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipComp;
