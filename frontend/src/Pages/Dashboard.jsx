import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import AccountsManagement from "../Components/accountsManagement";
import Overview from "../Components/Overview";
import { MdDashboard } from "react-icons/md";
import { MdSupervisorAccount } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { IoMdTime } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAssistantPhoto } from "react-icons/md";
import { MdAssistant } from "react-icons/md";
import { FcLeave } from "react-icons/fc";
import { FaRegMoneyBillAlt } from "react-icons/fa";

import AdminData from "../Components/AdminData";
import HrData from "../Components/HrData";
import axios from "axios";
import Logo from "../../assets/Nodado.jfif";
import { CiDatabase } from "react-icons/ci";
import PayrollSystem from "./PayrollSystem";
import TimeAndAttendance from "./TimeAndAttendance";
import EmployeeAssistantProgram from "./EmployeeAssistantProgram";
import EmployeeEngagement from "./EmployeeEngagement";
import Employee from "./Employee";
import Leave from "./Leave";
import Salary from "./Salary";
import { PiPlantDuotone } from "react-icons/pi";

function AdminPage() {
  const [isToggled, setIsToggled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [profile, setProfile] = useState("");
  const urlAPI = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSideNav = () => {
    setIsToggled(!isToggled);
  };

  const handleLogout = async () => {
    await axios.post(
      `${urlAPI}/auth-api/logout`,
      { username: profile.username },
      {
        withCredentials: true,
      }
    );
    navigate("/");
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(`${urlAPI}/auth-api/protected`, {
          withCredentials: true,
        });

        if (response) {
          setProfile(response.data);
          setIsVerifying(false);
        }
      } catch (error) {
        console.log(error.response);
        toast.error("You are not authorized to view this page", {
          position: "top-right",
        });
        handleLogout();
      }
    };

    verify();
  }, []);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex">
        {/* Sidebar */}
        <div
          className={`sidebar transition-all duration-300 ${
            isToggled ? "w-6/12 md:w-3/12 sm:w-3/12 lg:w-3/12 xl:w-2/12" : "w-0"
          } overflow-auto`}
        >
          <div className="flex flex-col justify-center my-4">
            <div className="flex flex-col items-center">
              <img src={Logo} className="h-[150px] w-[150px] mt-10" />
              <h1 className="font-semibold text-md mt-3 text-center">
                Nodado General Hospital
              </h1>
            </div>

            <ul className="menu menu-vertical mt-10">
              <li className="border-b border-gray-300 font-semibold">
                <NavLink to="/Dashboard/overview" activeClassName="bg-gray-700">
                  <MdDashboard />
                  DASHBOARD
                </NavLink>
              </li>
              <ul className="menu menu-vertical">
                <li className="font-semibold">
                  <NavLink to="payrollSystem" activeClassName="bg-gray-700">
                    <PiPlantDuotone />
                    Payroll System
                  </NavLink>
                </li>
                <li className="font-semibold">
                  <NavLink to="timeAndAttendance" activeClassName="bg-gray-700">
                    <IoMdTime />
                    Time And Attendance
                  </NavLink>
                </li>
                <li className="font-semibold">
                  <NavLink to="employee" activeClassName="bg-gray-700">
                    <CgProfile />
                    Employee
                  </NavLink>
                </li>
                <li className="font-semibold">
                  <NavLink
                    to="employeeAssistantProgram"
                    activeClassName="bg-gray-700"
                  >
                    <MdOutlineAssistantPhoto />
                    Employee Assistant Program
                  </NavLink>
                </li>
                <li className="font-semibold">
                  <NavLink
                    to="employeeEngagement"
                    activeClassName="bg-gray-700"
                  >
                    <MdAssistant />
                    Employee Engagement
                  </NavLink>
                </li>
                {/* <li className="font-semibold">
                  <NavLink to="leave" activeClassName="bg-gray-700">
                    <FcLeave className="text-black"/>
                    Leave
                  </NavLink>
                </li>
                <li className="font-semibold">
                  <NavLink to="salary" activeClassName="bg-gray-700">
                    <FaRegMoneyBillAlt  />
                    Salary
                  </NavLink>
                </li> */}

                <li className="font-semibold">
                  <NavLink
                    to="accountsManagement"
                    activeClassName="bg-gray-700"
                  >
                    <MdSupervisorAccount />
                    USER MANAGEMENT
                  </NavLink>
                </li>
              </ul>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div
          className={`flex-grow transition-all duration-300 bg-gray-200 ${
            isToggled ? "w-6/12 lg:w-2/12 md:w-8/12 sm:w-8/12" : "w-full"
          } overflow-auto`}
        >
          <div className="mx-2 my-1">
            {/* NAVBAR */}
            <div className="navbar bg-base-100 rounded-xl">
              <div className="navbar-start">
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={handleSideNav}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
              </div>
              <div className="navbar-center">
                <a className="btn btn-ghost text-xl">
                  BACKUP AND RECOVERY SYSTEM
                </a>
              </div>
              <div className="navbar-end">
                <h1
                  className="text-red-500 font-bold text-3xl mr-4"
                  onClick={handleLogout}
                >
                  <IoIosLogOut />
                </h1>
              </div>
            </div>
            {/* DATA */}
            <Routes>
              <Route
                path="accountsManagement"
                element={<AccountsManagement />}
              />
              <Route path="/" element={<Navigate to="/Dashboard/overview" />} />
              <Route
                path="overview"
                element={<Overview userData={profile} />}
              />
              <Route
                path="payrollSystem"
                element={<PayrollSystem profile={profile} />}
              />
              <Route
                path="timeAndAttendance"
                element={<TimeAndAttendance profile={profile} />}
              />
              <Route path="employee" element={<Employee profile={profile} />} />
              <Route
                path="employeeAssistantProgram"
                element={<EmployeeAssistantProgram profile={profile} />}
              />
              <Route
                path="employeeEngagement"
                element={<EmployeeEngagement profile={profile} />}
              />
              <Route path="leave" element={<Leave />} />
              <Route path="salary" element={<Salary />} />
              <Route path="hrData" element={<HrData />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
