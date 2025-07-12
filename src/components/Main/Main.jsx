import ItemCard from '../ItemCard/ItemCard';
import './Main.css';

export default function Main({
    items,
    onCardClick,

}) {
    return (
        <section className="main__page">
            <h1>Album Spotify</h1>
            <div className="main__grid">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="card">
                        <ItemCard 
                            item={item} 
                            onClick={() => onCardClick(item)} 
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}