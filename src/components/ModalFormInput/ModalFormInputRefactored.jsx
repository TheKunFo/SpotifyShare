import { Modal } from "../Modal/Modal";
import "./ModalFormInput.css";

// Reusable modal with form structure
function ModalWithForm({
  name,
  onClose,
  title,
  classForm,
  classButton,
  titleButton,
  onSubmit,
  children,
}) {
  return (
    <Modal name={name} onClose={onClose}>
      <h2 className="modal__title">{title}</h2>
      <div className="modalFormInput__header">
        <h2>
          Spotify <span>Playlist Share</span>
        </h2>
        <h2>{title}</h2>
      </div>
      <form className={classForm} onSubmit={onSubmit}>
        {children}
        <button type="submit" className={classButton}>
          {titleButton}
        </button>
      </form>
    </Modal>
  );
}

// Refactored ModalFormInput using the new Modal wrapper
export default function ModalFormInput({
  isOpen,
  onClose,
  title,
  classForm,
  classButton,
  titleButton,
  onSubmit,
  children,
}) {
  if (!isOpen) return null;

  return (
    <ModalWithForm
      name="form-input"
      onClose={onClose}
      title={title}
      classForm={classForm}
      classButton={classButton}
      titleButton={titleButton}
      onSubmit={onSubmit}
    >
      {children}
    </ModalWithForm>
  );
}

export { ModalWithForm };
