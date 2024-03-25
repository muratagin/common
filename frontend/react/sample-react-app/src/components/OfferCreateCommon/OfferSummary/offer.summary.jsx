import { Requests } from "@app/api";
import {
  ApprovalStatus,
  ApprovalType,
  OfferStatus,
  TransitionStatus,
} from "@app/enum";
import Icon from "@components/icon";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import {
  checkIfIsEmpty,
  createLinkAndDownload,
  resErrorMessage,
} from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { tabNames } from "../data";
import AddNewInsuredModal from "./add.new.insured.modal";
import { AuthorizationInsuredInfo } from "./authorization.insured.info";
import { DiscountsTable } from "./discounts.table";
import { GeneralInfo } from "./general.info";
import InsuredsTable from "./insureds.table";
import { InsurerInfo } from "./insurer.info";

function OfferSummary() {
  const { handleChangeTab, offer, setOffer } = useOfferContext();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const [generalInformation, setGeneralInformation] = useState(null);
  const [addNewInsuredModal, setAddNewInsuredModal] = useState(false);
  const [insureds, setInsureds] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const addNewInsured = () => {
    setAddNewInsuredModal({ show: true });
  };

  useEffect(() => {
    if (offer?.Id) {
      getPageData();
      getOfferDiscounts();
    }
  }, [offer?.Id]);

  const getPageData = () => {
    getGeneralInformationForOffer();
    getGeneralInsuredInformationForOffer();
  };

  const getGeneralInformationForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetGeneralInformationForOffer?offerId=${offer?.Id}`,
        },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({
        url,
      });
      dispatch(setLoading(false));
      if (response && response.data) {
        setGeneralInformation(response.data);
      }
    } catch (error) {
      let errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("warning", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  const getGeneralInsuredInformationForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetGeneralInsuredInformationForOffer?offerId=${offer?.Id}`,
        },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({
        url,
      });
      dispatch(setLoading(false));
      if (response && response.data) {
        setInsureds(response.data);
      }
    } catch (error) {
      let errorMessage = resErrorMessage(error);
      // MySwal.fire(
      //   MySwalData("warning", {
      //     text: errorMessage,
      //   })
      // );
      dispatch(setLoading(false));
    }
  };

  const getOfferDiscounts = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Discounts?filters=OfferId==${offer?.Id}`,
        },
      });

      dispatch(setLoading(true));

      const response = await Requests().CommonRequest.get({
        url,
      });
      if (response && response.data) {
        setDiscounts(response.data);
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const getOfferPrint = async () => {
    try {
      let url = getEntityUrl({
        api: {
          port: 8141,
          url: `Prints/PrintOffer`,
        },
      });

      const content = {
        OfferId: offer?.Id,
        ApprovalType: ApprovalType.OFFER,
      };

      MySwal.fire(
        MySwalData("confirm", {
          title: "Teklif Basım",
          text: "Teklif basılsın mı?",
          icon: "success",
        })
      ).then(async (result) => {
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
              `teklif-${offer.Id}.pdf`
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
                  OfferId: offer?.Id,
                },
              },
              { responseType: "blob" }
            )
            .then((response) => {
              if (response && response.data) {
                createLinkAndDownload(
                  new Blob([response.data]),
                  `ozel-sart-${offer.Id}.pdf`
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

  const continueToPayment = async () => {
    try {
      if (isContinueToPaymentBtn()) {
        if (offer && offer.Status === OfferStatus.PAYMENT_WAITING) {
          handleChangeTab(tabNames[3]);
          return false;
        }

        const url = getEntityUrl({
          api: { port: 8141, url: "Offers/UpdateDeclarationStatus" },
        });
        const content = {
          OfferId: offer?.Id,
        };
        dispatch(setLoading(true));
        const response = await Requests().CommonRequest.put({
          url,
          content,
        });
        dispatch(setLoading(false));
        if (response && response.data && response.data?.IsSuccess) {
          //offer status değiştirilmeli
          setOffer({ ...offer, Status: OfferStatus.PAYMENT_WAITING });
          handleChangeTab(tabNames[3]);
        }
      }
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("warning", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  const isContinueToPaymentBtn = () => {
    let result = true;

    //sigortalı onayları kontrol
    const checkInsuredsApproval =
      insureds &&
      insureds.some(
        (insured) =>
          insured.HealthApprovalStatusOrdinal !== ApprovalStatus.APPROVED ||
          insured.KvkkApprovalStatusOrdinal !== ApprovalStatus.APPROVED
      );
    //geçiş durumları kontrol
    const checkInsuredsTransitionStatus =
      insureds &&
      insureds.some(
        (insured) =>
          insured.TransitionStatusOrdinal !== TransitionStatus.COMPLETED
      );

    //otorizasyon kontrol
    const isInsuredResult =
      insureds && insureds.some((insured) => checkIfIsEmpty(insured.Result));

    if (checkInsuredsApproval) {
      MySwal.fire(
        MySwalData("warning", {
          text: "Tüm sigortalılar için onayların tamamlanması gerekmektedir.",
        })
      );
      result = false;
    } else if (checkInsuredsTransitionStatus) {
      MySwal.fire(
        MySwalData("warning", {
          text: "Tüm sigortalılar için geçiş durumunun tamamlanması gerekmektedir.",
        })
      );
      result = false;
    } else if (isInsuredResult) {
      MySwal.fire(
        MySwalData("warning", {
          text: "Otorizasyon durumunda buluan sigortalı bulunmaktadır..",
        })
      );
      result = false;
    }

    return result;
  };

  const isInsuredResult =
    insureds && insureds.some((insured) => checkIfIsEmpty(insured.Result));

  const checkOfferStatusPaymentWaiting =
    offer && offer.Status === OfferStatus.PAYMENT_WAITING;

  return (
    <div className="my-5 flex flex-col justify-center items-center gap-y-2.5">
      <div className="container flex flex-col gap-y-2.5">
        <div className="flex flex-col gap-y-2 py-4 lg:p-0 flex-shrink-0">
          <h5 className="font-bold text-xl text-primary">Teklif Özet</h5>
          <span className="font-normal text-matter-horn">
            Oluşturmuş olduğunuz teklife ait bilgiler aşağıdaki gibidir.
            Sigortalıların beyan onayları sonrası devam edebilirsiniz.
          </span>
        </div>

        {/*Genel Bilgiler */}
        <GeneralInfo
          generalInformation={generalInformation}
          discounts={discounts}
          getOfferDiscounts={getOfferDiscounts}
          getPageData={getPageData}
        />

        {/*Sigortalı Bilgileri Başlangıç */}
        <DiscountsTable
          discounts={discounts}
          setDiscounts={setDiscounts}
          getPageData={getPageData}
        />

        {/*Sigorta Ettiren Bilgileri */}
        <InsurerInfo generalInformation={generalInformation} />

        {/*Sigortalı Bilgileri Başlangıç */}
        <InsuredsTable insureds={insureds} getPageData={getPageData} />

        {/*Sigortalı Bilgileri Bitiş */}
        <div>
          <button
            onClick={() => addNewInsured()}
            disabled={checkOfferStatusPaymentWaiting}
            type="button"
            className="btn btn-success rounded-md text-white py-2 px-3.5 font-semibold mt-2.5"
          >
            Sigortalı Ekle
          </button>
        </div>

        {/*Otorizasyona Takılan Sigortalı Uyarı */}
        {isInsuredResult && <AuthorizationInsuredInfo insureds={insureds} />}

        <div className="flex justify-end w-full mt-5">
          <div className=" flex w-full justify-center items-center">
            <button onClick={() => getOfferPrint()} className="btn btn-success">
              <span>Teklif Basım</span>
              <Icon icon="FaFilePdf" />
            </button>
          </div>
          <button
            onClick={() => continueToPayment()}
            className="btn btn-primary py-2.5 px-5 w-full max-w-64 disabled:bg-opacity-75"
          >
            Ödeme Ekranına İlerle
          </button>
        </div>
      </div>
      {addNewInsuredModal.show && (
        <AddNewInsuredModal
          open={addNewInsuredModal.show}
          handleClose={() => setAddNewInsuredModal({ show: false })}
          getPageData={getPageData}
        />
      )}
    </div>
  );
}

export default OfferSummary;
