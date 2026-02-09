import "./RecentActivities.css";

const RecentActivities = () => {
  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card dashboard-card table-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Recent Enrollment Applications
              </h5>
              <a href="#" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Date Applied</th>
                      <th>Document Status</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>S-2025-001</td>
                      <td>John Smith</td>
                      <td>Computer Science</td>
                      <td>2025-08-10</td>
                      <td>
                        <span className="badge badge-pending">Pending</span>
                      </td>
                      <td>
                        <span className="badge badge-approved">Verified</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          Review
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>S-2025-002</td>
                      <td>Maria Garcia</td>
                      <td>Business Administration</td>
                      <td>2025-08-09</td>
                      <td>
                        <span className="badge badge-approved">Approved</span>
                      </td>
                      <td>
                        <span className="badge badge-pending">Pending</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-success">
                          Validate
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>S-2025-003</td>
                      <td>David Johnson</td>
                      <td>Engineering</td>
                      <td>2025-08-08</td>
                      <td>
                        <span className="badge badge-rejected">Rejected</span>
                      </td>
                      <td>
                        <span className="badge badge-pending">Pending</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-warning">
                          Resubmit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>S-2025-004</td>
                      <td>Sarah Williams</td>
                      <td>Medicine</td>
                      <td>2025-08-07</td>
                      <td>
                        <span className="badge badge-approved">Approved</span>
                      </td>
                      <td>
                        <span className="badge badge-approved">Verified</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-info">
                          Complete
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>S-2025-005</td>
                      <td>Michael Brown</td>
                      <td>Law</td>
                      <td>2025-08-06</td>
                      <td>
                        <span className="badge badge-pending">Pending</span>
                      </td>
                      <td>
                        <span className="badge badge-rejected">Failed</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger">
                          Reject
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentActivities;
