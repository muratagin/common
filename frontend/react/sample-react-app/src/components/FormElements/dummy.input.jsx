import DynamicComponent from "../dynamic.component";

const DummyInput = ({ handleChange, state, refElement, ...props }) => {
  return (
    <DynamicComponent
      addOrRemoveObjects={props.addOrRemoveObjects}
      boundCI={props.boundCI}
      boundId={props.boundId}
      refElement={refElement}
      property={props}
      state={state}
      handleChange={handleChange}
      component={props.component}
      // feedData={props.feedData}
      // handleRefresh={props?.handleRefresh}
      // getErrorClass={getErrorClass}
      // getErrorMessage={getErrorMessage}
      // updateEntityId={props?.updateEntityId}
      // actionRow={props.actionRow}
    ></DynamicComponent>
  );
};

export default DummyInput;
