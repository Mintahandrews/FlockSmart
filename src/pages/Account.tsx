import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  CircleCheck,
  CircleUser,
  CreditCard,
  LogOut,
  Mail,
  Pencil,
  User,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../utils/premium";
import { formatDate } from "../utils";

const AccountPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUser({ name });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getUserSubscriptionPlan = () => {
    return (
      SUBSCRIPTION_PLANS.find((plan) => plan.tier === user.subscription) || {
        name: "Free Plan",
        price: 0,
        interval: "forever",
      }
    );
  };

  const currentPlan = getUserSubscriptionPlan();

  return (
    <div className="w-full min-h-full py-6">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-4 w-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    value={user.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center pb-4 border-b border-gray-100">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium">{user.name}</div>
                  </div>
                </div>
                <div className="flex items-center pb-4 border-b border-gray-100">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <CircleUser className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Account Created</div>
                    <div className="font-medium">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{currentPlan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentPlan.price > 0
                      ? `$${currentPlan.price}/${currentPlan.interval}`
                      : "Free"}
                  </p>

                  {user.subscription !== "free" && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center text-green-600">
                        <CircleCheck className="h-4 w-4 mr-1" />
                        Active
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                  {user.subscription === "free"
                    ? "Upgrade Plan"
                    : "Manage Subscription"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
