import { Requests } from "@app/api";
import { ApprovalType } from "@app/enum";
import { Checkbox } from "@components/Inputs/Checkbox";
import Modal from "@components/modal";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { KvkkDeclarationFormSchema } from "@validations/kvkk.declaration.form.validation";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Index() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    InsuredId: Number(params.insuredId),
    DeclarationApprovalList: [],
  });

  const currentOrigin = window.location.origin;
  const currentUrl = currentOrigin + location.pathname;

  if (!checkIfIsEmpty(params.insuredId)) {
    return navigate("/shr/", { replace: true });
  }

  useEffect(() => {
    if (checkIfIsEmpty(params.insuredId))
      getDeclarationApprovalsByType(currentUrl);
  }, []);

  const getDeclarationApprovalsByType = async (currentUrl) => {
    try {
      const url = getEntityUrl({
        api: {
          url: `DeclarationApprovals/GetByType?link=${currentUrl}&type=${ApprovalType.KVKK_DECLARATION}`,
          port: 8141,
        },
      });

      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({ url });
      if (response && checkIfIsEmpty(response.data)) {
        const approvals = response.data;
        if (approvals && Array.isArray(approvals) && approvals.length > 0) {
          const initialApprovals = approvals.map((approval) => {
            return {
              Name: approval?.Name,
              ApprovalId: approval?.Id,
              Type: approval?.Type,
              Content: approval?.Content,
              IsApproval: false,
            };
          });

          setFormValues({
            ...formValues,
            DeclarationApprovalList: initialApprovals,
            ShortenerLink: currentUrl,
          });
        }
      } else {
        navigate("/shr/", { replace: true });
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      navigate("/shr/", { replace: true });
    }
  };

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

  return (
    <div className="px-2.5 py-5">
      <div className="flex flex-col gap-5">
        <Formik
          initialValues={formValues}
          enableReinitialize
          onSubmit={formSubmit}
          validationSchema={KvkkDeclarationFormSchema}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
              <FieldArray name="DeclarationApprovalList">
                {({ insert, remove, push }) => (
                  <>
                    {values?.DeclarationApprovalList &&
                      values?.DeclarationApprovalList?.length > 0 &&
                      values?.DeclarationApprovalList.map((approval, index) => (
                        <>
                          <Checkbox
                            containerClassName="items-baseline lg:items-center"
                            setFieldValue={setFieldValue}
                            name={`DeclarationApprovalList.${index}.IsApproval`}
                            label={approval?.Name}
                            ModalComponent={
                              checkIfIsEmpty(approval?.Content) && ApprovalModal
                            }
                            modal={{
                              title: approval?.Name,
                              content: approval?.Content,
                            }}
                            showModal={checkIfIsEmpty(approval.Content)}
                            className="items-start"
                          />
                        </>
                      ))}
                  </>
                )}
              </FieldArray>
              <div className="flex justify-center flex-col items-center gap-2.5 my-5">
                <button className="btn btn-success w-44  px-2.5">
                  Onaylıyorum
                </button>
                {/* <button className="btn btn-danger w-44 px-2.5">
                  Onaylamıyorum
                </button> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export const ApprovalModal = ({ modal, open, handleClose, onApproved }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (modalRef)
      modalRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [modalRef]);

  return (
    <Modal
      size="xl"
      keepMounted
      open={open}
      onClose={handleClose}
      title={modal?.title}
    >
      <div
        className="scrollbar-hide overflow-hidden rounded-none pt-0 px-0"
        ref={modalRef}
      >
        <div className=" px-4 lg:px-8 text-sm 2xl:text-md font-light scrollbar-hide overflow-auto h-[74%] lg:h-[78%] 2xl:h-[84%] relative">
          <p dangerouslySetInnerHTML={{ __html: modal?.content }} />
          <div className="bg-approvalmodal-content-border-white sticky bottom-0 left-0 w-full h-12" />
        </div>
        <div className="w-full flex justify-center items-start h-14 mt-3">
          <button
            type="button"
            onClick={onApproved}
            className="h-12 2xl:text-lg bg-primary font-bold text-white px-5 2xl:px-10 bg-turquoise-blue rounded-2xl 2xl:rounded-3xl"
          >
            Okudum, onaylıyorum
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Index;
