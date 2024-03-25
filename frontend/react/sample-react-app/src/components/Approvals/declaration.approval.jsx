import { Requests } from "@app/api";
import { Checkbox } from "@components/Inputs/Checkbox";
import { InputBase } from "@components/Inputs/InputBase";
import { TextArea } from "@components/Inputs/TextArea";
import Modal from "@components/modal";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, currencyFormat } from "@libs/utils";
import { Table } from "@radix-ui/themes";
import { setLoading } from "@slices/dynamicStyleSlice";
import {
  HealthDeclarationFormSchema,
  HealthDeclarationModalFormSchema,
} from "@validations/health.declaration.form.validation";
import classNames from "classnames";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Index() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [healthDeclarationInfo, setHealthDeclarationInfo] = useState(null);

  const currentOrigin = window.location.origin;
  const currentUrl = currentOrigin + location.pathname;

  if (!checkIfIsEmpty(params.insuredId)) {
    return navigate("/shr/", { replace: true });
  }

  useEffect(() => {
    if (checkIfIsEmpty(params.insuredId))
      getDeclarationApprovalsByLink(currentUrl);
  }, []);

  const getDeclarationApprovalsByLink = async (currentUrl) => {
    try {
      const url = getEntityUrl({
        api: {
          url: `DeclarationApprovals/GetByLink?link=${currentUrl}`,
          port: 8141,
        },
      });

      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({ url });
      if (response && checkIfIsEmpty(response.data)) {
        setHealthDeclarationInfo(response.data);
      } else {
        navigate("/shr/", { replace: true });
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      navigate("/shr/", { replace: true });
    }
  };

  return (
    <div className="px-2.5 py-5">
      <div className="flex flex-col gap-5">
        <InsurerInfo healthDeclarationInfo={healthDeclarationInfo} />
        <InsuredInfo healthDeclarationInfo={healthDeclarationInfo} />
        <HealthInfo />
        <ApprovalForm
          approvals={healthDeclarationInfo?.ApprovalList || []}
          currentUrl={currentUrl}
        />
      </div>
    </div>
  );
}

const InsurerInfo = ({ healthDeclarationInfo }) => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <h4 className="font-semibold text-lg pl-1.5 text-primary">
        Sigorta Ettiren Bilgileri
      </h4>
      <Table.Root className="bg-white border-[1px] shadow-sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-xs">
              AD SOYAD / UNVAN
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-xs">
              T.C. VEYA VKN
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-xs">
              E-POSTA ADRESİ
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsurerName}
            </Table.Cell>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsurerIdNumber}
            </Table.Cell>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsurerEmailAddress}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  );
};

const InsuredInfo = ({ healthDeclarationInfo }) => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <h4 className="font-semibold text-lg pl-1.5 text-primary">
        Sigortalı Bilgileri
      </h4>
      <Table.Root className="bg-white border-[1px] shadow-sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-xs">
              SİGORTALI
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-xs">
              YAKINLIK DERECESİ
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-xs">
              RİSK İLİ
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-xs">
              PRİM
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsuredFullName}
            </Table.Cell>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsuredIndividualType}
            </Table.Cell>
            <Table.Cell className="text-xs">
              {healthDeclarationInfo?.InsuredCityName}
            </Table.Cell>
            <Table.Cell className="text-xs">
              {currencyFormat(healthDeclarationInfo?.InsuredPremium)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  );
};

const HealthInfo = () => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <h4 className="font-semibold text-lg pl-1.5 text-primary">
        Sağlık Bilgileri
      </h4>
      <p className="px-2.5 bg-very-light-gray text-white rounded-md p-2.5">
        Aşağıda sorgulanan hastalık ya da durumlara vereceğiniz “Evet” yanıtları
        için, lütfen açıklamalar bölümüne sigortalı adayı ve hastalık / durum
        numarasını yazarak; mevcut şikayetlerin ne olduğu, tetkik edilen ya da
        tedavi olunan rahatsızlık ile ilgili tıbbı tanı, tetkik / tedavi görülen
        doktor / hastane adı ve son durum ile ilgili detayları belirtiniz.
        “EVET” olarak işaretleyeceğiniz hastalık ve/veya durumla ilgili,
        elinizde bulunan doktor, ameliyat, epikriz raporları, test ve varsa
        patoloji sonuçlarının kopyalarını lütfen Beyan Formuna ekleyiniz.
      </p>
    </div>
  );
};

