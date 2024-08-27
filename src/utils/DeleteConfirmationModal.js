import React from "react";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      {" "}
       
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-base mb-2">
          Are you sure you want to delete this data?
        </h3>
        <p className="text-gray-600 mb-8 text-xs">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="btn-secondary px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
