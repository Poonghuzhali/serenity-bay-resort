import { useState } from "react";

function getMessages() {
  return JSON.parse(localStorage.getItem("resort_messages") || "[]");
}

function saveMessages(msgs) {
  localStorage.setItem("resort_messages", JSON.stringify(msgs));
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

export default function AdminMessages() {
  const [messages, setMessages] = useState(getMessages);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const markRead = (id) => {
    const msgs = getMessages();
    const m = msgs.find((x) => x.id === id);
    if (m) m.status = "read";
    saveMessages(msgs);
    setMessages(msgs);
  };

  const markUnread = (id) => {
    const msgs = getMessages();
    const m = msgs.find((x) => x.id === id);
    if (m) m.status = "unread";
    saveMessages(msgs);
    setMessages(msgs);
  };

  const deleteMsg = (id) => {
    if (!window.confirm("Delete this message?")) return;
    const msgs = getMessages().filter((x) => x.id !== id);
    saveMessages(msgs);
    setMessages(msgs);
  };

  let filtered = messages;
  if (filter === "unread") filtered = messages.filter((m) => m.status === "unread");
  if (filter === "read") filtered = messages.filter((m) => m.status === "read");

  const sorted = [...filtered].reverse();

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Messages {unreadCount > 0 && <span className="text-sm font-normal text-red-500">({unreadCount} unread)</span>}
        </h1>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {["all", "unread", "read"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <span className="text-5xl">📭</span>
          <p className="text-gray-500 mt-4 text-lg">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${msg.status === "unread" ? "border-l-blue-500" : "border-l-gray-300"}`}>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${msg.status === "unread" ? "bg-blue-500" : "bg-gray-400"}`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{msg.name} {msg.status === "unread" && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full ml-2">New</span>}</p>
                      <p className="text-xs text-gray-400">{msg.email} {msg.phone && `| ${msg.phone}`} | {formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {msg.status === "unread" ? (
                      <button onClick={() => markRead(msg.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Mark as read">✓</button>
                    ) : (
                      <button onClick={() => markUnread(msg.id)} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition" title="Mark as unread">○</button>
                    )}
                    <button onClick={() => deleteMsg(msg.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">✕</button>
                  </div>
                </div>
                <div className="mt-2 ml-13">
                  <p className="font-medium text-gray-700">{msg.subject}</p>
                  <p className={`text-gray-600 text-sm mt-1 ${expandedId !== msg.id ? "line-clamp-2" : ""}`}>
                    {msg.message}
                  </p>
                  {msg.message.length > 120 && (
                    <button onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                      className="text-blue-600 text-xs hover:underline mt-1">
                      {expandedId === msg.id ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
