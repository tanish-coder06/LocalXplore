// Import React hooks
import { useEffect, useState } from "react";

// Import React Router navigation
import { useNavigate } from "react-router-dom";

// Import existing Navbar
import Navbar from "../../components/Navbar";

// Import existing Axios API configuration
import api from "../../services/api";

function ManageUsers() {

    // Used to navigate back to Admin Dashboard
    const navigate = useNavigate();

    // Store registered users
    const [users, setUsers] = useState([]);
    // Store the text entered in the search box
    const [searchTerm, setSearchTerm] = useState("");
    // Store the selected role filter
    const [roleFilter, setRoleFilter] = useState("all");

    // Track loading state
    const [loading, setLoading] = useState(true);

    // Store error messages
    const [error, setError] = useState("");

    // Track which account is currently being updated
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [feedback, setFeedback] = useState("");

    // Deactivate or reactivate a tourist/guide account
    const changeUserStatus = async (user) => {
        if (user.role === "admin") return;

        const deactivate = user.status === "active";
        const action = deactivate ? "deactivate" : "reactivate";
        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${user.full_name}?`
        );
        if (!confirmed) return;

        setUpdatingUserId(user.id);
        setError("");
        setFeedback("");
        try {
            const token = localStorage.getItem("token");
            const response = await api.patch(
                `/admin/users/${user.id}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers((previous) => previous.map((item) =>
                item.id === user.id
                    ? { ...item, status: deactivate ? "inactive" : "active" }
                    : item
            ));
            setFeedback(response.data.message || `Account ${action}d successfully.`);
        } catch (err) {
            console.error("Update User Status Error:", err);
            setFeedback(err.response?.data?.message || "Failed to update account status.");
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Fetch users when the page loads
    useEffect(() => {

        const fetchUsers = async () => {

            try {

                // Retrieve admin authentication token
                const token = localStorage.getItem("token");

                // Request registered users from backend
                const response = await api.get(
                    "/admin/users",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Save retrieved users in React state
                setUsers(response.data.users || []);

            } catch (err) {

                console.error("Fetch Users Error:", err);

                // Display backend error if available
                setError(
                    err.response?.data?.message ||
                    "Failed to load registered users."
                );

            } finally {

                // Stop displaying loading message
                setLoading(false);

            }
        };

        fetchUsers();

    }, []);
    // Filter users based on their name or email address
    // Filter users based on search text and selected role
    const filteredUsers = users.filter((user) => {

        // Convert search text to lowercase
        const search = searchTerm.toLowerCase().trim();

        // Check whether the name matches
        const matchesName = (user.full_name || "")
            .toLowerCase()
            .includes(search);

        // Check whether the email matches
        const matchesEmail = (user.email || "")
            .toLowerCase()
            .includes(search);

        // Match users by name or email
        const matchesSearch = matchesName || matchesEmail;

        // Check whether the user's role matches the selected filter
        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;

        // Display users only when both conditions are satisfied
        return matchesSearch && matchesRole;
    });
    // Calculate the total number of registered users
    const totalUsers = users.length;

    // Count registered tourists
    const totalTourists = users.filter(
        (user) => user.role === "tourist"
    ).length;

    // Count registered guides
    const totalGuides = users.filter(
        (user) => user.role === "guide"
    ).length;

    // Count administrators
    const totalAdmins = users.filter(
        (user) => user.role === "admin"
    ).length;
    return (
        <>
            {/* Existing navigation bar */}
            <Navbar />

            {/* Main page background */}
            <div className="min-h-screen bg-gray-50 px-6 py-12">

                <div className="max-w-6xl mx-auto">

                    {/* Page Heading */}
                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-green-800">
                            Manage Users
                        </h1>

                        <p className="text-gray-600 mt-2">
                            View registered tourists, guides, and administrators.
                        </p>

                    </div>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-green-700 font-medium mb-8 hover:underline"
                    >
                        ← Back to Admin Dashboard
                    </button>

                    {/* Loading Message */}
                    {loading && (
                        <p className="text-gray-600">
                            Loading registered users...
                        </p>
                    )}

                    {/* Error Message */}
                    {!loading && error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {feedback && (
                        <div role="status" className="mb-5 rounded-lg border border-gray-200 bg-white p-4 text-gray-700">
                            {feedback}
                        </div>
                    )}

                    {/* User List */}
                    {!loading && !error && (
                        <>

                            {/* Total Users Card */}
                            {/* User Statistics Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                                {/* Total Users */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <p className="text-gray-600 font-medium">
                                        👥 Total Users
                                    </p>

                                    <h2 className="text-3xl font-bold text-green-800 mt-3">
                                        {totalUsers}
                                    </h2>
                                </div>

                                {/* Total Tourists */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <p className="text-gray-600 font-medium">
                                        🧳 Tourists
                                    </p>

                                    <h2 className="text-3xl font-bold text-blue-700 mt-3">
                                        {totalTourists}
                                    </h2>
                                </div>

                                {/* Total Guides */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <p className="text-gray-600 font-medium">
                                        🗺️ Guides
                                    </p>

                                    <h2 className="text-3xl font-bold text-orange-600 mt-3">
                                        {totalGuides}
                                    </h2>
                                </div>

                                {/* Total Admins */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <p className="text-gray-600 font-medium">
                                        🛡️ Admins
                                    </p>

                                    <h2 className="text-3xl font-bold text-purple-700 mt-3">
                                        {totalAdmins}
                                    </h2>
                                </div>

                            </div>
                            {/* Search Users */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">

                                <label
                                    htmlFor="userSearch"
                                    className="block text-gray-700 font-medium mb-3"
                                >
                                    Search Registered Users
                                </label>

                                <input
                                    id="userSearch"
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />

                            </div>
                            {/* Role Filter */}
                            <div className="mt-5">

                                <label
                                    htmlFor="roleFilter"
                                    className="block text-gray-700 font-medium mb-3"
                                >
                                    Filter by Role
                                </label>

                                <select
                                    id="roleFilter"
                                    value={roleFilter}
                                    onChange={(event) => setRoleFilter(event.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="all">All Users</option>
                                    <option value="tourist">Tourists</option>
                                    <option value="guide">Guides</option>
                                    <option value="admin">Admins</option>
                                </select>

                            </div>
                            {/* Search Results Count */}
                            <p className="text-gray-600 mb-4">
                                Showing {filteredUsers.length} of {users.length} registered users
                            </p>

                            {/* Empty State */}
                            {filteredUsers.length === 0 ? (

                                <div className="bg-white rounded-xl p-10 text-center shadow-sm">

                                    <h2 className="text-xl font-semibold text-gray-800">
                                        No Registered Users
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        No user accounts were found.
                                    </p>

                                </div>

                            ) : (

                                /* Users Table */
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

                                    <table className="w-full text-left">

                                        {/* Table Heading */}
                                        <thead className="bg-green-50 text-green-800">

                                            <tr>
                                                <th className="px-6 py-4">
                                                    Name
                                                </th>

                                                <th className="px-6 py-4">
                                                    Email
                                                </th>

                                                <th className="px-6 py-4">
                                                    Phone
                                                </th>

                                                <th className="px-6 py-4">
                                                    Role
                                                </th>

                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Joined</th>
                                                <th className="px-6 py-4">Actions</th>
                                            </tr>

                                        </thead>

                                        {/* Table Body */}
                                        <tbody>

                                            {filteredUsers.map((user) => (

                                                <tr
                                                    key={user.id}
                                                    className="border-t border-gray-100 hover:bg-gray-50"
                                                >

                                                    {/* Full Name */}
                                                    <td className="px-6 py-4 font-medium text-gray-800">
                                                        {user.full_name}
                                                    </td>

                                                    {/* Email */}
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.email}
                                                    </td>

                                                    {/* Phone */}
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.phone || "Not provided"}
                                                    </td>

                                                    {/* User Role */}
                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : user.role === "guide"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-green-100 text-green-800"
                                                                }`}
                                                        >
                                                            {user.role}
                                                        </span>

                                                    </td>

                                                    {/* Account status */}
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            user.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : user.status === "inactive"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                            {user.status === "active" ? "Active" : user.status === "inactive" ? "Inactive" : "Unknown"}
                                                        </span>
                                                    </td>

                                                    {/* Registration Date */}
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleDateString("en-IN")
                                                            : "Unknown"}
                                                    </td>

                                                    {/* Admin accounts cannot be changed */}
                                                    <td className="px-6 py-4">
                                                        {user.role === "admin" ? (
                                                            <span className="text-sm text-gray-400">Protected</span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                disabled={updatingUserId !== null || !["active", "inactive"].includes(user.status)}
                                                                onClick={() => changeUserStatus(user)}
                                                                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
                                                                    user.status === "active"
                                                                        ? "bg-red-600 hover:bg-red-700"
                                                                        : "bg-green-700 hover:bg-green-800"
                                                                }`}
                                                            >
                                                                {updatingUserId === user.id
                                                                    ? "Updating..."
                                                                    : user.status === "active" ? "Deactivate" : "Reactivate"}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </>
                    )}

                </div>

            </div>
        </>
    );
}

export default ManageUsers;