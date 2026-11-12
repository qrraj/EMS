import { ShieldIcon, UserIcon, ArrowRightIcon } from "lucide-react";
import LoginLeftside from "../components/LoginLeftside";
import { Link } from "react-router-dom";
const LoginLanding = () => {
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portals",
      description:
        "Access the admin portal to manage users, settings, and system configurations.",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portals",
      description:
        "Access the employee portal to view your profile, attendance, and other work-related information.",
      icon: UserIcon,
    },
  ];
  return (
    <div className="min-h-screen flex flex-row md:flex-row">
      <LoginLeftside />
      <div
        className="w-full md:w-1/2 flex flex-col items-center
        justify-center p-6 sm:pd-12 lg:p-16 relative overflow-y-auto min-h-screen
      "
      >
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/*Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">
              Welcome Back
            </h2>
            <p>Select your portal to securely access the system</p>
          </div>
          {/*Portals list */}
          <div className="space-y-4">
            {portalOptions.map((portal) => (
              <Link
                key={portal.to}
                to={portal.to}
                className="group block bg-slate-50 border border-slate-200 rounded-lg 
                p-5 sm:p-6 transition-all duration-300  hover:bg-indigo-50 hover:border-indigo-500"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-5">
                  <h3 className="text-lg text-slate-800 group-hover:text-indigo-600 mb-1">
                    {portal.title}
                  </h3>
                  <ArrowRightIcon
                    className="w-4 h-4 text-slate-400 
                  group-hover:text-indigo-600 group-hover:translate-x-1 
                  transition-all duration-300"
                  />
                </div>
              </Link>
            ))}
          </div>
          {/* list */}
          <div className="mt-12 text-center md:text-left text-sm text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} GreatStacks. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;
