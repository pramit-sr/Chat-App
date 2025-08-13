import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, LogOut, User, Settings } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  if (!authUser) return null;

  return (
    <nav className="navbar bg-base-100 border-b border-base-300">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <MessageSquare className="size-6" />
          ChatApp
        </Link>
      </div>
      
      <div className="navbar-center">
        {/* Add search or other center content here */}
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {authUser.profilePic ? (
                <img alt="Profile" src={authUser.profilePic} />
              ) : (
                <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="size-5" />
                </div>
              )}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="size-4" />
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                <LogOut className="size-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
