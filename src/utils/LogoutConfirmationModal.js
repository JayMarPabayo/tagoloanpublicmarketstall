import React from "react";

const LogoutConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-base mb-5">Are you sure you want to Logout?</h3>
        <div className="flex justify-end gap-4">
          <button
            className="btn-secondary w-32 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary w-32 py-2 rounded-md"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
