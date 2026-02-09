import Sidebar from "../components/Dashboard/SideBar";
import Header from "../components/Header/Header";
import StatsCards from "../components/StatsCards/StatsCards";
import RecentActivities from "../components/RecentActivities/RecentActivities";
import ChartAndTables from "../components/ChartAndTables/ChartAndTables";
import "../styles/global.css";
import "../styles/maincontent.css";

const AdminDashboardPage = () => {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <StatsCards />
        <ChartAndTables />
        <RecentActivities />
      </div>
    </>
  );
};

export default AdminDashboardPage;
