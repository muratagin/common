import { FILE_SERVER } from "@app/constant";
import {
  checkIf,
  checkPrivilegeInRoles,
  checkPrivilegeWithType,
  getDownloadRedirect,
} from "@libs/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import TooltipComp from "./TooltipComp";
import Icon from "./icon";

const AssetHeaderButton = ({
  data,
  actionRow,
  asset,
  handleCreateButtonClick,
  setImportModel,
  setImportModalShow,
  handleSelectableRowsButtonClick,
  setExportModalShow,
  assetType,
  ...props
}) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const roles = user?.Roles;
  let headerButtons = <></>;
  switch (assetType) {
    case "index":
      headerButtons = (
        <div className="flex justify-between">
          <h3 className="rdt_TableHeader">{data.label}</h3>
          <div
            className={
              props?.isModal
                ? "modal-table-head-btn flex gap-1"
                : "table-head-btn"
            }
            key="actionArea"
          >
            {
              // check if create is activated
              !data.model || data.model.create !== false ? (
                checkIf(data?.actions?.create) ? (
                  <TooltipComp tooltipContent={data?.actions?.create?.label}>
                    <button
                      className="btn btn-success cursor-pointer px-4 py-2.5"
                      data-tip
                      onClick={(event) =>
                        actionRow(event, null, data?.actions?.create)
                      }
                    >
                      <Icon icon={data?.actions?.create?.icon || "FaPlus"} />
                    </button>
                  </TooltipComp>
                ) : data.name !== "insurednotes" &&
                  data.name !== "contactnotes" ? (
                  checkPrivilegeWithType(
                    data?.headerActionsPrivilege?.create,
                    "show",
                    roles
                  ) ? (
                    <TooltipComp tooltipContent={"Ekle"}>
                      <Link
                        data-tip
                        data-for="createTool"
                        className="btn btn-success cursor-pointer px-4 py-2.5"
                        to={`/${asset}/create${location.search}`}
                      >
                        <Icon icon={"FaPlus"} />
                      </Link>
                    </TooltipComp>
                  ) : null
                ) : (
                  <TooltipComp tooltipContent={"Ekle"}>
                    <button
                      className="btn btn-success cursor-pointer px-4 py-2.5"
                      onClick={handleCreateButtonClick}
                      disabled={
                        !checkPrivilegeInRoles(
                          data?.priviligeCreateButton?.id,
                          roles
                        )
                      }
                    >
                      <Icon icon={"FaPlus"} />
                    </button>
                  </TooltipComp>
                )
              ) : null
            }
            {
              // check if import is activated
              data.model && Array.isArray(data.model.import) ? (
                data.model.import.map((item, index) => {
                  if (checkPrivilegeInRoles(item?.privilege?.id, roles)) {
                    return (
                      <TooltipComp
                        key={index}
                        tooltipContent={"Excel Ayarları"}
                      >
                        <DropdownMenu.Root className="btn btn-success cursor-pointer px-4 py-2.5">
                          <DropdownMenu.Trigger asChild>
                            <button className="btn btn-success cursor-pointer px-4 py-2.5 outline-none">
                              <Icon icon="FaFileExcel" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              className="dropdown-content"
                              sideOffset={5}
                            >
                              <DropdownMenu.Item
                                onClick={() => {
                                  setImportModel(item);
                                  setImportModalShow(true);
                                }}
                              >
                                <Icon icon="FaFileImport" />
                                Excel İçe Aktar
                              </DropdownMenu.Item>
                              {data.model &&
                              data.model.export === false ? null : (
                                <DropdownMenu.Item
                                  onClick={() => setExportModalShow(true)}
                                >
                                  <Icon icon="FaFileExport" />
                                  Excel Dışa Aktar
                                </DropdownMenu.Item>
                              )}
                              <DropdownMenu.Item
                                className="cursor-pointer"
                                onClick={() =>
                                  getDownloadRedirect(
                                    `${FILE_SERVER}/site/samples/${item.exampleFileName}.xlsx`
                                  )
                                }
                              >
                                <Icon icon="FaFile" />
                                Örnek Excel Dosyası
                              </DropdownMenu.Item>
                              <DropdownMenu.Arrow className="fill-white" />
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </TooltipComp>
                    );
                  }
                  return null;
                })
              ) : (data.model && data.model.import === false) ||
                !checkPrivilegeWithType(
                  data?.headerActionsPrivilege?.import,
                  "show",
                  roles
                ) ? null : (
                <TooltipComp tooltipContent={"Excel Ayarları"}>
                  <DropdownMenu.Root
                    className="btn btn-success cursor-pointer px-4 py-2.5"
                    data-for="createToolExcel"
                  >
                    <DropdownMenu.Trigger asChild>
                      <button className="btn btn-success cursor-pointer px-4 py-2.5 outline-none">
                        <Icon icon="FaFileExcel" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                        sideOffset={5}
                      >
                        {!data?.hideImport && (
                          <DropdownMenu.Item
                            onClick={() => setImportModalShow(true)}
                          >
                            <Icon icon="FaFileImport" />
                            Excel İçe Aktar
                          </DropdownMenu.Item>
                        )}
                        {data.model && data.model.export === false ? null : (
                          <DropdownMenu.Item
                            onClick={() => setExportModalShow(true)}
                          >
                            <Icon icon="FaFileExport" />
                            Excel Dışa Aktar
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Item
                          onClick={() =>
                            getDownloadRedirect(
                              `${FILE_SERVER}/site/samples/${data.name}.xlsx`
                            )
                          }
                        >
                          <Icon icon="FaFile" />
                          Örnek Excel Dosyası
                        </DropdownMenu.Item>
                        <DropdownMenu.Arrow className="fill-white" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TooltipComp>
              )
            }
            {data.model &&
            data.model.import === false &&
            !(data.model && data.model.export === false) ? (
              <TooltipComp tooltipContent={"Excel Dışa Aktar"}>
                <Link
                  data-tip
                  data-for="createTool"
                  className="btn btn-success cursor-pointer px-4 py-2.5"
                  onClick={() => setExportModalShow(true)}
                >
                  <Icon icon="FaFileExcel" />
                </Link>
              </TooltipComp>
            ) : null}
            {data.selectableRowsModel ? (
              <TooltipComp tooltipContent={data.selectableRowsModel.label}>
                <button
                  className="btn btn-success cursor-pointer px-4 py-2.5"
                  style={{ verticalAlign: "baseline" }}
                  onClick={(e) =>
                    handleSelectableRowsButtonClick(e, data.selectableRowsModel)
                  }
                >
                  <Icon icon="FaDownload" />
                </button>
              </TooltipComp>
            ) : null}
          </div>
          {props?.searchBox && (
            <div key={"filter-text"} className="header-search">
              <input
                className="form-input"
                type="text"
                placeholder="Anahtar kelime"
                aria-label="Anahtar kelime"
                value={props?.filterText}
                onChange={props?.handleTextChange}
              />
              <button
                className="header-search-btn"
                type="button"
                onClick={() => props?.setFilterText("")}
              >
                X
              </button>
            </div>
          )}
        </div>
      );
      break;
    case "create":
      headerButtons = (
        <>
          <div key={`${asset}-navigation`} className="header-navigation-btn">
            {checkIf(props?.excelImportFromCreate) ? (
              data.model && data.model.import === false ? null : (
                <TooltipComp tooltipContent={"Excel Ayarları"}>
                  <DropdownMenu.Root
                    className="btn btn-success cursor-pointer px-4 py-2.5"
                    data-tip
                    data-for="createToolExcel"
                  >
                    <DropdownMenu.Trigger asChild>
                      <button className="btn btn-success cursor-pointer px-4 py-2.5 outline-none">
                        <Icon icon="FaFileExcel" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="dropdown-content"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item
                          onClick={() => setImportModalShow(true)}
                        >
                          <Icon icon="FaFileImport" />
                          Excel İçe Aktar
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() =>
                            getDownloadRedirect(
                              `${FILE_SERVER}/site/samples/${
                                data?.exampleFileName || data.name
                              }.xlsx`
                            )
                          }
                        >
                          <Icon icon="FaFile" />
                          Örnek Excel Dosyası
                        </DropdownMenu.Item>
                        <DropdownMenu.Arrow className="fill-white" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </TooltipComp>
              )
            ) : (
              <TooltipComp tooltipContent={"Kapat"}>
                <Link
                  data-tip
                  className="btn btn-light cursor-pointer px-4 py-2.5"
                  to={`/${asset}${location.search}`}
                >
                  <Icon icon="FaTimes" />
                </Link>
              </TooltipComp>
            )}
          </div>
          <div key={`${asset}-title`} className="title">
            {!data.customLabel
              ? data.label
                ? data.label + " Ekle"
                : ""
              : data.customLabel}
          </div>
        </>
      );
      break;
    case "edit":
      headerButtons = (
        <>
          {data?.isShowCloseButton === false ? null : (
            <div key={`${asset}-navigation`} className="header-navigation-btn">
              <TooltipComp tooltipContent={"Kapat"}>
                <Link
                  data-tip
                  className="btn btn-light cursor-pointer px-4 py-2.5"
                  to={
                    location.search.includes("&CI=")
                      ? `/${asset}${location.search}`
                      : `/${asset}`
                  }
                >
                  <Icon icon="FaTimes" />
                </Link>
              </TooltipComp>
            </div>
          )}
          {!props.isBoundEntity && (
            <div key={`${asset}-title`} className="page-header">
              {data?.label} {props.entityReadOnly ? "Görüntüle" : "Düzenleme"}
            </div>
          )}
        </>
      );
      break;
    default:
      break;
  }
  return headerButtons;
};

export default AssetHeaderButton;
