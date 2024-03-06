import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";

export default function ProfileModal({ onClose }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await axiosPrivate.get(`/users/${auth.matricule}`);
        Swal.fire({
          title: "User Details",
          html: `
          <div class="mb-4">
            <p><strong>Matricule:</strong> ${user.matricule}</p>
            <p><strong>First Name:</strong> ${user.firstname}</p>
            <p><strong>Last Name:</strong> ${user.lastname}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Department:</strong> ${user.department}</p>
          </div>
          <button id="resetPasswordBtn" class="swal2-confirm swal2-styled mt-4">Reset Password</button>
        `,
          didOpen: () => {
            const resetPasswordBtn = document.getElementById("resetPasswordBtn");
            resetPasswordBtn.addEventListener("click", () => {
              Swal.fire({
                title: "Reset Password",
                text: "Are you sure you want to reset the password?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, reset it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  sendResetPasswordEmail(user.email);
                }
              });
            });
          },
        });
      } catch (err) {
        console.error("error ",err);
      }
    };
  
    fetchData();
  }, [auth.matricule, axiosPrivate]);

  
  const sendResetPasswordEmail = async (email) => {
    try {
      await axios.post('/auth/forgotpassword', { email });
      Swal.fire({
        title: "Email sent",
        text: "Please check your email to reset your password",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      console.error("error ",err);
      Swal.fire({
        title: "Error",
        text: "An error occurred",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  useEffect(() => {
    return () => {
      onClose(); // Close the modal when unmounting the component
    };
  }, [onClose]);

  return <></>;
}
