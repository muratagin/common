import { Requests } from "@app/api";
import { CILIST } from "@app/ci.list";
import TooltipComp from "@components/TooltipComp";
import { CircularProgress } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MySwalData } from "./myswaldata";
import { getEntityUrl, getServiceUrl } from "./parser";
import {
  checkIf,
  currencyFormat,
  getPartsOfSubObject,
  getValues,
  isObjectIsNotEmpty,
  resErrorMessage,
} from "./utils";

const insuredStatusColorByCondition = {
  0: "#dc3545", //PASİF
  1: "#28a745", //AKTİF
};

export const TooltipTextComponent = ({ field, row }) => {
  let tooltip =
    field?.tooltipTextView && getValues(".", field?.tooltipTextView, row);
  let ordinal =
    field?.model?.create && getValues(".", field?.model?.create, row);
  let text = field?.model?.view && getValues(".", field?.model?.view, row);
  let color = field?.color;

  if (field?.model?.view?.split(".")[0] === "CompanyIdentifier") {
    text = CILIST.find((x) => x.CompanyIdentifier === text)?.CompanyName;
  }
  if (field?.colorConditionName === "claimStatus") {
    color = claimStatusColorByCondition[ordinal];
  }
  if (field?.colorConditionName === "policyStatus") {
    color = policyStatusColorByCondition[ordinal];
  }
  if (field?.colorConditionName === "insuredStatus") {
    color = insuredStatusColorByCondition[ordinal];
  }
  if (field?.colorConditionName === "isOpenToClaim") {
    color = isOpenToClaimColorByCondition[text === true ? 1 : 0];
    text = text ? " AÇIK" : "KAPALI";
  }
  if (field?.colorConditionName === "contractStatus") {
    color = contractStatusColorByCondition[text === true ? 1 : 0];
    text = text ? "AKTİF" : "PASİF";
  }
  if (field?.colorConditionName === "contractFullStatus") {
    color = contractFullStatusColorByCondition[ordinal];
  }
  if (field?.colorConditionName === "packageStatus") {
    color = packgeStatusColorByCondition[ordinal];
  }
  if (field?.colorConditionName === "isCompanySend") {
    color = isCompanySendColorByCondition[ordinal];
  }
  return (
    <>
      {tooltip ? (
        <TooltipComp tooltipContent={tooltip}>
          <p style={{ fontWeight: "bold", color }} className="tooltip-text">
            {text}
          </p>
        </TooltipComp>
      ) : (
        <p style={{ fontWeight: "bold", color }} className="tooltip-text">
          {text}
        </p>
      )}
    </>
  );
};

// eslint-disable-next-line react/display-name
export const CustomCheckbox = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  const handleChange = (e) => {
    let value = e.target.checked;
    setValue(value);
    props.change(value);
  };
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    changeValue(newValue) {
      setValue(newValue);
    },
  }));

  return (
    <div className="form-field">
      <div className="onoffswitch inline-block" style={{ top: "3px" }}>
        <input
          className="onoffswitch-checkbox"
          id={`${props.model.create}${props.index}`}
          type="checkbox"
          disabled={Boolean(props.disabled)}
          name={props.model.create}
          checked={value}
          onChange={handleChange}
          ref={props.refElement}
        />
        <label
          className="onoffswitch-label"
          htmlFor={`${props.model.create}${props.index}`}
        >
          <span className="onoffswitch-inner"></span>
          <span className="onoffswitch-switch"></span>
        </label>
      </div>
    </div>
  );
});

export const CheckboxActionRow = ({
  row,
  field,
  data,
  tableComponent,
  dragDropTable,
  handleRowChange,
  handleRefresh,
  ...props
}) => {
  const [state, setState] = useState(row);
  let checkboxAction = { ...field?.checkboxAction };
  useEffect(() => {
    setState(row);
  }, [row]);
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    let content = { ...state };
    let name = event.target.name;
    content[name] = event.target.checked;
    if (
      checkIf(checkboxAction) &&
      isObjectIsNotEmpty(checkboxAction) &&
      checkIf(checkboxAction.additionalFields) &&
      isObjectIsNotEmpty(checkboxAction.additionalFields)
    ) {
      let additionalFields = { ...checkboxAction.additionalFields };
      Object.entries(additionalFields).forEach(([key, value]) => {
        content[key] = value;
      });
    }

    let url = getEntityUrl(data);
    setLoading(true);
    Requests()
      .CommonRequest.put({ url, content })
      .then(({ data }) => {
        setState(data?.Data);
        if (field.laterRefresh) {
          handleRefresh();
        }
        setLoading(false);
        if (handleRowChange) {
          handleRowChange(data?.Data);
        }
      })
      .catch((error) => {
        MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
        setLoading(false);
      });
  };

  return (
    <div className="form-field">
      {!loading ? (
        <div className="onoffswitch inline-block" style={{ top: "5px" }}>
          <input
            className="onoffswitch-checkbox"
            id={`${field.model.view}${props.index}`}
            type="checkbox"
            defaultChecked={state[field.model.view] == 1 ? true : false}
            checked={state[field.model.view] == 1 ? true : false}
            name={field.model.view}
            onChange={handleChange}
          />
          <label
            className="onoffswitch-label"
            htmlFor={`${field.model.create}${props.index}`}
          >
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
          </label>
        </div>
      ) : (
        <CircularProgress size={20} />
      )}
    </div>
  );
};

export const OpenToSaleCheckboxButton = ({
  row,
  field,
  data,
  tableComponent,
  dragDropTable,
  handleRowChange,
  handleRefresh,
  ...props
}) => {
  const [state, setState] = useState(row);

  useEffect(() => {
    setState(row);
  }, [row]);

  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);

  const checkedValue = state[field.model.view] == 1 ? true : false;

  const handleChange = (event) => {
    let content = {
      Id: state?.Id,
    };

    let name = event.target.name;
    content[name] = event.target.checked;

    let url = getServiceUrl(field.service);
    setLoading(true);
    Requests()
      .CommonRequest.put({ url, content })
      .then(({ data }) => {
        setState(data?.Data);
        if (field.laterRefresh) {
          handleRefresh();
        }
        setLoading(false);
        if (handleRowChange) {
          handleRowChange(data?.Data);
        }
      })
      .catch((error) => {
        MySwal.fire(MySwalData("error", { text: resErrorMessage(error) }));
        setLoading(false);
      });
  };

  return (
    <div className="form-field">
      {!loading ? (
        <div className="onoffswitch inline-block" style={{ top: "5px" }}>
          <input
            className="onoffswitch-checkbox"
            id={`${field.model.view}${props.index}`}
            type="checkbox"
            defaultChecked={checkedValue}
            checked={checkedValue}
            name={field.model.view}
            onChange={handleChange}
          />
          <label
            className="onoffswitch-label"
            htmlFor={`${field.model.create}${props.index}`}
          >
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
          </label>
        </div>
      ) : (
        <CircularProgress size={20} />
      )}
    </div>
  );
};

export const CurrencyTypeView = ({ row, field }) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    setValue(getPartsOfSubObject(row, field?.model?.view));
  }, [row, field]);

  return <p>{value && currencyFormat(value)}</p>;
};
