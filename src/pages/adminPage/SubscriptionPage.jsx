import React, { useState } from "react";
import { FiTrash2, FiSend, FiCheck } from "react-icons/fi";

export default function SubscriptionPage({ subscribers, setSubscribers }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleDelete = (id) =>
    setSubscribers(subscribers.filter((s) => s.id !== id));

  const handleSend = () => {
    if (!subject || !message) return;
    setSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subscriber List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f0ef] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-base">Subscribed Users</h3>
          <span className="bg-[#e8f6ea] text-[#01796F] text-xs font-bold px-3 py-1 rounded-full">
            {subscribers.length} total
          </span>
        </div>
        <div className="space-y-3">
          {subscribers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No subscribers yet
            </p>
          ) : (
            subscribers.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f8fffe] border border-[#e8f0ef] hover:border-[#b2d8d5] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">{sub.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Joined {sub.date}</p>
                </div>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Send Announcement */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8f0ef] p-6">
        <h3 className="font-bold text-gray-800 text-base mb-5">
          Send Announcement
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Summer Collection 🌸"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#01796F] focus:ring-1 focus:ring-[#01796F]/20 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Write your announcement here..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#01796F] focus:ring-1 focus:ring-[#01796F]/20 transition resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            className="w-full bg-[#01796F] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#015f57] transition-colors flex items-center justify-center gap-2"
          >
            <FiSend size={14} />
            Send to {subscribers.length} Subscribers
          </button>

          {sent && (
            <div className="flex items-center gap-2 text-[#01796F] bg-[#e8f6ea] px-4 py-2.5 rounded-xl text-sm font-medium">
              <FiCheck size={15} /> Announcement sent successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}