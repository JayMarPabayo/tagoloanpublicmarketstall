import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faStore } from "@fortawesome/free-solid-svg-icons";

import {
  useUpdateStallMutation,
  useDeleteStallMutation,
} from "./stallsApiSlice";

import DeleteConfirmationModal from "../../utils/DeleteConfirmationModal";

const EditStallForm = ({ stall }) => {
  const [updateStall, { isLoading, isSuccess, error }] =
    useUpdateStallMutation();
  const [
    deleteStall,
    { isLoading: isDelLoading, isSuccess: isDelSuccess, error: delerror },
  ] = useDeleteStallMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const [number, setNumber] = useState(stall.number);
  const [validNumber, setValidNumber] = useState(false);

  const [notes, setNotes] = useState(stall.notes);

  const [cost, setCost] = useState(stall.cost);
  const [validCost, setValidCost] = useState(false);

  const [banDeposit, setBanDeposit] = useState(stall.banDeposit);
  const [validBanDeposit, setValidBanDeposit] = useState(false);

  const [touchedNumber, setTouchedNumber] = useState(false);
  const [touchedCost, setTouchedCost] = useState(false);
  const [touchedBanDeposit, setTouchedBanDeposit] = useState(false);

  useEffect(() => {
    setValidNumber(number !== "");
  }, [number]);

  useEffect(() => {
    setValidCost(!isNaN(cost) && cost >= 0);
  }, [cost]);

  useEffect(() => {
    setValidBanDeposit(!isNaN(banDeposit) && banDeposit >= 0);
  }, [banDeposit]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setNumber("");
      setNotes("");
      setCost("");
      setBanDeposit("");
      navigate("/dashboard/sections", {
        state: { selectedSectionGroup: stall.section.group },
      });
    }
  }, [isSuccess, isDelSuccess, navigate, stall.section.group]);

  const onNumberChanged = (e) => {
    setNumber(e.target.value);
    setTouchedNumber(true);
  };

  const onCostChanged = (e) => {
    setCost(e.target.value);
    setTouchedCost(true);
  };

  const onBanDepositChanged = (e) => {
    setBanDeposit(e.target.value);
    setTouchedBanDeposit(true);
  };

  const onNotesChanged = (e) => {
    setNotes(e.target.value);
  };

  const onUpdateStallClicked = async () => {
    setTouchedNumber(true);
    setTouchedCost(true);
    setTouchedBanDeposit(true);
    await updateStall({
      id: stall.id,
      number,
      cost,
      banDeposit,
      notes,
    });
  };

  const onDeleteStallClicked = async () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    console.log(stall.id);
    await deleteStall({ id: stall.id });
  };
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  let canSave;

  canSave =
    [validNumber, validCost, validBanDeposit].every(Boolean) && !isLoading;

  const errMessage = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <div className="px-5">
        <form
          className="w-[40rem] form-input bg-white/20 shadow-md rounded-md p-6"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-x-3 text-lg mb-7">
            <FontAwesomeIcon icon={faStore} />
            <h3 className="text-sky-800 font-medium">Update Stall</h3>
            <span className="error ms-auto">{errMessage ?? errMessage}</span>
          </div>
          <section className="grid grid-cols-5 items-center gap-y-4 mb-10">
            <label htmlFor="number">Number</label>
            <input
              type="text"
              name="number"
              placeholder="Store Number"
              value={number}
              onChange={onNumberChanged}
              className={
                !validNumber && touchedNumber ? "border border-red-500" : ""
              }
            />

            <label htmlFor="cost">
              Cost
              <span className="ms-2 text-xs font-medium opacity-60">
                Daily Rent
              </span>
            </label>
            <input
              type="number"
              name="cost"
              placeholder="Daily Rent Price"
              value={cost}
              className={
                !validCost && touchedCost ? "border border-red-500" : ""
              }
              onChange={onCostChanged}
            />

            <label htmlFor="banDeposit">Ban Deposit</label>
            <input
              type="number"
              name="banDeposit"
              placeholder="Ban Deposit Amount"
              value={banDeposit}
              className={
                !validBanDeposit && touchedBanDeposit
                  ? "border border-red-500"
                  : ""
              }
              onChange={onBanDepositChanged}
            />

            <label htmlFor="notes">Notes</label>
            <textarea
              name="notes"
              placeholder="Notes (Optional)"
              value={notes}
              onChange={onNotesChanged}
            >
              {notes}
            </textarea>
          </section>

          <div className="flex items-center gap-x-5 justify-end">
            <button
              title="Delete"
              className="btn-secondary w-60"
              onClick={onDeleteStallClicked}
            >
              {isDelLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Delete</span>
            </button>
            <button
              title="Save"
              className="btn-primary w-60"
              disabled={!canSave}
              onClick={onUpdateStallClicked}
            >
              {isLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Update</span>
            </button>
          </div>
        </form>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );

  return content;
};

export default EditStallForm;
