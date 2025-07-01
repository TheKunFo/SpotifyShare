import './Home.css'
import backgroundLandingPage from '../../assets/background-homesr.png';
export default function Home({

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
            
        </>
    )
}