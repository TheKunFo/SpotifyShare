import { Modal } from "../Modal/Modal";
import "./itemModal.css";

// Refactored ItemModal using the new Modal wrapper
export default function ItemModal({ item, onClose }) {
  return (
    <Modal name="item" onClose={onClose}>
      <div className="item-modal__content">
        <h2>{item.album.name}</h2>
        <img src={item.album.images[0]?.url} alt={item.album.name} />
        <p>
          Artist: {item.album.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
    </Modal>
  );
}
