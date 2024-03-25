import { AxiosInstance } from "@app/axios.instance";
import Dropzone from "@libs/dropzone";
import { MySwalData } from "@libs/myswaldata";
import { getImportTableComponentUrl, getImportUrl } from "@libs/parser";
import {
  checkExcelDateFormat,
  checkIf,
  excelValidation,
  findCompany,
  generateImportTableComponentInfo,
  generateImportTableInfo,
  getValues,
  importModelCheckDuplicate,
  importProcessDateValidator,
} from "@libs/utils";
import { Paper as MuiPaper } from "@mui/material";
import * as Progress from "@radix-ui/react-progress";
import { Button } from "@radix-ui/themes";
import { setPopup } from "@slices/selectionSlice";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import TooltipComp from "./TooltipComp";
import { DownloadExcel } from "./download";
import Icon from "./icon";
import Modal from "./modal";
import Queue from "./queue";

const ExcelImportModal = ({
  importModalShow,
  setImportModalShow,
  data,
  asset,
  clickedRowImport,
  importModel,
  setImportMode,
  importMode,
  additionalImportTableRowImportName,
  fromTableComp,
  assetModel,
  tableRefresh,
}) => {
  const [dropZoneData, setDropZoneData] = useState();
  const [importProgressValue, setImportProgressValue] = useState(0);
  const [importData, setImportData] = useState({
    tableDataImport: [],
    tableDataTransmit: [],
    columns: [],
  });
  const MySwal = withReactContent(Swal);
  const location = useLocation();
  const companyIdentifier = useSelector((state) => state.selection.identifier);
  const modalRef = useRef();

  const dispatch = useDispatch();
  const uploadFile = (data) => {
    setImportModalShow(false);
    if (checkIf(dropZoneData)) {
      let { columns, tableDataImport, tableDataTransmit } = !fromTableComp
        ? generateImportTableInfo(
            dropZoneData,
            asset,
            clickedRowImport,
            importModel
          )
        : generateImportTableComponentInfo(dropZoneData, assetModel);
      columns.unshift(
        {
          name: "Yükleme Durumu",
          cell: (row) => (
            <>
              {typeof row.progress.result === "undefined" && (
                <Progress.Root
                  className="relative h-[25px] w-full overflow-hidden rounded-full !p-0 "
                  style={{
                    transform: "translateZ(0)",
                  }}
                  value={row.progress.value}
                >
                  <Progress.Indicator
                    className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-blue-100 transition-transform duration-[660ms]"
                    style={{
                      transform: `translateX(-${100 - row.progress.value}%)`,
                    }}
                  />
                </Progress.Root>
              )}
              {row.progress.result === true && (
                <Button
                  className="table-icon btn-success"
                  data-tip
                  data-for="createToolTableEdit"
                  variant="success"
                >
                  <Icon icon="FaCheck" />
                </Button>
              )}
              {row.progress.result === false && (
                <Button
                  className="table-icon btn-danger"
                  data-tip
                  data-for="createToolTableEdit"
                  variant="danger"
                >
                  <Icon icon="FaTimes" />
                </Button>
              )}
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
        {
          name: "Açıklama",
          cell: (row) => (
            <>{row.progress.result === false && <>{row.progress.error}</>}</>
          ),
        }
      );
      if (!checkIf(data?.nonDuplicateColumns)) {
        setImportData({ tableDataImport, columns, tableDataTransmit });
        setImportMode(true);
      } else {
        if (
          !importModelCheckDuplicate(
            data?.nonDuplicateColumns,
            tableDataTransmit
          )
        ) {
          setImportData({ tableDataImport, columns, tableDataTransmit });
          setImportMode(true);
        } else {
          MySwal.fire(
            MySwalData("error", { text: data?.nonDuplicateColumnsMessage })
          );
        }
      }
    }
  };

  const [remainingDataShow, setRemainingDataShow] = useState(false);
  const refresh = () => {
    if (`/${asset}${location.search}` == window.location.pathname) {
      history.go();
    } else if (data.importExportModel?.importHistoryGo === true) {
      history.go();
    }
  };

  const ImportSubHeader = () => (
    <div className="my-3 grid grid-cols-12 items-center gap-3">
      <div className=" col-span-8 pl-10">
        <Progress.Root
          className="relative h-[25px] w-full overflow-hidden rounded-full border-[1px] border-solid border-gray-200 bg-white "
          style={{
            transform: "translateZ(0)",
          }}
          value={importProgressValue}
        >
          <Progress.Indicator
            className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full bg-green-400 transition-transform duration-[660ms]"
            style={{
              transform: `translateX(-${100 - importProgressValue}%)`,
            }}
          />
        </Progress.Root>
      </div>
      <div className="col-span-1 mt-1 text-xs text-gray-600">
        % {importProgressValue}
      </div>
      <div className=" col-span-2 flex justify-center">
        {remainingDataShow && (
          <DownloadExcel
            dataset={importData.tableDataImport.filter((item) =>
              checkIf(item.progress.error)
            )}
            columns={importData.columns}
            disabled={importProgressValue !== 100}
            filename="Hatalı Sonuçlar"
            displayName="SONUCU İNDİR"
            type="remaining"
          />
        )}
      </div>
      <div
        key={`${asset}-navigation`}
        className="header-navigation-btn flex justify-center "
      >
        <TooltipComp tooltipContent={"Kapat"}>
          {!fromTableComp ? (
            <Link
              data-tip
              className="btn-save"
              to={`/${asset}${location.search}`}
              onClick={refresh}
            >
              <Icon icon="FaTimes" />
            </Link>
          ) : (
            <Button
              className="table-icon"
              data-tip
              variant="danger"
              onClick={(e) => {
                e.preventDefault();
                tableRefresh();
              }}
            >
              <Icon icon="FaTimes" />
            </Button>
          )}
        </TooltipComp>
      </div>
    </div>
  );

  const updateProgress = (index, type, param, error) => {
    setImportData((state) => {
      let newTableData = state.tableDataImport.map((row, idx) => {
        if (idx === index) {
          let newProg = { ...row.progress };
          newProg[type] = param;
          newProg.error = error ?? "Beklenmeyen bir hata oluştu.";
          return { ...row, progress: newProg };
        } else {
          return { ...row };
        }
      });
      return {
        ...state,
        tableDataImport: newTableData,
      };
    });
  };

  const startImportProcess = () => {
    let url = !fromTableComp
      ? Object.keys(importModel).length === 0
        ? additionalImportTableRowImportName
          ? getImportUrl(data, additionalImportTableRowImportName)
          : getImportUrl(data)
        : getImportUrl(importModel)
      : getImportTableComponentUrl(assetModel);
    let axiosInstance = AxiosInstance();
    let dateColumns = [];

    importData.columns.map(
      (x) => x.name.match(/TARIH|tarih/gi) && dateColumns.push(x?.selector)
    );
    importData.tableDataTransmit.map((row, index) => {
      checkExcelDateFormat(dateColumns, row);
    });
    // File Validation
    let companyId = importData?.tableDataTransmit[0]?.CompanyId;
    for (const [index, item] of importData.tableDataTransmit.entries()) {
      for (const key of dateColumns) {
        let value = getValues(".", key, item);
        if (checkIf(value) && !excelValidation("validDate", value)) {
          setImportMode(false);
          return MySwal.fire(
            MySwalData("error", {
              text: `Excel dosyası geçersiz bir tarih içeriyor lütfen kontrol ediniz.<br/><p style="color:red;">Satır: ${
                index + 2
              }</p>`,
            })
          );
        }
      }
      if (data?.onlySameCompany && item?.CompanyId != companyId) {
        setImportMode(false);
        return MySwal.fire(
          MySwalData("error", {
            text: `Sadece aynı şirket için aktarım yapılabilir, lütfen şirket kodu alanını kontrol ediniz.<br/><p style="color:red;">Satır: ${
              index + 2
            }</p>`,
          })
        );
      }
    }
    for (const iterator of importData.columns) {
      if (iterator?.model?.import?.validation) {
        for (const [index, item] of importData.tableDataTransmit.entries()) {
          if (
            !excelValidation(
              iterator?.model?.import?.validation,
              getValues(".", iterator?.model?.create, item),
              item,
              iterator
            )
          ) {
            setImportMode(false);
            return MySwal.fire(
              MySwalData("error", {
                text: `${
                  iterator?.model?.import?.validationErrMsg
                }<br/><p style="color:red;">Satır: ${index + 2}</p>`,
              })
            );
          }
        }
      }
    }
    if (data?.bulkImport) {
      setImportMode(false);
      (async function () {
        let foundCompany = findCompany(
          "CompanyId",
          importData.tableDataTransmit[0].CompanyId ||
            importData.tableDataTransmit[0].SirketKod
        );
        let rowIdentifier = foundCompany?.CompanyIdentifier;
        await axiosInstance
          .post(url, importData.tableDataTransmit, {
            headers: {
              CompanyIdentifier: rowIdentifier || companyIdentifier,
            },
            loading: true,
          })
          .then(() => {
            dispatch(
              setPopup({
                display: true,
                class: "success",
                message: {
                  title: "BAŞARILI",
                  body: "Talebiniz alındı.",
                },
              })
            );
          })
          .catch((e) => {
            dispatch(
              setPopup({
                display: true,
                class: "danger",
                message: {
                  body: e?.response?.data?.ErrorMessage
                    ? e?.response?.data?.ErrorMessage[0]
                    : "İşlem başarısız!",
                },
              })
            );
          });
      })();
    } else {
      const queue = new Queue({
        concurrent: 1,
      });

      importData.tableDataTransmit.map((row, index) => {
        let foundCompany = findCompany(
          "CompanyId",
          row.CompanyId || row.SirketKod
        );
        let rowIdentifier = foundCompany?.CompanyIdentifier;
        Object.keys(row).map(function (key, index) {
          row[key] = importProcessDateValidator(row[key]);
        });
        async function importRow(url, row, index) {
          await axiosInstance
            .post(url, row, {
              headers: {
                CompanyIdentifier: rowIdentifier || companyIdentifier,
              },
              onDownloadProgress: (progressEvent) => {
                let prog = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                updateProgress(index, "value", prog);
              },
            })
            .then(() => {
              updateProgress(index, "result", true);
            })
            .catch((e) => {
              var errorExp;
              if (checkIf(e.response?.data?.title)) {
                let tempObj = e.response.data.errors;
                errorExp = tempObj[Object.keys(tempObj)[0]].join(" ");
              } else {
                errorExp = e.response?.data?.ErrorMessage?.join(" ");
              }
              updateProgress(index, "result", false, errorExp);
            });
          return index;
        }

        queue.enqueue(() => importRow(url, row, index));
      });

      queue.start();
      queue.on("resolve", (index) =>
        setImportProgressValue(
          Math.round((100 / importData.tableDataTransmit.length) * (index + 1))
        )
      );
      setRemainingDataShow(true);
    }
  };

  useEffect(() => {
    importMode && startImportProcess();
  }, [importMode]);

  return (
    <>
      {importMode && (
        <>
          <ImportSubHeader />
          <MuiPaper
            ref={modalRef}
            // datacolumncount={importData?.columns.length + 5}
            // currenttablewidth={dimensions?.width || null}
          >
            <DataTable
              noDataComponent={false}
              title={`${data?.label} İçe Aktarma Ekranı`}
              columns={importData.columns}
              data={importData.tableDataImport}
              // subHeader
              // subHeaderComponent={importSubHeader}
            />
          </MuiPaper>
        </>
      )}
      <Modal
        size="lg"
        open={importModalShow}
        onClose={() => setImportModalShow(false)}
        title={"İçeri aktarılacak dosyayı seçiniz"}
      >
        <div>
          <Dropzone
            onComplete={(data) => {
              setDropZoneData(data);
            }}
          />
        </div>
        <button
          className="btn btn-primary mx-auto"
          onClick={() => uploadFile(data)}
          disabled={!checkIf(dropZoneData)}
        >
          İÇE AKTAR
        </button>
      </Modal>
    </>
  );
};

export default ExcelImportModal;
