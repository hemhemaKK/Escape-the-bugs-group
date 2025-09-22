import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ProfileSettings from "./ProfileSettings";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [activeSection, setActiveSection] = useState("Dashboard");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.user);
      } catch (err) {
        console.error("Authorization error:", err);
        localStorage.removeItem("token");
        alert("Not authorized. Please login again.");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User data not found.</p>;

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <div style={cards}>
            <div style={{ ...cardStyle, animationDelay: "0.1s" }}>
              <h3>Escape the bug</h3>
            </div>
          </div>
        );
      case "A":
        return "< />";
      case "D":
        return "</>"
      case "B":
        return "</>";
      case "C":
        return "< />";
      case "Profile":
        return <ProfileSettings user={user} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div style={mainContentStyle}>{renderSection()}</div>
    </div>
  );
}

// Styles
const mainContentStyle = {
  flex: 1,
  marginLeft: "300px",
  padding: "2rem",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f4f4f4, #e0e7ff)",
  transition: "background 0.5s ease",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "linear-gradient(135deg, #ffffff, #f0f4ff)",
  borderRadius: "15px",
  padding: "2rem",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  animation: "fadeInUp 0.5s forwards",
};

// Keyframes for animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// Hover effect
cardStyle["&:hover"] = {
  transform: "translateY(-8px)",
  boxShadow: "0 12px 25px rgba(0,0,0,0.35)",
};
