import "./ItemCard.css";
import { FaHeart } from "react-icons/fa";

export default function ItemCard({ item, onClick }) {
  const imageUrl = item.album.images[0]?.url;
  const albumName = item.album.name;

  return (
    <div
      className="item__card-container"
      onClick={onClick}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="item__overlay">
        <h3 className="item__title">{albumName}</h3>
        <FaHeart className="item__icon" />
      </div>
    </div>
  );
}
