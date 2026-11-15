import React, { useState } from "react";
import { X, FileText, CalendarDays, Loader2Icon, Send } from "lucide-react";
const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  if (!open) return null;
  return (
    <div
      className="fixed bg-black/50 backdrop-blur-sm inset-0 z-50
        flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* header part */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full
          max-w-lg my-8 animte-fade-in"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Apply for Leave
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Submit your leave request for approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100
              transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* form data */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* leave type */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium
            text-slate-700 mb-2"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Leave Type
            </label>
            <select name="type" required>
              <option value="SICK">Sick leave</option>
              <option value="CASUAL">Causal leave</option>
              <option value="ANNUAL">Annual leave</option>
            </select>
          </div>
          {/* duration type */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium
            text-slate-700 mb-2"
            >
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-400 mb-1">From</span>
                <input type="date" name="startDate" required min={minDate} />
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-1">To</span>
                <input type="date" name="endDate" required min={minDate} />
              </div>
            </div>
          </div>
          {/* reason type */}
          <div>
            <label
              className="text-sm font-medium
            text-slate-700 mb-2 block"
            >
              Reason
            </label>
            <textarea
              name="reason"
              required
              rows={3}
              className="resize-none"
              placeholder="briefly descirbe why yhou need this leave"
            />
          </div>
          {/* buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              type="submit"
              disabled={loading}
              className="btn-primary flex flex-1
        items-center justify-center"
            >
              {loading ? (
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
