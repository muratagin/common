import Modal from "@components/modal";
import FormBuilder from "./form.builder";

function MyModal(props) {
  let data = [{ ...props }];
  const handleClose = () => props.close();
  const formSubmit = (formName, formData) => {
    props.close(mode, { ...formData, Id: props.initialData?.Id });
  };

  let mode = props.initialData ? "edit" : "create";

  return (
    <>
      <Modal
        size={props?.group?.modalSize ? props?.group?.modalSize : "lg"}
        open={props.show}
        onClose={handleClose}
        title={
          props.entityName
            ? props.initialData
              ? props.readonly === true
                ? props.entityName + " Görüntüle"
                : props.entityName + " Düzenle"
              : props.entityName + " Ekle"
            : props.group?.title
        }
      >
        <FormBuilder
          readonly={props.readonly ? props.readonly : false}
          name=""
          type="innerForm"
          mode={mode}
          data={data}
          submit={formSubmit}
          refresh={props.refresh}
          handleClose={handleClose}
        />
        {/* <FormBuilder name="" type="innerForm" mode="edit" initialData={props.initialData} data={data} submit={formSubmit} /> */}
        {/* <Modal.Footer>
          <button onClick={handleClose}>
            Close
          </button>
          <button onClick={handleClose}>
            Save Changes
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}
export default MyModal;
