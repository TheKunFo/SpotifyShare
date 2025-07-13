import React, { useState, useEffect } from "react";
import {
  isSpotifyConnected,
  connectToSpotify,
  disconnectFromSpotify,
  getSpotifyUserProfile,
  getTopTracks,
  getTopArtists,
} from "../../utils/spotify";
import "./SpotifyConnect.css";

const SpotifyConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [showingTracks, setShowingTracks] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();

    // Check for authorization errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error === "access_denied") {
      setError(
        "Spotify authorization was denied. Please try again and grant the required permissions."
      );
    } else if (error) {
      setError(`Spotify authorization error: ${error}`);
    }
  }, []);

  const checkConnection = async () => {
    const connected = isSpotifyConnected();
    setIsConnected(connected);

    if (connected) {
      try {
        const profile = await getSpotifyUserProfile();
        setUserProfile(profile);

        // Fetch user's music data
        const tracks = await getTopTracks("long_term", 5);
        const artists = await getTopArtists("long_term", 5);
        setTopTracks(tracks);
        setTopArtists(artists);

        console.log(
          "Top Tracks:",
          tracks?.map(
            ({ name, artists }) =>
              `${name} by ${artists.map((artist) => artist.name).join(", ")}`
          )
        );
      } catch (error) {
        console.error("Failed to get user profile or music data:", error);
        // Token might be expired, disconnect
        disconnectFromSpotify();
        setIsConnected(false);
      }
    }
  };

  const handleConnect = () => {
    setIsLoading(true);
    setError(null);
    try {
      connectToSpotify();
      // Set a timeout to detect if user doesn't return (potential redirect URI error)
      setTimeout(() => {
        if (isLoading) {
          setError(
            "INVALID_CLIENT: Invalid redirect URI - Please configure your Spotify app settings"
          );
          setIsLoading(false);
        }
      }, 3000);
    } catch (err) {
      setError("Failed to connect to Spotify. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromSpotify();
    setIsConnected(false);
    setUserProfile(null);
    setTopTracks([]);
    setTopArtists([]);
  };

  if (isConnected && userProfile) {
    return (
      <div className="spotify-connect connected">
        <div className="spotify-user-section">
          <div className="spotify-user-info">
            <img
              src={userProfile.images?.[0]?.url || "/default-avatar.png"}
              alt={userProfile.display_name}
              className="spotify-avatar"
            />
            <div className="spotify-user-details">
              <h3>Connected to Spotify</h3>
              <p>{userProfile.display_name}</p>
              <p className="spotify-email">{userProfile.email}</p>
            </div>
          </div>
          <button onClick={handleDisconnect} className="spotify-disconnect-btn">
            Disconnect
          </button>
        </div>

        <div className="spotify-music-data">
          <div className="spotify-data-tabs">
            <button
              className={`spotify-tab ${showingTracks ? "active" : ""}`}
              onClick={() => setShowingTracks(true)}
            >
              Top Tracks
            </button>
            <button
              className={`spotify-tab ${!showingTracks ? "active" : ""}`}
              onClick={() => setShowingTracks(false)}
            >
              Top Artists
            </button>
          </div>

          {showingTracks ? (
            <div className="spotify-tracks-list">
              <h4>Your Top Tracks (Long Term)</h4>
              {topTracks.length > 0 ? (
                <ul className="spotify-music-list">
                  {topTracks.map((track, index) => (
                    <li key={track.id} className="spotify-music-item">
                      <span className="spotify-rank">{index + 1}</span>
                      <img
                        src={
                          track.album.images?.[2]?.url || "/default-album.png"
                        }
                        alt={track.album.name}
                        className="spotify-track-image"
                      />
                      <div className="spotify-track-info">
                        <p className="spotify-track-name">{track.name}</p>
                        <p className="spotify-track-artists">
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </p>
                      </div>
                      <span className="spotify-popularity">
                        {track.popularity}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="spotify-no-data">No top tracks found</p>
              )}
            </div>
          ) : (
            <div className="spotify-artists-list">
              <h4>Your Top Artists (Long Term)</h4>
              {topArtists.length > 0 ? (
                <ul className="spotify-music-list">
                  {topArtists.map((artist, index) => (
                    <li key={artist.id} className="spotify-music-item">
                      <span className="spotify-rank">{index + 1}</span>
                      <img
                        src={artist.images?.[2]?.url || "/default-artist.png"}
                        alt={artist.name}
                        className="spotify-artist-image"
                      />
                      <div className="spotify-artist-info">
                        <p className="spotify-artist-name">{artist.name}</p>
                        <p className="spotify-artist-genres">
                          {artist.genres.slice(0, 2).join(", ")}
                        </p>
                      </div>
                      <span className="spotify-followers">
                        {(artist.followers.total / 1000000).toFixed(1)}M
                        followers
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="spotify-no-data">No top artists found</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-connect disconnected">
      <div className="spotify-connect-content">
        <div className="spotify-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <h3>Connect to Spotify</h3>
        <p>
          Connect your Spotify account to access your playlists and music
          library
        </p>
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="spotify-connect-btn"
        >
          {isLoading ? "Connecting..." : "Connect to Spotify"}
        </button>

        {error && (
          <div className="spotify-error">
            <p>❌ {error}</p>
            <details className="spotify-troubleshoot">
              <summary>Fix INVALID_CLIENT Error</summary>
              <div className="spotify-help">
                <p>
                  <strong>
                    This error means your Spotify app redirect URI is not
                    configured correctly.
                  </strong>
                </p>
                <p>
                  <strong>Follow these exact steps:</strong>
                </p>
                <ol>
                  <li>
                    Go to{" "}
                    <a
                      href="https://developer.spotify.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Spotify Developer Dashboard
                    </a>
                  </li>
                  <li>
                    Find your app with Client ID:{" "}
                    <code>95d06211cf12454a8ffa70954cdfdd60</code>
                  </li>
                  <li>Click "Edit Settings"</li>
                  <li>In "Redirect URIs" section, add EXACTLY this URI:</li>
                  <div className="spotify-uri-box">
                    <code>http://localhost:5174/callback</code>
                  </div>
                  <li>Click "Add"</li>
                  <li>Click "Save" at the bottom</li>
                  <li>Wait 1-2 minutes for changes to take effect</li>
                  <li>Try connecting again</li>
                </ol>
                <p>
                  <strong>Current server is running on:</strong>{" "}
                  <code>{window.location.origin}</code>
                </p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyConnect;
