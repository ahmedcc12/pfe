import React, { useState, useEffect } from "react";
import logo from "../assets/Sopra_Steria_logo.svg";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import ProfileModal from "./ProfileModal";
import { TailSpin } from "react-loader-spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import NotificationBell from "./NotificationBell";

export function NavbarDefault() {
  const { auth } = useAuth();
  const logout = useLogout();
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("auth", auth);
  }, [auth]);
  const signOut = async () => {
    await logout();
  };


  useEffect(() => {
    if (showModal) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '0';
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);


  const openProfileModal = async () => {
    setModalIsLoading(true);
    try {
      const { data: user } = await axiosPrivate.get(`/users/${auth.matricule}`);
      setModalIsLoading(false);
      openModal(user);
    } catch (err) {
      console.error("error ", err);
      setModalIsLoading(false);
      Swal.fire("Error!", "Failed to load Profile", "error");
    }

  }

  const openModal = (user) => {
    setUser(user);
    console.log("user", user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {!auth.accessToken ? (
        null
      ) : (
        <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
          <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] ">
            <nav className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-white border rounded-none shadow-md h-max border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
              <div className="flex items-center justify-between text-blue-gray-900">
                <Link to="/">
                  <img src={logo} alt="logo" className="h-8 w-32" />
                </Link>
                <div className="flex items-center gap-4">
                  <div className="hidden mr-4 lg:block">
                    {auth.role === "admin" ? (
                      <Link
                        to="/admin"
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        variant="gradient"
                        size="sm"
                      >
                        Admin
                      </Link>
                    ) : null}
                  </div>
                  <button
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    variant="gradient"
                    size="sm"
                    onClick={signOut}
                  >
                    Logout
                  </button>
                  <NotificationBell />
                  <button
                    onClick={() => openProfileModal()}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    variant="text"
                    size="sm"
                  >
                    Profile
                  </button>

                </div>
                <button
                  className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
                  type="button"
                >
                  <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {showModal &&
        <ProfileModal
          isOpen={showModal}
          onClose={closeModal}
          user={user}
        />
      }
      {
        modalIsLoading ? <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <TailSpin color="#3B82F6" height={50} width={50} />
        </div> : null
      }
    </>

  );
}

export default NavbarDefault;
