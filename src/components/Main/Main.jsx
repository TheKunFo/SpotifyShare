import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";

export default function Main({ items, onCardClick }) {
  return (
    <main>
      <section className="main__page">
        <h2>Album Spotify</h2>
        <div className="main__grid">
          {Array.isArray(items) &&
            items.map((item, index) => (
              <div key={index} className="card">
                <ItemCard item={item} onClick={() => onCardClick(item)} />
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
