import { Requests } from "@app/api";
import { ApprovalStatus, ApprovalType, OfferStatus } from "@app/enum";
import { InputBase } from "@components/Inputs/InputBase";
import { PatternFormatInput } from "@components/Inputs/PatternFormatInput";
import Icon from "@components/icon";
import Modal from "@components/modal";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import {
  checkIfIsEmpty,
  createLinkAndDownload,
  currencyFormat,
  resErrorMessage,
} from "@libs/utils";
import { Table } from "@radix-ui/themes";
import { setLoading } from "@slices/dynamicStyleSlice";
import { PhoneNumberEditModalFormSchema } from "@validations/phone.number.edit.modal.form.validation";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function InsuredsTable({ insureds, getPageData }) {
  const { offer } = useOfferContext();
  const columns = [
    {
      name: "T.C. Kimlik No",
      selector: (row) => row.IdentityNumber,
    },
    {
      name: "Adı Soyadı",
      selector: (row) => row.FullName,
    },
    {
      name: "Cep Telefonu",
      selector: (row) => row.MobileNumber,
      key: "MobileNumber",
    },
    {
      name: "Paket Adı",
      selector: (row) => row.PackageName,
    },
    {
      name: "Prim",
      selector: (row) =>
        checkIfIsEmpty(row.Premium) ? currencyFormat(row.Premium) : "",
    },
    {
      name: "Sürprim",
      selector: (row) =>
        checkIfIsEmpty(row.IncreasedPremium)
          ? currencyFormat(row.IncreasedPremium)
          : "",
    },
    {
      name: "Beyan Onay Durumu",
      selector: (row) => row.HealthApprovalStatus,
      key: "HealthApprovalStatus",
    },
    {
      name: "KVKK Onay Durumu",
      selector: (row) => row.KvkkApprovalStatus,
      key: "KvkkApprovalStatus",
    },
    {
      name: "Geçiş Durumu",
      selector: (row) => row.TransitionStatus,
      key: "TransitionStatus",
    },
    {
      name: "Sonuç",
      selector: (row) => row.Result,
      key: "Result",
    },
    {
      name: "İşlemler",
      key: "actions",
    },
  ];

  const refreshPageData = () => {
    getPageData && getPageData();
  };

  return (
    <div className="flex flex-col relative gap-y-2.5 mt-5">
      <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
        <span className="group-title text-xl">Sigortalılar</span>
      </div>

      <Table.Root variant="surface" className="border-none bg-white shadow-md">
        <Table.Header className="bg-white-smoke">
          <Table.Row align="center" className="text-primary">
            {columns.map((column, index) => (
              <React.Fragment key={index}>
                <Table.ColumnHeaderCell>{column.name}</Table.ColumnHeaderCell>
              </React.Fragment>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {insureds &&
            insureds.map((insured, index) => (
              <Table.Row key={index}>
                {columns.map((column, index) => (
                  <Table.Cell key={index}>
                    <TableCellSelector
                      column={column}
                      key={index}
                      insured={insured}
                      value={column.selector && column.selector(insured)}
                      totalInsuredCount={insureds.length}
                      refreshPageData={refreshPageData}
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

const TableCellSelector = ({
  column,
  value,
  insured,
  totalInsuredCount,
  refreshPageData,
}) => {
  switch (column.key) {
    case "MobileNumber":
      return (
        <PhoneNumberView
          value={value}
          insured={insured}
          sendAgainBtnShow={
            insured.HealthApprovalStatusOrdinal === ApprovalStatus.PENDING ||
            insured.KvkkApprovalStatusOrdinal === ApprovalStatus.PENDING
          }
          editBtnShow={
            insured.HealthApprovalStatusOrdinal === ApprovalStatus.PENDING &&
            insured.KvkkApprovalStatusOrdinal === ApprovalStatus.PENDING
          }
          refreshPageData={refreshPageData}
        />
      );
    case "HealthApprovalStatus":
      return (
        <ApprovalStatusView
          value={value}
          insured={insured}
          btnShow={
            insured.HealthApprovalStatusOrdinal === ApprovalStatus.APPROVED
          }
          approvalType={ApprovalType.HEALTH_DECLARATION}
        />
      );
    case "KvkkApprovalStatus":
      return (
        <ApprovalStatusView
          value={value}
          insured={insured}
          btnShow={
            insured.KvkkApprovalStatusOrdinal === ApprovalStatus.APPROVED
          }
          approvalType={ApprovalType.KVKK_DECLARATION}
        />
      );
    case "actions":
      return (
        <ActionsView
          value={value}
          insured={insured}
          totalInsuredCount={totalInsuredCount}
          refreshPageData={refreshPageData}
        />
      );
    default:
      return <div className="flex items-center h-full">{value}</div>;
  }
};

const PhoneNumberView = ({
  value,
  insured,
  sendAgainBtnShow,
  editBtnShow,
  refreshPageData,
}) => {
  const [phoneNumberEditModalShow, setPhoneNumberEditModalShow] =
    useState(false);

  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const { offer } = useOfferContext();

  const checkOfferStatusPaymentWaiting =
    offer && offer.Status === OfferStatus.PAYMENT_WAITING;

  const resendDeclarationForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/ResendDeclarationForOffer`,
        },
      });
      const content = {
        InsuredId: insured?.InsuredId,
      };
      MySwal.fire(
        MySwalData("confirm", {
          title: "Tekrar gönderim",
          text: "Onaylar tekrar gönderilsin mi?",
          icon: "info",
        })
      ).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setLoading(true));
          const response = await Requests().CommonRequest.post({
            url,
            content,
          });
          dispatch(setLoading(false));
          if (response && response.data && response.data?.IsSuccess) {
            MySwal.fire(
              MySwalData("success", { text: "Onaylar tekrar gönderilmiştir." })
            );
          }
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
    <div className="flex items-center gap-x-1">
      <span>{value}</span>
      {sendAgainBtnShow && (
        <button
          disabled={checkOfferStatusPaymentWaiting}
          type="button"
          onClick={() => resendDeclarationForOffer()}
          className="btn btn-primary p-2 rounded-full text-white"
        >
          <Icon icon="HiOutlineRefresh" className="size-3" />
        </button>
      )}
      {editBtnShow && (
        <button
          disabled={checkOfferStatusPaymentWaiting}
          type="button"
          className="btn btn-primary p-2 rounded-full text-white"
          onClick={() => setPhoneNumberEditModalShow(true)}
        >
          <Icon icon="FaEdit" className="size-3" />
        </button>
      )}

      <PhoneNumberEditModal
        refreshPageData={refreshPageData}
        open={phoneNumberEditModalShow}
        handleClose={() => setPhoneNumberEditModalShow(false)}
        insured={insured}
      />
    </div>
  );
};

const PhoneNumberEditModal = ({
  open,
  handleClose,
  insured,
  refreshPageData,
}) => {
  const [formValues, setFormValues] = useState({
    MobileNumber: "",
  });
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const updateInsuredMobileNumber = async (values) => {
    try {
      const content = {
        InsuredId: insured.InsuredId,
        MobileNumber: values.MobileNumber.replace(/\s/g, ""),
      };

      const url = getEntityUrl({
        api: { port: 8141, url: "Offers/UpdateInsuredPhoneNumberForOffer" },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.put({
        url,
        content,
      });
      dispatch(setLoading(false));
      if (response && response.data && response.data?.IsSuccess) {
        refreshPageData && refreshPageData();
        handleClose();
      }
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("warning", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal
      title="Telefon Numarası Güncelle"
      keepMounted
      open={open}
      onClose={handleClose}
    >
      <div className="scrollbar-hide overflow-hidden rounded-none pt-0 px-0">
        <div className="flex flex-col gap-y-2.5">
          <Formik
            validationSchema={PhoneNumberEditModalFormSchema}
            onSubmit={updateInsuredMobileNumber}
            initialValues={formValues}
            enableReinitialize
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <InputBase
                  label="*Cep Telefonu"
                  component={PatternFormatInput}
                  inputClassName="!h-10"
                  type="text"
                  name={`MobileNumber`}
                  format="0 ### ### ## ##"
                  placeholder="Cep telefonu giriniz"
                  allowEmptyFormatting={true}
                />
                <div className="flex gap-2.5 justify-center my-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-primary px-2.5"
                  >
                    Vazgeç
                  </button>
                  <button className="btn btn-success px-2.5">Kaydet</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

const ApprovalStatusView = ({ value, insured, btnShow, approvalType }) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);
  const { offer } = useOfferContext();

  const handleApprovalPrint = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Prints/PrintDeclaration`,
        },
      });

      const content = {
        OfferId: offer?.Id,
        InsuredId: insured?.InsuredId,
        ApprovalType: approvalType,
      };

      MySwal.fire(
        MySwalData("confirm", {
          title: "Onay Basım",
          text: "Onay basılsın mı?",
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
            createLinkAndDownload(new Blob([response.data]), `${offer.Id}.pdf`);
          }
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
    <div className="flex items-center gap-x-1 ">
      <span>{value}</span>
      {btnShow && (
        <button
          onClick={() => handleApprovalPrint()}
          type="button"
          className="btn btn-success p-2 rounded-full text-white"
        >
          <Icon icon="FaFilePdf" className="size-3" />
        </button>
      )}
    </div>
  );
};

const ActionsView = ({ insured, totalInsuredCount, refreshPageData }) => {
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  const { offer } = useOfferContext();

  const checkOfferStatusPaymentWaiting =
    offer && offer.Status === OfferStatus.PAYMENT_WAITING;

  const handleRemoveInsured = async () => {
    try {
      MySwal.fire(
        MySwalData("delete", {
          text: "Sigortalı silinsin mi?",
        })
      ).then(async (result) => {
        if (result.isConfirmed) {
          if (insured && insured.InsuredId) {
            const url = getEntityUrl({
              api: { port: 8141, url: "Offers/DeleteInsuredForOffer" },
            });
            dispatch(setLoading(true));
            const response = await Requests().CommonRequest.put({
              url,
              content: { InsuredId: insured.InsuredId, OfferId: offer?.Id },
            });
            dispatch(setLoading(false));
            if (response && response.data && response.data?.IsSuccess) {
              refreshPageData();
            }
          }
        }
      });
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(MySwalData("error", { text: errorMessage }));
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {totalInsuredCount > 1 && (
        <button
          type="button"
          onClick={() => handleRemoveInsured()}
          disabled={checkOfferStatusPaymentWaiting}
          className="btn btn-danger p-2 rounded-full text-white"
        >
          <Icon icon="FaTrash" className="size-3" />
        </button>
      )}
    </div>
  );
};

export default InsuredsTable;
