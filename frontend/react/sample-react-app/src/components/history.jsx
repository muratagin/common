import { Requests } from "@app/api";
import { getHistoryUrl } from "@libs/parser";
import { Paper as MuiPaper } from "@mui/material";
import { Button } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import TooltipComp from "./TooltipComp";
import Export from "./export";
import Icon from "./icon";
import Modal from "./modal";
export default function History(props) {
  const [filterText, setFilterText] = useState("");
  const [modalShow, setModalShow] = useState(true);
  const [tableData, setTableData] = useState({ rows: [], columns: [] });
  const [exportModalShow, setExportModalShow] = useState(false);
  const [queryParam, setQueryParam] = useState("");
  const companyIdentifier = useSelector((state) => state.selection.identifier);
  const closeModal = () => {
    setModalShow(false);
    props.onClose();
  };
  const historyPostName = "RPT_HISTORY_EXPORT";
  useEffect(() => {
    setQueryParam(
      "EntityName==" +
        props?.data?.entity?.historyName +
        "," +
        "Id==" +
        props?.data?.rowId
    );
  }, []);
  const handleResponseData = (data) => {
    setTableData((state) => {
      return {
        ...state,
        columns: Object.keys(data[0]).map((item) => ({
          name: item,
          selector: item,
          sortable: true,
        })),
        rows: [...data],
      };
    });
  };
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <>
        <div key={"filter-text"} className="header-search">
          <input
            className="form-input"
            type="text"
            placeholder="Anahtar kelime"
            aria-label="Anahtar kelime"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button
            className="header-search-btn"
            type="button"
            onClick={() => setFilterText("")}
          >
            X
          </button>
          <TooltipComp tooltipContent={"Excel Dışa Aktar"}>
            <Button variant="success" onClick={() => setExportModalShow(true)}>
              <Icon icon="FaFileExport" />
            </Button>
          </TooltipComp>
        </div>
        {exportModalShow && (
          <Export
            tableName={props?.data?.entity?.name}
            queryParam={queryParam}
            onClose={() => setExportModalShow(false)}
            exportModel={[]}
            historyPostName={historyPostName}
            isHistory={true}
          />
        )}
      </>
    );
  });

  function filterFunction(item) {
    return Object.keys(item).some((value) =>
      item[value]
        .toString()
        .toLocaleLowerCase()
        .includes(filterText.toLocaleLowerCase())
    );
  }

  useEffect(() => {
    const fetch = async () => {
      let url = getHistoryUrl(
        props.data.entity,
        props.data.rowId,
        props.data.row
      );
      let boundCI = props?.data?.rowCompanyIdentifier
        ? props?.data?.rowCompanyIdentifier
        : companyIdentifier;

      try {
        let response = await Requests().CommonRequest.get({
          url,
          content: props.data.params,
          headers: {
            CompanyIdentifier: boundCI,
          },
          loading: true,
        });
        handleResponseData(response.data);
      } catch (error) {}
    };
    fetch();
  }, []);

  return (
    <Modal size="xl" open={modalShow} onClose={closeModal} title={"Tarihçe"}>
      <MuiPaper>
        <DataTable
          noHeader={true}
          noDataComponent={false}
          className="historyDataTable"
          columns={tableData.columns}
          data={tableData.rows.filter(filterFunction)}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
      </MuiPaper>
    </Modal>
  );
}
