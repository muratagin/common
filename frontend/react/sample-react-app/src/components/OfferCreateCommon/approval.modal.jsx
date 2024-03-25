import Modal from "@components/modal";
import { useEffect, useRef } from "react";

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