const ApprovalForm = ({ approvals, currentUrl }) => {
  const params = useParams();
  const insuredId = params?.insuredId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    InsuredId: Number(insuredId),
    DeclarationApprovalList: [],
    IsAllAproved: false,
  });

  const [modalState, setModalState] = useState({
    show: false,
    boundApprove: null,
    approveName: "",
  });

  useEffect(() => {
    if (approvals && Array.isArray(approvals) && approvals.length > 0) {
      const initialApprovals = approvals.map((approval) => {
        return {
          Name: approval?.Name,
          ApprovalId: approval?.Id,
          Type: approval?.Type,
          IsApproval: "",
          InsuredDescription: "",
        };
      });

      setFormValues({
        ...formValues,
        DeclarationApprovalList: initialApprovals,
        ShortenerLink: currentUrl,
      });
    }
  }, [approvals]);

  const formSubmit = async (values) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `DeclarationApprovals`,
        },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.post({
        url,
        content: values,
      });

      if (response && response.data && response.data?.IsSuccess) {
        navigate("/shr/", { replace: true, state: { isFormSubmit: true } });
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("error", error);
    }
  };

  const handleApprovedModal = (event, boundApprove, index, setFieldValue) => {
    const { value } = event.target;
    if (value == 1) {
      setModalState({
        show: true,
        boundApprove: boundApprove,
        index: index,
        setFieldValue: setFieldValue,
      });
    } else {
      setFieldValue(
        `DeclarationApprovalList.${index}.IsApproval`,
        Boolean(Number(value))
      );
      setFieldValue(`DeclarationApprovalList.${index}.InsuredDescription`, "");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={formValues}
        onSubmit={formSubmit}
        validationSchema={HealthDeclarationFormSchema}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-2.5">
            <FieldArray name="DeclarationApprovalList">
              {({ insert, remove, push }) => (
                <>
                  {values?.DeclarationApprovalList &&
                    values?.DeclarationApprovalList?.length > 0 &&
                    values?.DeclarationApprovalList.map((approval, index) => (
                      <>
                        <div
                          className="grid lg:flex lg:px-5 justify-between bg-light rounded-md border shadow-sm p-2.5 gap-2.5"
                          key={index}
                        >
                          <p className="text-sm">{approval.Name}</p>
                          <div className="flex gap-y-2.5 gap-x-5">
                            <label className="flex gap-x-1 cursor-pointer items-center">
                              <Field
                                type="radio"
                                name={`DeclarationApprovalList.${index}.IsApproval`}
                                value={1}
                                className="cursor-pointer w-4 h-4 hidden"
                                onChange={(event) =>
                                  handleApprovedModal(
                                    event,
                                    approval,
                                    index,
                                    setFieldValue
                                  )
                                }
                              />
                              <div
                                className={classNames({
                                  "w-4 h-4 border border-matter-horn": true,
                                  "!bg-primary": approval.IsApproval === true,
                                })}
                              />
                              <span className="text-sm">Evet</span>
                            </label>
                            <label className="flex gap-x-1 cursor-pointer items-center relative">
                              <Field
                                type="radio"
                                name={`DeclarationApprovalList.${index}.IsApproved`}
                                value={0}
                                className="cursor-pointer w-4 h-4 hidden"
                                onChange={(event) =>
                                  handleApprovedModal(
                                    event,
                                    approval,
                                    index,
                                    setFieldValue
                                  )
                                }
                              />
                              <div
                                className={classNames({
                                  "w-4 h-4 border border-matter-horn": true,
                                  "!bg-primary": approval.IsApproval === false,
                                })}
                              />
                              <span className="text-sm">Hayır</span>
                            </label>
                          </div>
                        </div>
                        <ErrorMessage
                          className="text-red-500 text-xs px-1"
                          component="span"
                          name={`DeclarationApprovalList.${index}.IsApproval`}
                        />
                        <ErrorMessage
                          className="text-red-500 text-xs px-1"
                          component="span"
                          name={`DeclarationApprovalList.${index}.InsuredDescription`}
                        />
                      </>
                    ))}
                </>
              )}
            </FieldArray>
            <div className="mt-5">
              <Checkbox
                setFieldValue={setFieldValue}
                name="IsAllAproved"
                label="Yukarıda belirtilen beyanlar tarafımca verilmiş olup, doğruluğunu kabul ve beyan ederim."
                labelProps={{ className: "text-sm" }}
              />
            </div>
            <div className="flex justify-center my-5">
              <button className="btn btn-success py-2.5 px-5">
                Beyanı Onaylıyorum
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {modalState.show && (
        <ApprovalFormModal
          boundApprove={modalState.boundApprove}
          open={modalState.show}
          index={modalState.index}
          handleClose={() => setModalState({ show: false })}
          setFieldValue={modalState.setFieldValue}
        />
      )}
    </>
  );
};

export const ApprovalFormModal = ({
  boundApprove,
  setFieldValue,
  index,
  open,
  handleClose,
}) => {
  const modalRef = useRef();
  const [formValues, setFormValues] = useState({
    InsuredDescription: boundApprove?.InsuredDescription,
  });

  useEffect(() => {
    if (modalRef)
      modalRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [modalRef]);

  const handleApprove = (values) => {
    setFieldValue(`DeclarationApprovalList.${index}.IsApproval`, true);
    setFieldValue(
      `DeclarationApprovalList.${index}.InsuredDescription`,
      values.InsuredDescription
    );
    handleClose();
  };

  return (
    <Modal keepMounted open={open} onClose={handleClose}>
      <div
        className="scrollbar-hide overflow-hidden rounded-none pt-0 px-0"
        ref={modalRef}
      >
        <div className="flex flex-col gap-y-2.5">
          <p className="font-semibold p-2.5 rounded-md shadow-sm bg-danger text-white border">
            {boundApprove.Name}
          </p>

          <Formik
            initialValues={formValues}
            onSubmit={handleApprove}
            enableReinitialize
            validationSchema={HealthDeclarationModalFormSchema}
          >
            {({ values }) => (
              <Form>
                <InputBase
                  label="*Hastalık teşhis/tedavi tarihi, hastane ve doktor adını yazınız"
                  component={TextArea}
                  inputClassName="!p-1.5"
                  name="InsuredDescription"
                  placeholder="Hastalık teşhis/tedavi tarihi, hastane ve doktor adını yazınız "
                  rows={7}
                />
                <div className="flex gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-primary px-2.5"
                  >
                    Geri Dön
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

export default Index;
