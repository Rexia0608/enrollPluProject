import "./SideBar.css";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-brand">
          <i className="fas fa-graduation-cap me-2"></i>EnrollPlus
        </div>
        <ul className="sidebar-nav">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-users"></i> User Management
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-calendar-alt"></i> Schedules
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-book"></i> Academic Years
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-list-alt"></i> Course Management
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-cogs"></i> System Settings
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-tools"></i> Maintenance Mode
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
