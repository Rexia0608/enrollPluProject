import "./Header.css";

const Header = () => {
  return (
    <>
      <div className="header">
        <button id="sidebarToggle" className="me-3">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="ms-auto user-info">
          <div className="user-avatar">AD</div>
          <div>
            <div className="fw-bold">Admin User</div>
            <div className="small text-muted">Administrator</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
