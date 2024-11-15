import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useCompensateBanDepositMutation } from "../rentals/rentalsApiSlice";

const CompensateBan = ({ onCancel, amount, id, cost }) => {
  const { id: userId } = useAuth();

  const [compensateBanDeposit, { isLoading, isSuccess, error }] =
    useCompensateBanDepositMutation();

  useEffect(() => {
    if (isSuccess) {
      onCancel();
    }
  }, [isSuccess, onCancel]);

  const onCompensateClicked = async (e) => {
    await compensateBanDeposit({
      id,
      amount,
      user: userId,
      cost,
    });
  };

  const errMessage = error?.data?.message ?? "";

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-base mb-2">
          Are you sure you want to use the deposit to pay for the due rent?
        </h3>
        <p className="text-gray-600 mb-8 text-xs">
          This action cannot be undone, and the deposit amount paid will be
          reduced.
        </p>
        <div className="flex items-center gap-x-2 mb-5">
          <p className="text-gray-600 text-sm">Balance:</p>
          <p className="text-lg">₱ {amount}</p>
        </div>
        <p className="error mb-5">{errMessage}</p>

        <div className="flex justify-end gap-4">
          <button
            className="btn-secondary py-2 rounded-md w-40"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary py-2 rounded-md w-40"
            onClick={onCompensateClicked}
          >
            {isLoading && (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompensateBan;
