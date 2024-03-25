import Icon from "@components/icon";
import LogXMLViewer from "@components/logxmlviewer";
import classNames from "classnames";
import { format, isDate } from "date-fns";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Toastr = (props) => {
  const MySwal = withReactContent(Swal);
  useEffect(() => {}, [props]);

  if (props.display && !MySwal.isVisible()) {
    MySwal.fire(SwalData(props)).then((result) => props.onClose());
    return null;
  } else return null;
};

const SwalData = (data) => {
  let title = data?.message?.title;
  let text = data?.message?.body;
  if (data.class === "danger") {
    return {
      title: data.logId ? "SİGORTA ŞİRKETİ HATASI" : title || "HATA OLUŞTU",
      text: text || "İşleminiz gerçekleşirken hata oluştu.",
      html: data.logId ? (
        <ErrorLogView
          logId={data.logId}
          text={text}
          companyIdentifier={data?.companyIdentifier}
        />
      ) : (
        <p>{text || "İşleminiz gerçekleşirken hata oluştu."}</p>
      ),
      icon: "error",
      confirmButtonText: "TAMAM",
    };
  } else if (data.class === "success") {
    return {
      title: title || "BAŞARILI İŞLEM",
      html: text || "İşleminiz başarıyla tamamlandı.",
      icon: "success",
      confirmButtonText: "TAMAM",
    };
  } else if (data.class === "info") {
    return {
      title: "BİLGİ",
      html: text || "İşleminiz gerçekleştirilemedi.",
      icon: "info",
      confirmButtonText: "TAMAM",
    };
  } else if (data.class === "warning") {
    return {
      title: "UYARI",
      text: text || "İşleminiz gerçekleştirilemedi.",
      icon: "warning",
      html: data.filterDetails ? (
        <FilterDetails {...data} />
      ) : (
        <p>{text || "İşleminiz gerçekleştirilemedi."}</p>
      ),
      confirmButtonText: "TAMAM",
    };
  }
};

const FilterDetails = (props) => {
  const [show, setShow] = useState(false);
  let text = props?.message?.body;
  let filterDetails = props.filterDetails;
  return (
    <div>
      <p>{text || "İşleminiz gerçekleştirilemedi."}</p>
      <div className=" flex w-full items-center justify-start my-2.5">
        <button
          onClick={() => setShow(!show)}
          type="button"
          className="btn btn-primary flex items-center justify-center"
        >
          <Icon icon={!show ? "FaCaretRight" : "FaCaretDown"} />
          <span className="ml-1">Filtre Detaylarını Göster</span>
        </button>
      </div>
      <div
        className={classNames({
          "relative mt-2 overflow-x-auto": true,
          hidden: !show,
          flex: show,
        })}
      >
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Filtre
              </th>
              <th scope="col" className="px-6 py-3">
                Değer
              </th>
              <th scope="col" className="px-6 py-3">
                Operatör
              </th>
            </tr>
          </thead>
          <tbody>
            {filterDetails &&
              filterDetails.length > 0 &&
              filterDetails.map((filter, index) => (
                <tr key={index} className="border-b bg-white">
                  <td className="whitespace-nowrap px-6 py-4 font-medium ">
                    {filter.key}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium ">
                    {isDate(filter.value)
                      ? format(filter.value, "dd-MM-yyyy")
                      : filter.value}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium ">
                    {filter.comparisonSign}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ErrorLogView = ({ logId, companyIdentifier }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p>Hata hakkında lütfen sigorta şirketi ile iletişime geçiniz.</p>
      <button
        onClick={() => setModalShow(true)}
        type="button"
        className="btn btn-warning w-100 m-3 text-white"
      >
        HATA LOG KAYDI
      </button>
      <LogXMLViewer
        modalShow={modalShow}
        setModalShow={(e) => setModalShow(!modalShow)}
        logId={logId}
        companyIdentifier={companyIdentifier}
      />
    </div>
  );
};
