import { Link } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../../components/Navbar";

function AdminDashboard() {
  // Get logged-in administrator information
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Admin dashboard sections
  const dashboardItems = [
    {
      title: "Manage Users",
      description: "View and manage tourists and local guides.",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Approve Experiences",
      description: "Review experiences submitted by local guides.",
      icon: ClipboardCheck,
      link: "/admin/approve-experiences",
    },
    {
      title: "Manage Experiences",
      description: "View and manage experiences on LocalXplore.",
      icon: MapPin,
      link: "/admin/experiences",
    },
    {
      title: "Platform Overview",
      description: "Monitor platform activity and administration.",
      icon: ShieldCheck,
      link: "/admin/overview",
    },
  ];

 return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Dashboard Heading */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-3">
            Welcome back, {user?.full_name || "Admin"}!
          </p>

          <p className="text-gray-500 mt-2">
            Manage and monitor the LocalXplore platform.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {dashboardItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-300"
              >
                {/* Card Icon */}
                <div className="bg-green-100 text-green-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>

                {/* Card Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>

                {/* Card Description */}
                <p className="text-gray-600 mb-5">
                  {item.description}
                </p>

                {/* Card Link */}
                <Link
                  to={item.link}
                  className="text-green-700 font-medium hover:text-green-800"
                >
                  View Details →
                </Link>
              </div>
            );
          })}

                </div>
      </div>
    </div>
  </>
  );
}

export default AdminDashboard;