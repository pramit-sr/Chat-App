import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Calendar } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-base-100 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            {authUser.profilePic ? (
              <img 
                src={authUser.profilePic} 
                alt={authUser.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                <User className="size-16" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold">{authUser.fullName}</h1>
          <p className="text-base-content/60">Chat App User</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
            <Mail className="size-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-base-content/60">{authUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
            <Calendar className="size-5 text-primary" />
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-base-content/60">
                {new Date(authUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
            <User className="size-5 text-primary" />
            <div>
              <p className="font-medium">User ID</p>
              <p className="text-base-content/60 font-mono text-sm">{authUser._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
