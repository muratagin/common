import { Requests } from "@app/api";
import { getEntityUrl } from "@libs/parser";
import { createLinkAndDownload } from "@libs/utils";
import { useEffect, useState } from "react";
import XMLViewer from "react-xml-viewer";
import Icon from "./icon";
import Modal from "./modal";

const LogXMLViewer = ({
  logId,
  companyIdentifier,
  modalShow,
  setModalShow,
}) => {
  const [data, setData] = useState(null);

  const getErrorLog = () => {
    let url = getEntityUrl({
      api: {
        port: 8083,
        url: "ElasticSearches/GetLogById/" + logId,
      },
    });
    Requests()
      .CommonRequest.get({
        url,
        headers: { CompanyIdentifier: companyIdentifier },
        loading: true,
      })
      .then((response) => {
        if (response.data && response.data.length > 0)
          setData(response.data[0]);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getErrorLog();
  }, []);

  const download = async (name, text) => {
    const file = new Blob([text], { type: "text/plain" });
    await createLinkAndDownload(file, name);
  };
  return (
    <Modal
      centered
      size="xl"
      open={modalShow}
      title={"Hata Log Kaydı"}
      onClose={() => setModalShow()}
    >
      <div className="row container my-0 py-0">
        <div className="w-100">
          <div className="flex h-10 items-center justify-between">
            <h6 className="font-weight-bolder text-sm">Request</h6>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => download("Request.xml", data?.RequestXml || "")}
            >
              <Icon icon="FaDownload" />
            </button>
          </div>
          <div className="col-12 m-2 max-h-96 overflow-y-scroll rounded-lg border p-2">
            {data?.RequestXml ? (
              <XMLViewer xml={data?.RequestXml} />
            ) : (
              <p>Request bilgisi bulunamadı!</p>
            )}
          </div>
        </div>
        <div className="w-100">
          <div className="flex h-10 items-center justify-between">
            <h6 className="font-weight-bolder text-sm">Response</h6>
            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                download(
                  "Response.xml",
                  data?.ResponseXml || data?.ResponseDescription || ""
                )
              }
            >
              <Icon icon="FaDownload" />
            </button>
          </div>
          <div className="col-12 m-2 max-h-96 overflow-y-scroll rounded-lg border p-2">
            {data?.ResponseXml ? (
              <XMLViewer xml={data?.ResponseXml} />
            ) : (
              <p>{data?.ResponseDescription}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogXMLViewer;
