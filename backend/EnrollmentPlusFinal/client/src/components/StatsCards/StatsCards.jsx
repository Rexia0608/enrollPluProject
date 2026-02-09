import "./StatsCards.css";

const StatsCards = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <div className="card dashboard-card stat-card">
            <div className="card-body">
              <div className="card-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number">1,254</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card stat-card">
            <div className="card-body">
              <div className="card-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="stat-number">48</div>
              <div className="stat-label">Faculty Members</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card stat-card">
            <div className="card-body">
              <div className="card-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-number">326</div>
              <div className="stat-label">Pending Reviews</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card stat-card">
            <div className="card-body">
              <div className="card-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-number">189</div>
              <div className="stat-label">Payment Validations</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
