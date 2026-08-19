import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const name =
    user?.name ||
    user?.username ||
    user?.fullName ||
    user?.displayName ||
    "User";

  return (
    <header className="header">
      <button className="mobile-menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <div className="header-left">
        <button className="sidebar-collapse">◧</button>
      </div>

      <div className="header-right">
        <div className="header-user-group">
          <span className="header-user-name">{name}</span>

          <button
            className="header-avatar"
            onClick={() => navigate("/profile")}
          >
            {user?.picture ? (
              <img src={user.picture} alt={name} />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
