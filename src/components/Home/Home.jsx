import './Home.css'
import backgroundLandingPage from '../../assets/background.png';
import Main from '../Main/Main';
export default function Home({
    items,
    onCardClick 
}) {
    const backgroundUrl = {
        backgroundImage: `url(${backgroundLandingPage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    return (
        <>
            <section className="home__landing-page" style={backgroundUrl}>
                <div className="home__column left">
                    <h1>Spotify <span>Playlist Share</span> </h1>
                    <p>The hangout spot for playlist lovers. Share your music here! A platform to share, discover, and enjoy the best Spotify playlists. Start your music journey now.</p>
                </div>
                <div className="home__column right">
                </div>
            </section>
            <Main 
                items={items}
                onCardClick={onCardClick}
            />
            
        </>
    )
}