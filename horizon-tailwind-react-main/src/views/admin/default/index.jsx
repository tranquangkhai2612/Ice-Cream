import React, { useEffect, useState } from "react";
import userServices from "./userService.jsx";
import Swal from "sweetalert2";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userServices.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId, isBlocked) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${isBlocked ? "unblock" : "block"} this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Yes, unblock!" : "Yes, block!",
    });

    if (confirmed.isConfirmed) {
      try {
        const message = await userServices.blockUser(userId);
        Swal.fire("Success!", message, "success");

        // Update UI
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, block: isBlocked ? "false" : "true" } : user
          )
        );
      } catch (err) {
        Swal.fire("Error!", err.message, "error");
      }
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <h2 className="text-2xl font-bold text-center mb-4">User List</h2>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
              <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                <tr>
                <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Block</th>
                  <th className="px-6 py-4">Subscription ID</th>
                  <th className="px-6 py-4">Subscription Start</th>
                  <th className="px-6 py-4">Subscription End</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{user.username}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.address}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handleBlock(user.id, user.block === "true")}
                          className={`px-4 py-2 text-white rounded ${user.block === "true" ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"
                            }`}
                        >
                          {user.block === "true" ? "Unblock" : "Block"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{user.subscriptionId || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.subcriptionStart || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.subcriptionEnd || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="whitespace-nowrap px-6 py-4 text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`mx-1 px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
