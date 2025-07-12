import "./itemModal.css";

export default function ItemModal({ item, onClose }) {
  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          ✖
        </button>
        <h2>{item.album.name}</h2>
        <img src={item.album.images[0]?.url} alt={item.album.name} />
        <p>
          Artist: {item.album.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
