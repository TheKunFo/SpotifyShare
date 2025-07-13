import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../../utils/spotify";

const SpotifyCallback = () => {
  const [status, setStatus] = useState("Processing...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error) {
        setStatus("Authorization denied");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (code) {
        try {
          setStatus("Exchanging authorization code...");
          const tokenData = await exchangeCodeForToken(code);

          // Store tokens
          localStorage.setItem("spotify_access_token", tokenData.access_token);
          localStorage.setItem(
            "spotify_refresh_token",
            tokenData.refresh_token
          );
          localStorage.setItem(
            "spotify_token_expiry",
            Date.now() + tokenData.expires_in * 1000
          );

          setStatus("Connected successfully! Redirecting...");
          setTimeout(() => navigate("/"), 2000);
        } catch (error) {
          console.error("Token exchange failed:", error);
          setStatus("Failed to connect to Spotify");
          setTimeout(() => navigate("/"), 3000);
        }
      } else {
        setStatus("No authorization code received");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1db954, #1ed760)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        ></div>
        <h2>Spotify Connection</h2>
        <p>{status}</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SpotifyCallback;
