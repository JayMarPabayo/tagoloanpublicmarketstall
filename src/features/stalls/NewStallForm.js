import { useState, useEffect } from "react";
import { useAddNewSectionMutation } from "./sectionsApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonShelter, faSpinner } from "@fortawesome/free-solid-svg-icons";

import SelectSectionGroup from "../../utils/SelectSectionGroup";

const NewStallForm = ({ onCancel }) => {
  const [addNewSection, { isLoading, isSuccess, error }] =
    useAddNewSectionMutation();

  const [group, setGroup] = useState("");
  const [validGroup, setValidGroup] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);

  const [stallsPerRow, setStallsPerRow] = useState(0);
  const [validStallsPerRow, setValidStallsPerRow] = useState(false);

  const [numberOfStalls, setNumberOfStalls] = useState(0);
  const [validNumberOfStalls, setValidNumberOfStalls] = useState(false);

  const [cost, setCost] = useState(0);
  const [validCost, setValidCost] = useState(false);

  const [banDeposit, setBanDeposit] = useState(0);
  const [validBanDeposit, setValidBanDeposit] = useState(false);

  const [touchedGroup, setTouchedGroup] = useState(false);
  const [touchedName, setTouchedName] = useState(false);
  const [touchedStallsPerRow, setTouchedStallsPerRow] = useState(false);
  const [touchedNumberOfStalls, setTouchedNumberOfStalls] = useState(false);
  const [touchedCost, setTouchedCost] = useState(false);
  const [touchedBanDeposit, setTouchedBanDeposit] = useState(false);

  useEffect(() => {
    setValidGroup(group !== "");
  }, [group]);

  useEffect(() => {
    setValidName(name !== "");
  }, [name]);

  useEffect(() => {
    setValidStallsPerRow(stallsPerRow !== 0);
  }, [stallsPerRow]);

  useEffect(() => {
    setValidNumberOfStalls(numberOfStalls !== 0);
  }, [numberOfStalls]);

  useEffect(() => {
    setValidCost(!isNaN(cost) && cost >= 0);
  }, [cost]);

  useEffect(() => {
    setValidBanDeposit(!isNaN(banDeposit) && banDeposit >= 0);
  }, [banDeposit]);

  useEffect(() => {
    if (isSuccess) {
      setGroup("");
      setName("");
      setStallsPerRow(0);
      setNumberOfStalls(0);
      setCost(0);
      setBanDeposit(0);
      onCancel();
    }
  }, [isSuccess, onCancel]);

  const onGroupChanged = (e) => {
    setGroup(e.target.value);
    setTouchedGroup(true);
  };

  const onNameChanged = (e) => {
    setName(e.target.value);
    setTouchedName(true);
  };

  const onStallsPerRowChanged = (e) => {
    setStallsPerRow(e.target.value);
    setTouchedStallsPerRow(true);
  };

  const onNumberOfStallsChanged = (e) => {
    setNumberOfStalls(e.target.value);
    setTouchedNumberOfStalls(true);
  };

  const onCostChanged = (e) => {
    setCost(e.target.value);
    setTouchedCost(true);
  };

  const onBanDepositChanged = (e) => {
    setBanDeposit(e.target.value);
    setTouchedBanDeposit(true);
  };

  const canSave =
    [
      validGroup,
      validName,
      validStallsPerRow,
      validNumberOfStalls,
      validCost,
      validBanDeposit,
    ].every(Boolean) && !isLoading;

  const onSaveSectionClicked = async (e) => {
    e.preventDefault();
    setTouchedGroup(true);
    setTouchedName(true);
    setTouchedStallsPerRow(true);
    setTouchedNumberOfStalls(true);
    setTouchedCost(true);
    setTouchedBanDeposit(true);
    if (canSave) {
      await addNewSection({
        group,
        name,
        stallsPerRow,
        numberOfStalls,
        cost,
        banDeposit,
      });
    }
  };

  const content = (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        method="POST"
        onSubmit={onSaveSectionClicked}
        className="form-input min-w-[35rem] bg-white/90 shadow-md rounded-md p-6"
      >
        <div className="flex items-center gap-x-3 text-lg mb-7">
          <FontAwesomeIcon icon={faPersonShelter} />
          <h3 className="text-sky-800 font-medium">Stall Info</h3>
          <span className="error ms-auto">{error?.data?.message}</span>
        </div>
        <section className="grid grid-cols-5 items-center gap-y-4 gap-x-5 mb-10">
          <label htmlFor="group">Group</label>
          <SelectSectionGroup
            valid={validGroup}
            touched={touchedGroup}
            state={group}
            onChange={onGroupChanged}
          />

          <label htmlFor="name">Section</label>
          <input
            type="text"
            name="name"
            placeholder="Section A, Section B, etc."
            value={name}
            onChange={onNameChanged}
            className={!validName && touchedName ? "border border-red-500" : ""}
          />

          <label htmlFor="fullname">Cost per Stall</label>
          <input
            type="number"
            name="cost"
            placeholder="Cost Amount"
            value={cost}
            onChange={onCostChanged}
            className={!validCost && touchedCost ? "border border-red-500" : ""}
          />

          <label htmlFor="fullname">Ban Deposit</label>
          <input
            type="number"
            name="banDeposit"
            placeholder="Ban Deposit Amount"
            value={banDeposit}
            onChange={onBanDepositChanged}
            className={
              !validBanDeposit && touchedBanDeposit
                ? "border border-red-500"
                : ""
            }
          />

          <hr className="col-span-full" />
          <label htmlFor="name">Stalls Each Row</label>
          <input
            type="number"
            name="stallsPerRow"
            placeholder="No. of Rooms/Stalls"
            value={stallsPerRow}
            onChange={onStallsPerRowChanged}
            className={
              !validStallsPerRow && touchedStallsPerRow
                ? "border border-red-500"
                : ""
            }
          />

          <label htmlFor="name">No. of Stalls</label>
          <input
            type="number"
            name="numberOfStalls"
            placeholder="No. of Rooms/Stalls"
            value={numberOfStalls}
            onChange={onNumberOfStallsChanged}
            className={
              !validNumberOfStalls && touchedNumberOfStalls
                ? "border border-red-500"
                : ""
            }
          />
        </section>
        <div className="flex justify-end gap-x-4">
          <button
            type="button"
            className="btn-secondary w-32 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary w-32 py-2 rounded-md">
            {isLoading && (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
  return content;
};

export default NewStallForm;
