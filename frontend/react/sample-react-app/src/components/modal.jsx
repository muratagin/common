import { Modal as MUIModal } from "@mui/material";

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "sm",
  modalContainerClassName,
}) {
  return (
    <MUIModal
      open={open ?? false}
      onClose={onClose}
      className="modal-wrapper"
      disablePortal
    >
      <div className={`modal-content ${size} ${modalContainerClassName}`}>
        {title && (
          <div className="modal-header">
            {<div>{title}</div>}
            {onClose && (
              <button className="btn btn-light" onClick={onClose}>
                X
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </MUIModal>
  );
}
