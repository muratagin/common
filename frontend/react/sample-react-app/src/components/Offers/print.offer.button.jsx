import { Requests } from "@app/api";
import { ApprovalType } from "@app/enum";
import Icon from "@components/icon";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { createLinkAndDownload, resErrorMessage } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const PrintOfferButton = ({ row, field }) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const getOfferPrint = async () => {
    const isPrintOffer = field?.printOffer;

    try {
      let url = getEntityUrl({
        api: field.service,
      });

      const content = {
        OfferId: row?.Id,
        ApprovalType: isPrintOffer ? ApprovalType.OFFER : ApprovalType.POLICY,
      };

      const swalInfo = {
        title: `${isPrintOffer ? "Teklif" : "Poliçe"} Basım`,
        text: `${isPrintOffer ? "Teklif" : "Poliçe"} basılsın mı?`,
        icon: "success",
      };

      MySwal.fire(MySwalData("confirm", swalInfo)).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setLoading(true));
          const response = await Requests().CommonRequest.post(
            {
              url,
              content,
            },
            { responseType: "blob" }
          );
          if (response && response.data) {
            createLinkAndDownload(
              new Blob([response.data]),
              `teklif-${row.Id}.pdf`
            );
          }

          url = getEntityUrl({
            api: {
              url: "Prints/PrintPrivateTerms",
              port: 8141,
            },
          });

          await Requests()
            .CommonRequest.post(
              {
                url,
                content: {
                  OfferId: row?.Id,
                },
              },
              { responseType: "blob" }
            )
            .then((response) => {
              if (response && response.data) {
                createLinkAndDownload(
                  new Blob([response.data]),
                  `ozel-sart-${row.Id}.pdf`
                );
              }
            })
            .catch((error) => {});

          dispatch(setLoading(false));
        }
      });

      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  return (
    <button
      key={"download" + row?.Id}
      onClick={(event) => getOfferPrint()}
      className="w-7 h-7 text-white flex justify-center items-center bg-primary rounded-full shadow-sm"
    >
      <Icon icon="FaDownload" />
    </button>
  );
};
