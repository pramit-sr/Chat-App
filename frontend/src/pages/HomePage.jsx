import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { MessageSquare, Send, Image as ImageIcon, User } from "lucide-react";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/v1/message/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/v1/message/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axiosInstance.post(`/v1/message/${selectedUser._id}`, {
        text: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-base-300 bg-base-200">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-base-300 cursor-pointer hover:bg-base-100 transition-colors ${
                selectedUser?._id === user._id ? "bg-base-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                      <User className="size-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{user.fullName}</h3>
                  <p className="text-sm text-base-content/60">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt={selectedUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                      <User className="size-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-sm text-base-content/60">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === authUser._id
                          ? "bg-primary text-primary-content"
                          : "bg-base-200"
                      }`}
                    >
                      <p>{message.text}</p>
                      {message.image && (
                        <img src={message.image} alt="Message" className="mt-2 rounded max-w-full" />
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-base-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input input-bordered flex-1"
                />
                <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="size-16 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-base-content/60">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
