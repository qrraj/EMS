import { useCallback, useState, useEffect } from "react";
import { dummyLeaveData } from "../assets/assets";
import Loading from "../components/Loading";
import {
  ThermometerIcon,
  UmbrellaIcon,
  PalmtreeIcon,
  PlusIcon,
} from "lucide-react";
import LeaveHistory from "../components/leave/LeaveHisotry";
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";
const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [isDeleted, setIsDeleted] = useState(true);
  const isAdmin = false;

  const fetchLeaves = useCallback(async () => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />;
  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const LeaveStats = [
    { label: "Sick Leave", value: sickCount, icon: ThermometerIcon },
    { label: "Casual Leave", value: casualCount, icon: UmbrellaIcon },
    { label: "Annual Leave", value: annualCount, icon: PalmtreeIcon },
  ];
  return (
    <div className="animate-fade-in">
      {/* header component */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start
      sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="page-title"> Leave Management</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Manage leave applications"
              : "Your leave history and requests"}
          </p>
        </div>
        {!isAdmin && !!isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2
        w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-4 h-4" />
            Apply for Leave
          </button>
        )}
      </div>
      {/* leave card */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {LeaveStats.map((s) => (
            <div
              key={s.label}
              className="card card-hover p-5 sm:p-6 relative gap-4
          overflow-hidden group flex items-center "
            >
              <div
                className="absolute inset-y-0 left-0 w-1 rounded-r-full
              bg-slate-500/70
              group-hover:bg-indigo-500/70"
              />
              <div
                className=" p-3 rounded-lg 
            bg-slate-100 group-hover:bg-indigo-50 transition-colors duration-200"
              >
                <s.icon
                  className="w-5 h-5 text-slate-600 
            group-hover:text-indigo-600 transition-colors duration-200"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {s.value}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    taken
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaves} />
      <ApplyLeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchLeaves}
      />
    </div>
  );
};

export default Leave;
