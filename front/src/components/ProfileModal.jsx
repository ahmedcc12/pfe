import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";

export default function ProfileModal({ onClose, user, isOpen }) {


  if (!user) {
    return null;
  }


  const sendResetPasswordEmail = async (email) => {
    try {
      Swal.fire({
        title: "Sending email...",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      Swal.showLoading();

      await axios.post('/auth/forgotpassword', { email });
      Swal.fire({
        title: "Email sent",
        text: "Please check your email to reset your password",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      console.error("error ", err);
      Swal.fire({
        title: "Error",
        text: "An error occurred",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-70 ${isOpen ? "" : "hidden"
        }`}
    >
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>

        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Matricule</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.matricule}</dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.firstname}</dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.lastname}</dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.email}</dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.department}</dd>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Group</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user?.group?.name}</dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
              <dt className="">     <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button></dt>
              <dd className="sm:col-span-2"><button
                onClick={() => sendResetPasswordEmail(user.email)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset Password
              </button></dd>
            </div>

          </dl>
        </div>
      </div>

    </div>
  );
}
