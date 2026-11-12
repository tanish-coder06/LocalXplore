import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Menu, User, X } from "lucide-react";

function Navbar() {
  // ========================================
  // MOBILE MENU STATE
  // ========================================

  const [menuOpen, setMenuOpen] = useState(false);

  // ========================================
  // REACT ROUTER HOOKS
  // ========================================

  const location = useLocation();
  const navigate = useNavigate();

  // ========================================
  // GET LOGGED-IN USER
  // ========================================

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Error reading user information:", error);
    user = null;
  }

  // ========================================
  // DASHBOARD LINKS BASED ON USER ROLE
  // ========================================

  const dashboardLinks = {
    tourist: "/tourist/dashboard",
    guide: "/guide/dashboard",
    admin: "/admin/dashboard",
  };

  const dashboardLink = user
    ? dashboardLinks[user.role]
    : null;

  // ========================================
  // ROLE-BASED NAVIGATION
  // ========================================

  const guestLinks = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/explore" },
    { name: "Explore Near Me", link: "/explore-near-me" },
    { name: "Categories", link: "/#categories" },
    { name: "Become a Guide", link: "/#guides" },
  ];

  const touristLinks = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/explore" },
    { name: "Explore Near Me", link: "/explore-near-me" },
    { name: "Categories", link: "/#categories" },
  ];

  const guideLinks = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/explore" },
    { name: "Explore Near Me", link: "/explore-near-me" },
  ];

  const adminLinks = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/explore" },
  ];

  const navLinks =
    user?.role === "tourist"
      ? touristLinks
      : user?.role === "guide"
      ? guideLinks
      : user?.role === "admin"
      ? adminLinks
      : guestLinks;

  // ========================================
  // CHECK ACTIVE NAVIGATION LINK
  // ========================================

  const isActive = (link) => {
    if (link === "/") {
      return location.pathname === "/";
    }

    if (link.startsWith("/#")) {
      return false;
    }

    return (
      location.pathname === link ||
      location.pathname.startsWith(`${link}/`)
    );
  };

  // ========================================
  // HANDLE NAVIGATION
  // ========================================

  const handleNavClick = (link) => {
    setMenuOpen(false);

    // Scroll to homepage section when needed
    if (link.startsWith("/#")) {
      const sectionId = link.substring(2);

      if (location.pathname === "/") {
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }, 100);
      }
    }
  };

  // ========================================
  // LOGOUT FUNCTION
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/");

    window.location.reload();
  };

  // ========================================
  // LOGO DESTINATION
  // ========================================

  const logoLink =
    user?.role === "guide"
      ? "/guide/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/";

  // ========================================
  // JSX
  // ========================================

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">

      {/* ========================================
          MAIN NAVBAR
      ======================================== */}

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-4 flex items-center justify-between gap-4">

        {/* ========================================
            LOGO
        ======================================== */}

        <Link
          to={logoLink}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="bg-green-700 p-2 rounded-xl">
            <MapPin
              className="text-white"
              size={25}
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-green-800 tracking-tight">
            Local
            <span className="text-orange-500">
              X
            </span>
            plore
          </h1>
        </Link>

        {/* ========================================
            DESKTOP NAVIGATION
        ======================================== */}

        <div className="hidden lg:flex items-center gap-6 text-gray-700 font-medium">

          {navLinks.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              onClick={() => handleNavClick(item.link)}
              className={`relative py-2 whitespace-nowrap transition duration-300 hover:text-green-700 ${
                isActive(item.link)
                  ? "text-green-700 font-semibold"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

        </div>

        {/* ========================================
            DESKTOP AUTHENTICATION
        ======================================== */}

        <div className="hidden lg:flex items-center gap-3">

          {user ? (
            <>

              {/* Logged-In User Name */}
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <User size={20} />

                <span className="max-w-28 truncate">
                  {user.full_name}
                </span>
              </div>

              {/* Dashboard Button */}
              {dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="bg-green-700 text-white px-5 py-2.5 rounded-full hover:bg-green-800 transition duration-300 font-medium whitespace-nowrap"
                >
                  My Dashboard
                </Link>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2.5 rounded-full hover:bg-red-700 shadow-sm hover:shadow-md transition duration-300 font-medium whitespace-nowrap"
              >
                Logout
              </button>

            </>
          ) : (
            <>

              {/* Login Button */}
              <Link
                to="/login"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full hover:border-green-700 hover:text-green-700 transition duration-300"
              >
                <User size={18} />
                Login
              </Link>

              {/* Sign Up Button */}
              <Link
                to="/register"
                className="bg-green-700 text-white px-6 py-2.5 rounded-full hover:bg-green-800 shadow-sm hover:shadow-md transition duration-300 font-medium whitespace-nowrap"
              >
                Sign Up
              </Link>

            </>
          )}

        </div>

        {/* ========================================
            MOBILE MENU BUTTON
        ======================================== */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={27} />
          ) : (
            <Menu size={27} />
          )}
        </button>

      </div>

      {/* ========================================
          MOBILE NAVIGATION
      ======================================== */}

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">

          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-5 flex flex-col gap-4">

            {/* ========================================
                MOBILE NAVIGATION LINKS
            ======================================== */}

            {navLinks.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                onClick={() => handleNavClick(item.link)}
                className={`font-medium hover:text-green-700 py-2 transition ${
                  isActive(item.link)
                    ? "text-green-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* ========================================
                MOBILE AUTHENTICATION
            ======================================== */}

            <div className="flex flex-col gap-3 pt-3 border-t">

              {user ? (
                <>

                  {/* Logged-In User */}
                  <div className="flex items-center gap-2 text-green-800 font-semibold py-2">
                    <User size={18} />

                    <span>
                      {user.full_name}
                    </span>
                  </div>

                  {/* Dashboard Button */}
                  {dashboardLink && (
                    <Link
                      to={dashboardLink}
                      onClick={() => setMenuOpen(false)}
                      className="bg-green-700 text-white py-2.5 px-3 rounded-full hover:bg-green-800 transition text-center"
                    >
                      My Dashboard
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white py-2.5 rounded-full hover:bg-red-700 transition"
                  >
                    Logout
                  </button>

                </>
              ) : (
                <>

                  {/* Mobile Login */}
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="border border-green-700 text-green-700 py-2.5 rounded-full hover:bg-green-50 transition text-center"
                  >
                    Login
                  </Link>

                  {/* Mobile Sign Up */}
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-green-700 text-white py-2.5 rounded-full hover:bg-green-800 transition text-center"
                  >
                    Sign Up
                  </Link>

                </>
              )}

            </div>

          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;