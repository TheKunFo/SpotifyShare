import './Header.css';

export default function Header({
    setShowLogin,
    setShowSignUp
}) {
    return (
        <header className="header__container">
            <div className="header__logo">
                <h1>Spotify <span>Playlist Share</span></h1>
            </div>
            <nav className="header__nav">
                <button href="/">Home</button>
                <button onClick={() => setShowLogin(true)} >Login</button>
                <button onClick={() => setShowSignUp(true)} >Sign Up</button>
            </nav>
        </header>
    );
}
