import React from "react";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { TiUserAdd } from "react-icons/ti";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { useSocket } from "../context/socketContext";

function accountsManagement() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [errorRegister, setErrorRegister] = useState("");
  const [errorUpadte, setErrorUpadate] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const urlAPI = import.meta.env.VITE_API_URL;
  const socket = useSocket();

  const columns = [
    { name: "Account ID", selector: (row) => row._id },
    { name: "Username", selector: (row) => row.username },
    { name: "Full Name,", selector: (row) => row.fullName },
    { name: "Email,", selector: (row) => row.email },
    {
      name: "View",
      cell: (row) => (
        <div
          className="flex justify-center text-lg bg-cyan-600 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={() => {
            document.getElementById("view-modal").showModal();
            setSelectedData(row);
          }}
        >
          <FaEye />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "60px",
    },
    {
      name: "Edit",
      cell: (row) => (
        <div
          className="flex justify-center text-lg bg-green-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={() => {
            document.getElementById("edit-user-modal").showModal();
            setSelectedData(row);
          }}
        >
          <FaEdit />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "60px",
    },
    {
      name: "Delete",
      cell: (row) => (
        <div
          className="flex justify-center text-lg bg-red-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={() => {
            document.getElementById("delete-user-modal").showModal();
            setSelectedData(row);
          }}
        >
          <MdDelete />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "60px",
    },
  ];

  // GET USER'S LIST
  useEffect(() => {
    if (!socket) return;

    const getUsers = async () => {
      const result = await axios.get(`${urlAPI}/accounts/get-accounts`);
      setData(result.data);
    };

    getUsers();

    // GET NEW USER
    const getNewUser = async (response) => {
      setData((prevData) => [...prevData, response]);
    };

    // UPDATE USER
    const updateUser = async (response) => {
      setData((prevData) =>
        prevData.map((data) => (data._id === response._id ? response : data))
      );
    };

    // DELETE USER
    const deleteUser = async (response) => {
      setData((prevData) =>
        prevData.filter((data) => data._id !== response._id)
      );
    };

    socket.on("new-user", getNewUser);
    socket.on("update-user", updateUser);
    socket.on("delete-user", deleteUser);

    return () => {
      socket.off("new-user");
      socket.off("update-user");
      socket.off("delete-user");
    };
  }, [socket]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // const filteredData = data.filter(row =>
  //   Object.values(row).some(value =>
  //     value.toString().toLowerCase().includes(searchText.toLowerCase())
  //   )
  // );

  const filteredData = data.filter((row) => {
    if (!row) return false;
    return Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const addUser = await axios.post(`${urlAPI}/auth-api/register`, formData);
      if (addUser.data.success) {
        toast.success(addUser.data.message, {
          position: "top-right",
        });
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
        });
        document.getElementById("add-user-modal").close();
      }
    } catch (err) {
      if (err.response.status === 500) {
        setErrorRegister(err.response.data.error);
      } else if (err.response.status === 400) {
        document.getElementById("add-user-modal").close();
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
        });
        toast.error(err.response.data.message, {
          position: "top-right",
        });
      } else {
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
        });
        document.getElementById("add-user-modal").close();
        toast.error("Server Internal Error", {
          position: "top-right",
        });
      }
    }
  };

  // HANDLE SUBMIT CHANGE
  const handleSubmitChange = async (e) => {
    try {
      e.preventDefault();
      const updateUser = await axios.patch(
        `${urlAPI}/accounts/update-account/${selectedData._id}`,
        selectedData
      );
      if (updateUser.data.success) {
        toast.success(updateUser.data.message, {
          position: "top-right",
        });
        document.getElementById("edit-user-modal").close();
      }
    } catch (err) {
      if (err.response.status === 500) {
        setErrorUpadate(err.response.data.error);
      } else if (err.response.status === 404) {
        document.getElementById("edit-user-modal").close();
        toast.error(err.response.data.message, {
          position: "top-right",
        });
      } else {
        document.getElementById("edit-user-modal").close();
        toast.error("Server Internal Error", {
          position: "top-right",
        });
      }
    }
  };

  // HANDLE DELETE USER
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.delete(
        `${urlAPI}/accounts/delete-account/${selectedData._id}`
      );
      if (result.data.success) {
        toast.success(result.data.message, {
          position: "top-right",
        });
        document.getElementById("delete-user-modal").close();
      }
    } catch (error) {
      if (error.response) {
        document.getElementById("delete-user-modal").close();
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      } else {
        toast.error("Server Internal Error", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <div className="h-screen w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col mt-10">
          <h1 className="font-bold text-md">User Management</h1>

          <div className="mt-10">
            <button
              onClick={() =>
                document.getElementById("add-user-modal").showModal()
              }
              className="btn btn-primary text-md mb-5"
            >
              <TiUserAdd className="text-2xl" />
              Add User
            </button>
          </div>

          <h1 className="mb-2 font-semibold text-md">User's List</h1>

          <div className="bg-white shadow-xl rounded-lg p-2">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              defaultSortField="name"
              highlightOnHover
              pointerOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearch}
                  className="mb-2 p-2 border border-gray-400 rounded-lg mt-5"
                />
              }
            />
          </div>
        </div>
      </div>

      {/* MODAL FOR ADD USER */}
      <dialog id="add-user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-5">Add New User</h3>

          {/* Form to Create a User */}
          <form method="dialog" className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    username: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    fullName: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    password: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {errorRegister && <h1 className="text-red-500">{errorRegister}</h1>}

            <div className="modal-action">
              {/* Save Button */}
              <button type="submit" className="btn btn-success">
                Save
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="btn btn-error"
                onClick={() =>
                  document.getElementById("add-user-modal").close()
                }
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* VIEW MODAL */}
      <dialog id="view-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Account Preview</h3>

          <div className="py-4">
            <p>
              <strong>Account ID:</strong> {selectedData._id}
            </p>
            <p>
              <strong>Username:</strong> {selectedData.username}
            </p>
            <p>
              <strong>Full Name:</strong> {selectedData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedData.email}
            </p>
          </div>

          <div className="modal-action">
            <button
              onClick={() => document.getElementById("view-modal").close()}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* MODAL FOR EDIT USER */}
      <dialog id="edit-user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-5">Edit New User</h3>

          {/* Form to Create a User */}
          <form
            method="dialog"
            className="space-y-4"
            onSubmit={handleSubmitChange}
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Edit Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={selectedData.username}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    username: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Edit Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={selectedData.fullName}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    fullName: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Edit Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={selectedData.email}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Change Password
              </label>
              <h1 className="text-red-400 mb-1 text-sm italic">
                Note: leave this blank if you will not change user's password.
              </h1>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    password: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
              />
            </div>

            {errorUpadte && <h1 className="text-red-500">{errorUpadte}</h1>}

            <div className="modal-action">
              {/* Save Button */}
              <button type="submit" className="btn btn-success">
                Save
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="btn btn-error"
                onClick={() =>
                  document.getElementById("edit-user-modal").close()
                }
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* MODAL FOR DELETE USER */}
      <dialog id="delete-user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-4">Delete User</h3>
          <form
            method="dialog"
            className="space-y-4"
            onSubmit={handleDeleteUser}
          >
            <h3 className="font-semibold text-md mb-5">
              Are you sure you want to delete this user?
            </h3>
            <div className="modal-action">
              {/* Delete Button */}
              <button type="submit" className="btn btn-success">
                Yes
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="btn btn-error"
                onClick={() =>
                  document.getElementById("delete-user-modal").close()
                }
              >
                No
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default accountsManagement;
