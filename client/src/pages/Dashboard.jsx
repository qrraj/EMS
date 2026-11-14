import { useEffect, useState } from "react";
import { dummyEmployeeDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/employeeDashboard";
import AdminDashboard from "../components/adminDashboard";
import { dummyAdminDashboardData } from "../assets/assets";
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setData(dummyAdminDashboardData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  if (loading) return <Loading />;
  if (!data)
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load Dashboard
      </p>
    );
  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  } else {
    return <EmployeeDashboard data={data} />;
  }
};

export default Dashboard;
