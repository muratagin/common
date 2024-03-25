import { FILE_SERVER } from "@app/constant";
import { PrintOfferButton } from "@components/Offers/print.offer.button";
import TooltipComp from "@components/TooltipComp";
import Icon from "@components/icon";
import { Button } from "@radix-ui/themes";
import moment from "moment";
import {
  CheckboxActionRow,
  CurrencyTypeView,
  CustomCheckbox,
  OpenToSaleCheckboxButton,
  TooltipTextComponent,
} from "./custom.components";
import {
  checkIf,
  checkIfIsEmpty,
  checkPrivilegeInRoles,
  checkPrivilegesInRoles,
  getDownloadRedirect,
  getPartsOfSubObject,
  objIndex,
} from "./utils";

export const getColumnsSelector = ({
  field,
  row,
  index,
  refElement,
  customCheckboxRef,
  roles,
  updateRow,
  actionRow,
  transitionRow,
  tableComponent,
  handleRefresh,
  checkBoxActionUpdateRow,
  data,
  loading,
  ...props
}) => {
  switch (field.type) {
    case "checkbox":
    case "radio":
    case "select":
      if (field.action === true)
        return (
          <CustomCheckbox
            {...field}
            index={index + "-" + 10 * Math.random()}
            value={Boolean(row[field.model.view])}
            disabled={
              checkIf(field.privilege)
                ? !checkPrivilegeInRoles(field.privilege.id, roles)
                : false
            }
            change={(val) => updateRow(val, row, field.model.view)}
            refElement={refElement}
            ref={customCheckboxRef}
          />
        );
      else return Boolean(row[field.model.view]) ? "EVET" : "HAYIR";
    case "onHoverAction":
      return (
        <OnHoverActionButton
          index={index + "-" + 10 * Math.random()}
          actionRow={actionRow}
          field={field}
          row={row}
        />
      );
    case "StatusText":
      return (
        <StatusTextComponent
          index={index + "-" + 10 * Math.random()}
          actionRow={actionRow}
          field={field}
          row={row}
        />
      );
    case "TooltipText":
      return (
        <TooltipTextComponent
          index={index + "-" + 10 * Math.random()}
          actionRow={actionRow}
          field={field}
          row={row}
        />
      );
    case "TooltipView":
      return (
        <TooltipViewComponent
          index={index + "-" + 10 * Math.random()}
          actionRow={actionRow}
          field={field}
          row={row}
        />
      );
    case "date":
      return checkIf(objIndex(row, field.model.view)) &&
        row[field.model.view] !== ""
        ? moment(objIndex(row, field.model.view), "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          )
        : "";
    case "datetime":
      return checkIf(objIndex(row, field.model.view))
        ? moment(objIndex(row, field.model.view), "YYYY-MM-DDTHH:mm:ss").format(
            "DD/MM/YYYY HH:mm"
          )
        : "";
    case "currencyFormatter":
      return <CurrencyTypeView row={row} field={field} />;
    case "printOfferButton":
      return <PrintOfferButton row={row} field={field} />;
    case "MediaName":
      return (
        <button
          className="btn btn-link btn-sm"
          onClick={() =>
            getDownloadRedirect(`${FILE_SERVER}/${row.MediaPath}`, loading)
          }
        >
          {row[field.model.view]}
        </button>
      );
    case "downloadMedia":
      let split = field?.model?.view?.split(".");
      return (
        <button
          className="btn btn-link btn-sm"
          onClick={() =>
            getDownloadRedirect(`${FILE_SERVER}/${row.MediaPath}`, loading)
          }
        >
          {row[split[0]]?.[split[1]]}
        </button>
      );
    case "action":
      if (!tableComponent) {
        return field.action.items?.map((item) => {
          if (
            !checkIf(item.privilege) ||
            (checkIf(item.privilege) &&
              checkPrivilegesInRoles(item.privileges, roles))
          ) {
            if (
              !checkIfIsEmpty(item?.visibility?.conditionRowValue) ||
              (checkIfIsEmpty(item.visibility?.conditions) &&
                Array.isArray(item.visibility?.conditions) &&
                item.visibility?.conditions.some(
                  (x) => x === row[item?.visibility?.conditionRowValue]
                ))
            ) {
              return (
                <TooltipComp
                  key={"action" + item.label + 10 * Math.random()}
                  tooltipContent={item.label}
                >
                  <Button
                    className={`btn-${item.variant} btn table-icon`}
                    data-tip
                    onClick={(event) => actionRow(event, row, item)}
                  >
                    <Icon icon={item.icon} />
                  </Button>
                </TooltipComp>
              );
            } else {
              return null;
            }
          } else {
            return null;
          }
        });
      } else {
        return field.action.items?.map((item) => (
          <TooltipComp
            key={"action" + item.label + 10 * Math.random()}
            tooltipContent={item.label}
          >
            <Button
              disabled={Boolean(props.readonly)}
              className={`btn-${item.variant} btn table-icon`}
              data-tip
              onClick={(event) => actionRow(event, row, item)}
            >
              <Icon icon={item.icon} />
            </Button>
          </TooltipComp>
        ));
      }
    case "checkboxAction":
      return (
        <CheckboxActionRow
          handleRefresh={handleRefresh}
          index={index + "-" + 10 * Math.random()}
          row={row}
          field={field}
          data={data}
        />
      );
    case "openToSaleCheckboxButton":
      return (
        <OpenToSaleCheckboxButton
          handleRefresh={handleRefresh}
          index={index + "-" + 10 * Math.random()}
          row={row}
          field={field}
          data={data}
        />
      );
    case "imageFile":
      return (
        <div className="border flex justify-center items-center w-36 h-16 rounded-md px-2.5">
          <img
            className="w-full h-full object-contain"
            src={getPartsOfSubObject(row, field?.model?.view)}
            alt={field?.label}
          />
        </div>
      );

    default:
      break;
  }
};
