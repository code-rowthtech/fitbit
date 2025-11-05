import { useState, useEffect } from "react";

const FitbitSuccess = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.close() || (window.location.href = "about:blank");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const styles = {
    container: {
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      padding: "32px",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
      animation: "scaleIn 0.5s ease-out",
    },
    iconContainer: {
      marginBottom: "24px",
    },
    icon: {
      margin: "0 auto",
      height: "64px",
      width: "64px",
      color: "#10b981",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "8px",
    },
    description: {
      color: "#6b7280",
      marginBottom: "24px",
    },
    subtext: {
      color: "#9ca3af",
      fontSize: "14px",
      marginBottom: "24px",
    },
    button: {
      width: "100%",
      backgroundColor: "#4b5563",
      color: "white",
      fontWeight: "500",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
      fontSize: "16px",
    },
    countdown: {
      fontSize: "12px",
      color: "#9ca3af",
      marginTop: "16px",
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("autoClose") === "true") {
    setTimeout(() => {
      window.close();
      if (!window.closed) {
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    }, 2000);
  }

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .close-button { display: none; }
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            <svg
              style={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 style={styles.title}>Fitbit Connected Successfully!</h1>
          <p style={styles.description}>
            Your Fitbit account has been successfully connected to our platform.
          </p>
          <p style={styles.subtext}>
            We can now view your daily health data and receive personalized
            insights.
          </p>
          <button
            className="close-button"
            style={styles.button}
            onClick={() => {
              window.close() || (window.location.href = "about:blank");
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4b5563")}
          >
            Close
          </button>
          <p style={styles.countdown}>
            This window will automatically close in <span>{countdown}</span>{" "}
            seconds
          </p>
        </div>
      </div>
    </>
  );
};

export default FitbitSuccess;
