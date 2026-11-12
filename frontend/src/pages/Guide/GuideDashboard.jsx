import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  PlusCircle,
  User,
} from "lucide-react";
import Navbar from "../../components/Navbar";

function GuideDashboard() {
  // Get logged-in guide information
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Guide dashboard sections
  const dashboardItems = [
    {
      title: "My Experiences",
      description: "View and manage the experiences you offer.",
      icon: MapPin,
      link: "/guide/my-experiences",
    },
    {
      title: "Create Experience",
      description: "Add a new local experience for tourists.",
      icon: PlusCircle,
      link: "/guide/create-experience",
    },
    {
      title: "Manage Bookings",
      description: "View bookings made by tourists.",
      icon: CalendarDays,
      link: "/guide/bookings",
    },
    {
      title: "My Profile",
      description: "View and manage your guide information.",
      icon: User,
      link: "/guide/profile",
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
            Guide Dashboard
          </h1>

          <p className="text-gray-600 mt-3">
            Welcome back, {user?.full_name || "Guide"}!
          </p>

          <p className="text-gray-500 mt-2">
            Manage your LocalXplore experiences and bookings.
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

export default GuideDashboard;
