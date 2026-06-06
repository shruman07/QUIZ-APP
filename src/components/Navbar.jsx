import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  

  const links = [
    { to: "/",         label: "Home",      icon: "⌂" },
    { to: "/setup",    label: "New Quiz",  icon: "▶" },
    { to: "/dashboard",label: "Dashboard", icon: "◈" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">⟨/⟩</span>
          <span className="logo-text">Dev<span className="logo-accent">Lore</span></span>
        </NavLink>

        <nav className="navbar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link--active" : ""}`
              }
              end={link.to === "/"}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink to="/setup" className="btn btn-primary btn-sm navbar-cta">
          Start Quiz
        </NavLink>
      </div>
    </header>
  );
}
