import './Header.css';

export default function Header() {
    return (
        <header className="header__container">
            <div className="header__logo">
                <h1>Spotify <span>Playlist Share</span></h1>
            </div>
            <nav className="header__nav">
                <a href="/">Home</a>
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
            </nav>
        </header>
    );
}
