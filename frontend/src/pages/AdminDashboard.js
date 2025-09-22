import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSettings from "./ProfileSettings";

const BASE_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, contacts: 0 });
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Fetch admin profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch all admin data
  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      try {
        const [usersRes, contactsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${BASE_URL}/api/admin/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

       
        setStats({
          users: usersRes.data.length,
          contacts: contactsRes.data.length,
        });

        setUsers(usersRes.data);
        setContacts(contactsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchAllData();
  }, [token]);

  const menuItems = ["Dashboard", "Users"];
  const handleMenuClick = (menu) => setActiveSection(menu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- Styles ---
  const tableStyle = { width: "100%", borderCollapse: "separate", borderSpacing: 0, marginTop: "10px", backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "10px", overflow: "hidden", fontSize: "0.95rem", color: "#333" };
  const thStyle = { backgroundColor: "#020202ff", color: "#fff", textAlign: "left", padding: "12px 15px", fontWeight: "bold" };
  const tdStyle = { padding: "12px 15px", borderBottom: "1px solid #eee" };
  const trStyle = (idx) => ({ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff", transition: "background-color 0.2s" });
  const cardStyle = { backgroundColor: "#fff", flex: "1 1 200px", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center", fontWeight: "bold", fontSize: "18px" };
  const sectionTitle = { color: "#333", marginBottom: "15px" };
  const sidebarStyle = { width: "250px", minHeight: "100vh", backgroundColor: "#111", padding: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "fixed", left: 0, top: 0 };
  const profileStyle = { padding: "0.5rem", borderBottom: "1px solid #444", textAlign: "center" };
  const profilePicStyle = { borderRadius: "50%", marginBottom: "0.2rem", width: "80px", height: "80px", objectFit: "cover" };
  const menuItemStyle = isActive => ({ textDecoration: "none", color: isActive ? "#4CAF50" : "#fff", padding: "0.8rem 1rem", display: "block", borderRadius: "8px", margin: "0.4rem 0", cursor: "pointer", fontWeight: "bold", backgroundColor: isActive ? "#222" : "transparent", transition: "all 0.2s" });
  const bottomLinkStyle = (isActive, isLogout = false) => ({ textDecoration: "none", color: "#fff", padding: "0.8rem 1rem", display: "block", borderRadius: "8px", margin: "0.4rem 0", cursor: "pointer", fontWeight: "bold", backgroundColor: isLogout ? "#ff4d4d" : isActive ? "#222" : "transparent", textAlign: "center", transition: "all 0.2s" });

  // --- Reusable Tables ---
  const renderUsersTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Phone Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} style={trStyle(idx)}>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.phone || "-"}</td>
              <td style={tdStyle}>
                <span style={{ color: "white", padding: "4px 8px", borderRadius: "6px", backgroundColor: u.isPhoneVerified ? "green" : "red", fontWeight: "bold", fontSize: "0.9rem" }}>
                  {u.isPhoneVerified ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <div>
            <h2 style={sectionTitle}>Dashboard</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={cardStyle}>Users: {stats.users}</div>
              <div style={cardStyle}>Contacts: {stats.contacts}</div>
            </div>
          </div>
        );
      case "Users": return <div><h2 style={sectionTitle}>All Users</h2>{renderUsersTable()}</div>;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={profileStyle}>
          {user ? (
            <>
              <img src={user.profilePic || "https://via.placeholder.com/80"} alt="Profile" style={profilePicStyle} />
              <h3 style={{ color: "white", margin: 0 }}>{user.name}</h3>
              <p style={{ color: "#ccc", fontSize: "0.9rem" }}>{user.email}</p>
            </>
          ) : <h3 style={{ color: "white" }}>Welcome</h3>}
        </div>
        <div style={{ flex: 1, marginTop: "1rem" }}>
          {menuItems.map(menu => (
            <div key={menu} onClick={() => handleMenuClick(menu)} style={menuItemStyle(menu === activeSection)}>
              {menu}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <div onClick={() => handleMenuClick("Profile")} style={bottomLinkStyle(activeSection === "Profile")}>Profile</div>
          <div onClick={handleLogout} style={bottomLinkStyle(false, true)}>Logout</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "280px", padding: "20px", marginTop: "20px", flex: 1, backgroundColor: "#f5f6f6ff" }}>
        {renderContent()}
      </div>
    </div>
  );
}
