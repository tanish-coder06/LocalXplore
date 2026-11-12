import { Link } from "react-router-dom";
import {
  CalendarDays,
  Heart,
  Star,
  User,
  Map,
} from "lucide-react";

import Navbar from "../../components/Navbar";

function TouristDashboard() {
  // Read the logged-in user's information
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Dashboard sections
  const dashboardItems = [
    {
      title: "My Bookings",
      description: "View and manage your experience bookings.",
      icon: CalendarDays,
      link: "/tourist/bookings",
    },
    {
      title: "My Favorites",
      description: "Explore your saved experiences.",
      icon: Heart,
      link: "/tourist/favorites",
    },
    {
      title: "My Reviews",
      description: "View reviews you have written.",
      icon: Star,
      link: "/tourist/reviews",
    },
    {
      title: "My Itineraries",
      description:
        "Create travel plans and organize experiences for each day of your trip.",
      icon: Map,
      link: "/tourist/itineraries",
    },
    {
      title: "My Profile",
      description: "View and manage your account information.",
      icon: User,
      link: "/tourist/profile",
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
              Tourist Dashboard
            </h1>

            <p className="text-gray-600 mt-3">
              Welcome back, {user?.full_name || "Tourist"}!
            </p>

            <p className="text-gray-500 mt-2">
              Manage your LocalXplore travel experiences.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {dashboardItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.link}
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

export default TouristDashboard;