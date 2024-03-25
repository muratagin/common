import { Requests } from "@app/api";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import {
  checkIf,
  checkIfIsEmpty,
  errorData,
  exportDownLoadRedirect,
  getFilterString,
} from "@libs/utils";
import { setPopup } from "@slices/selectionSlice";
import { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Modal from "./modal";

const Export = (props) => {
  const filterData = props.searchData;
  const queryParam = props.queryParam;
  const tableViewMode =
    props?.exportReportWithColumnHeaders === true
      ? true
      : !(props.assetMode?.view === false);
  const companyIdentifier = useSelector((state) => state.selection.identifier);

  const dispatch = useDispatch();
  const [process, setProcess] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [modalShow, setModalShow] = useState(tableViewMode);
  const [reportJob, setReportJob] = useState({
    isJob: false,
    reportJobId: null,
  });
  const [taggedValues, setTaggedValues] = useState({ tags: [] });

  const [originalTaggedValues, setOriginalTaggedValues] = useState({
    tags: [],
  });
  const tableName = props.tableName
    ? props.tableName
    : props.exportModel.exportName;
  const MySwal = withReactContent(Swal);

  const handleClose = () => {
    props.onClose();
    setModalShow(false);
  };

  const handleResponseData = (data) => {
    let tags = data.map((col) => col.ColumnHeader || col.ColumnName);
    setOriginalTaggedValues({ tags });
    setTaggedValues({ tags });
  };

  const onComplete = () => {
    handleClose();
  };

  const handleChange = (tags) => {
    let validatedTags = tags.filter(
      (tag) => originalTaggedValues.tags.indexOf(tag) > -1
    );
    setTaggedValues({ tags: validatedTags });
  };

  const selectAll = (e) => {
    let value = e.target.checked;
    setCheckAll(value);
  };

  useEffect(() => {
    reportJob.isJob &&
      MySwal.fire(
        MySwalData("success", {
          text: `${reportJob.reportJobId} nolu rapor talebiniz işleme alınmıştır.
     Raporu ve raporun son durum bilgisini Rapor Listesi ekranından alabilirsiniz.`,
        })
      );
  }, [reportJob]);

  const startExport = () => {
    const fetch = async () => {
      setProcess(true);
      let filterString = (filterData && getFilterString(filterData, "&")) || "";
      let externalQueryParam = queryParam || "";
      let field = props?.exportModel?.field
        ? `,${props?.exportModel?.field?.postData}==${
            props?.row[props?.exportModel?.field?.rowData]
          }`
        : "";
      let columnsString =
        checkAll ||
        originalTaggedValues.tags.length === taggedValues.tags.length
          ? props.exportModel?.defaultCheckAll && originalTaggedValues.tags
            ? originalTaggedValues.tags.reduce(
                (acc, val) => acc + `&Columns=${val}`,
                ""
              )
            : ""
          : taggedValues.tags.reduce((acc, val) => acc + `&Columns=${val}`, "");
      let exportTableName = props.exportModel.precedenceExportName
        ? props.exportModel.precedenceExportName
        : tableName;
      let url = getEntityUrl({
        api: {
          port: 8083,
          url:
            "export?TableName=" +
            exportTableName +
            externalQueryParam +
            filterString +
            field +
            columnsString,
        },
      });
      let content = {};
      let filtersData;
      if (props?.exportWithoutPostReq !== true) {
        url = getEntityUrl({
          api: {
            port: 8083,
            url: "export",
          },
        });
        if (filterString.split("filters=")[1] && externalQueryParam) {
          filtersData = filterString.split("filters=")[1] + externalQueryParam;
        } else if (filterString.split("filters=")[1]) {
          filtersData = filterString.split("filters=")[1];
        } else if (externalQueryParam) {
          filtersData = externalQueryParam;
        }
        const checkTableName = props.historyPostName
          ? props.historyPostName
          : tableName;
        content = {
          TableName: checkTableName,
          Filters: filtersData,
          Columns: columnsString
            .split("&Columns=")
            .filter(Boolean)
            .map((item) => item.trim()),
        };
      }
      if (props?.totalRows > 10000) {
        dispatch(
          setPopup({
            display: true,
            class: "warning",
            message: {
              body: "KAYIT SAYISI 10.000’DEN FAZLA OLAN İSTEKLER İÇİN RAPORLAR EKRANINI KULLANINIZ",
            },
          })
        );
        props.onClose();
        return false;
      }
      let requestTye = props?.exportWithoutPostReq === true ? "get" : "post";
      try {
        let response = await Requests().CommonRequest[requestTye]({
          url,
          headers: {
            CompanyIdentifier: companyIdentifier,
            IsLazyLoading: checkIfIsEmpty(props.isLazyLoading)
              ? props.isLazyLoading
              : true,
          },
          content: content,
          loading: true,
        });

        if (checkIf(response.data) && response?.data?.IsJob)
          setReportJob({
            isJob: true,
            reportJobId: response?.data?.ReportJobId,
          });
        else {
          await exportDownLoadRedirect(response.data);
          onComplete();
        }
      } catch (error) {
        dispatch(setPopup({ display: true, ...errorData(error) }));
      } finally {
        setProcess(false);
      }
    };
    (taggedValues?.tags?.length > 0 && modalShow) || !modalShow
      ? fetch()
      : MySwal.fire(
          MySwalData("error", { text: "En az bir kolon adı seçiniz." })
        );
  };

  useEffect(() => {
    const fetchData = async () => {
      setProcess(true);
      let url;
      if (props.isHistory) {
        url = getEntityUrl({
          api: {
            port: 8083,
            url:
              "tablecolumnheaderhistories?filters=TableName==" +
              tableName +
              ",IsView==true",
          },
        });
      } else {
        url = getEntityUrl({
          api: {
            port: 8083,
            url:
              "tablecolumnheaders?filters=TableName==" +
              tableName +
              ",IsView==true",
          },
        });
      }
      try {
        let response = await Requests().CommonRequest.get({
          url,
          headers: { CompanyIdentifier: companyIdentifier },
          loading: true,
        });
        handleResponseData(response.data);
        setProcess(false);
      } catch (error) {
        setProcess(false);
      }
    };
    if (tableViewMode) {
      fetchData();
    } else {
      startExport();
    }
  }, [props.searchData]);

  function autocompleteRenderInput({ addTag, ...props }) {
    const handleOnChange = (e, { newValue, method }) => {
      if (method === "enter") {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    const inputValue = (props.value && props.value.trim().toLowerCase()) || "";

    let suggestions = originalTaggedValues?.tags.filter((tag) => {
      return (
        !(taggedValues.tags.indexOf(tag) > -1) &&
        tag.toLowerCase().match(inputValue)
      );
    });

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => checkIf(value)}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span>{suggestion}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion);
        }}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  }

  return (
    <>
      <Modal
        size="lg"
        open={modalShow}
        onClose={handleClose}
        title={"Kolonları Seç"}
      >
        <div className={`form-field`}>
          <label htmlFor="checkAll">Tümünü Seç</label>
          <div
            className="onoffswitch inline-block"
            style={{ marginTop: 0, top: "0px" }}
          >
            <input
              className="onoffswitch-checkbox"
              id="checkAll"
              type="checkbox"
              name="checkAll"
              checked={checkAll}
              onChange={selectAll}
            />
            <label className="onoffswitch-label" htmlFor="checkAll">
              <span className="onoffswitch-inner"></span>
              <span className="onoffswitch-switch"></span>
            </label>
          </div>
        </div>

        <TagsInput
          disabled={process || checkAll}
          renderInput={autocompleteRenderInput}
          inputProps={{ placeholder: props.placeholder || "Kolon ismi ..." }}
          value={taggedValues.tags}
          onChange={handleChange}
        />
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-success"
            onClick={startExport}
          >
            EXCEL
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={handleClose}
          >
            İPTAL
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Export;
