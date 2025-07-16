import { Modal } from "../Modal/Modal";

// 1. Basic Modal with Form (completing your example)
export function ModalWithForm({
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
      <form className={classForm} onSubmit={onSubmit}>
        {children}
        <button type="submit" className={classButton}>
          {titleButton}
        </button>
      </form>
    </Modal>
  );
}

// 2. Confirmation Modal
export function ConfirmModal({
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Modal name="confirm" onClose={onClose}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button
            className="modal__button modal__button--secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="modal__button modal__button--primary"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 3. Info Modal
export function InfoModal({ onClose, title, children }) {
  return (
    <Modal name="info" onClose={onClose}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <div className="modal__body">{children}</div>
      </div>
    </Modal>
  );
}

// 4. Spotify Playlist Modal (specific to your app)
export function PlaylistModal({ onClose, playlist, onEdit, onDelete }) {
  return (
    <Modal name="playlist" onClose={onClose}>
      <div className="modal__content">
        <h2 className="modal__title">{playlist.name}</h2>
        <img
          src={playlist.images[0]?.url}
          alt={playlist.name}
          className="modal__image"
        />
        <p className="modal__description">{playlist.description}</p>
        <div className="modal__stats">
          <span>{playlist.tracks.total} tracks</span>
          <span>{playlist.followers.total} followers</span>
        </div>
        <div className="modal__actions">
          <button
            className="modal__button modal__button--secondary"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="modal__button modal__button--danger"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
