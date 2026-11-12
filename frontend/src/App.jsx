import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========================================
// PUBLIC PAGES
// ========================================

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ExploreNearMe from "./pages/ExploreNearMe";
import ExperienceDetails from "./pages/ExperienceDetails";
import Booking from "./pages/Booking";

// ========================================
// AUTHENTICATION PAGES
// ========================================

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

// ========================================
// PROTECTED ROUTE COMPONENT
// ========================================

import ProtectedRoute from "./components/ProtectedRoute";

// ========================================
// TOURIST PAGES
// ========================================

import TouristDashboard from "./pages/Tourist/TouristDashboard";
import MyBookings from "./pages/Tourist/MyBookings";
import MyFavorites from "./pages/Tourist/MyFavorites";
import MyReviews from "./pages/Tourist/MyReviews";
import TouristProfile from "./pages/Tourist/TouristProfile";
import MyItineraries from "./pages/Tourist/MyItineraries";
import ItineraryDetails from "./pages/Tourist/ItineraryDetails";

// ========================================
// GUIDE PAGES
// ========================================

import GuideDashboard from "./pages/Guide/GuideDashboard";
import CreateExperience from "./pages/Guide/CreateExperience";
import MyExperiences from "./pages/Guide/MyExperiences";
import EditExperience from "./pages/Guide/EditExperience";
import GuideBookings from "./pages/Guide/GuideBookings";
import GuideProfile from "./pages/Guide/GuideProfile";

// ========================================
// ADMIN PAGES
// ========================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ApproveExperiences from "./pages/Admin/ApproveExperiences";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageExperiences from "./pages/Admin/ManageExperiences";
import PlatformOverview from "./pages/Admin/PlatformOverview";

// ========================================
// STYLES
// ========================================

import "./App.css";

// ========================================
// MAIN APP COMPONENT
// ========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            PUBLIC ROUTES
        ======================================== */}

        {/* Homepage */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Explore Experiences */}
        <Route
          path="/explore"
          element={<Explore />}
        />

        {/* Explore Near Me */}
        <Route
          path="/explore-near-me"
          element={<ExploreNearMe />}
        />

        {/* Experience Details */}
        <Route
          path="/experience/:id"
          element={<ExperienceDetails />}
        />

        {/* Booking Page */}
        <Route
          path="/booking/:id"
          element={<Booking />}
        />

        {/* ========================================
            AUTHENTICATION ROUTES
        ======================================== */}

        {/* Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ========================================
            TOURIST ROUTES
            Accessible only by tourists
        ======================================== */}

        {/* Tourist Dashboard */}
        <Route
          path="/tourist/dashboard"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <TouristDashboard />
            </ProtectedRoute>
          }
        />

        {/* Tourist Bookings */}
        <Route
          path="/tourist/bookings"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Tourist Favorites */}
        <Route
          path="/tourist/favorites"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <MyFavorites />
            </ProtectedRoute>
          }
        />

        {/* Tourist Reviews */}
        <Route
          path="/tourist/reviews"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        {/* Tourist Profile */}
        <Route
          path="/tourist/profile"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <TouristProfile />
            </ProtectedRoute>
          }
        />

        {/* My Itineraries */}
        <Route
          path="/tourist/itineraries"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <MyItineraries />
            </ProtectedRoute>
          }
        />

        {/* Itinerary Details */}
        <Route
          path="/tourist/itineraries/:id"
          element={
            <ProtectedRoute allowedRoles={["tourist"]}>
              <ItineraryDetails />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            GUIDE ROUTES
            Accessible only by guides
        ======================================== */}

        {/* Guide Dashboard */}
        <Route
          path="/guide/dashboard"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <GuideDashboard />
            </ProtectedRoute>
          }
        />

        {/* Create Experience */}
        <Route
          path="/guide/create-experience"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <CreateExperience />
            </ProtectedRoute>
          }
        />

        {/* My Experiences */}
        <Route
          path="/guide/my-experiences"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <MyExperiences />
            </ProtectedRoute>
          }
        />

        {/* Edit Experience */}
        <Route
          path="/guide/edit-experience/:id"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <EditExperience />
            </ProtectedRoute>
          }
        />

        {/* Guide Bookings */}
        <Route
          path="/guide/bookings"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <GuideBookings />
            </ProtectedRoute>
          }
        />

        {/* Guide Profile */}
        <Route
          path="/guide/profile"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <GuideProfile />
            </ProtectedRoute>
          }
        />

        {/* ========================================
            ADMIN ROUTES
            Accessible only by admins
        ======================================== */}

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Approve Experiences */}
        <Route
          path="/admin/approve-experiences"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ApproveExperiences />
            </ProtectedRoute>
          }
        />

        {/* Manage Users */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Manage Experiences */}
        <Route
          path="/admin/experiences"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageExperiences />
            </ProtectedRoute>
          }
        />

        {/* Platform Overview */}
        <Route
          path="/admin/overview"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PlatformOverview />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;