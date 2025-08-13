import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Upload, Loader2 } from "lucide-react";

const SettingsPage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!authUser) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!selectedFile) return;

    try {
      await updateProfile(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-base-100 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="border-b border-base-300 pb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : authUser.profilePic ? (
                  <img src={authUser.profilePic} alt={authUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                    <User className="size-12" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
                <p className="text-sm text-base-content/60 mt-2">
                  Choose a new profile picture (JPG, PNG, GIF)
                </p>
              </div>
            </div>

            {selectedFile && (
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className="btn btn-primary mt-4"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Update Profile Picture
                  </>
                )}
              </button>
            )}
          </div>

          {/* Account Information */}
          <div className="border-b border-base-300 pb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  value={authUser.fullName}
                  disabled
                  className="input input-bordered w-full"
                />
                <p className="text-sm text-base-content/60 mt-1">
                  Contact support to change your name
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  value={authUser.email}
                  disabled
                  className="input input-bordered w-full"
                />
                <p className="text-sm text-base-content/60 mt-1">
                  Contact support to change your email
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Show online status</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Allow message requests</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Show last seen</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
