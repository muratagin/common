import { checkIfIsEmpty } from "@libs/utils";
import Modal from "./modal";

const ApprovalContentDetails = (props) => {
  return (
    <Modal
      keepMounted
      size="xl"
      open={props?.actionModalShow}
      onClose={props.onClose}
      title="İçerik"
    >
      {checkIfIsEmpty(props?.row?.Content) ? (
        <div
          className="overflow-y-scroll"
          dangerouslySetInnerHTML={{
            __html: props?.row?.Content,
          }}
        />
      ) : (
        <div>İçerik bulunmamaktadır.</div>
      )}
    </Modal>
  );
};

export default ApprovalContentDetails;
