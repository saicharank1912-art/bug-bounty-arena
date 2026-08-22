import { useEffect } from "react";
import "./Loading.css";

function Loading({ onComplete }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);

  }, [onComplete]);

  return (
    <div className="loading-screen">

      <div className="loading-content">

        <div className="loading-logo">
          <span>◈</span>
          BIG BOUNTY
        </div>

        <div className="loading-subtitle">
          THE BOUNTY NETWORK
        </div>

        <div className="loading-spinner">
          <div></div>
        </div>

        <p>
          SCANNING BOUNTY NETWORK...
        </p>

        <div className="loading-bar">
          <div></div>
        </div>

      </div>

    </div>
  );
}

export default Loading;