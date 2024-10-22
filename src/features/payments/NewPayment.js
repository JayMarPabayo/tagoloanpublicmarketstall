import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faUser,
  faLocationDot,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import Spinner from "../../utils/Spinner";
import useAuth from "../../hooks/useAuth";
import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";
import { useAddNewPaymentMutation } from "./paymentsApiSlice";

const NewPayment = ({ onCancel }) => {
  const {
    data: rentals,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRentalsQuery("rentalsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewPayment, { isLoading: isAddLoading, isSuccess: isAddSuccess }] =
    useAddNewPaymentMutation();

  const { id: userId } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const [amount, setAmount] = useState("");
  const [validAmount, setValidAmount] = useState(false);
  const [rental, setRental] = useState("");
  const [cost, setCost] = useState(0);
  const [foundRental, setFoundRental] = useState(null);

  const [touchedAmount, setTouchedAmount] = useState(false);

  useEffect(() => {
    setValidAmount(amount !== "" && amount > 0);
  }, [amount]);

  const onAmountChanged = (e) => {
    setAmount(e.target.value);
    setTouchedAmount(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const { ids, entities } = rentals;
      const firstMatchingRentalId = ids?.find((rentalId) => {
        const rental = entities[rentalId];
        const vendorName = rental.vendor?.name?.toLowerCase() || "";
        const vendorOwner = rental.vendor?.owner?.toLowerCase() || "";
        const sectionGroup = rental.stall?.section?.group.toLowerCase() || "";
        const sectionName = rental.stall?.section?.name.toLowerCase() || "";
        const stallNumber = String(rental.stall?.number || "");

        const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

        return searchWords.every(
          (word) =>
            vendorName.includes(word) ||
            vendorOwner.includes(word) ||
            sectionGroup.includes(word) ||
            sectionName.includes(word) ||
            stallNumber.includes(word)
        );
      });

      setFoundRental(entities[firstMatchingRentalId] || null);
    }
  }, [isSuccess, rentals, searchTerm]);

  useEffect(() => {
    if (foundRental) {
      setRental(foundRental._id);
      setCost(foundRental.stall?.cost);
    }
  }, [foundRental]);

  useEffect(() => {
    console.log(isAddSuccess);
    if (isAddSuccess) {
      setAmount(0);
      setRental("");
      setCost(0);
      setFoundRental(null);
      onCancel();
    }
  }, [isAddSuccess]);

  let content;
  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  } else if (foundRental && searchTerm !== "") {
    content = (
      <ul className="rental-list">
        <li
          key={foundRental._id}
          className="text-white flex flex-col items-start justify-between"
        >
          <div className="w-full bg-sky-600/50 rounded-t-md p-2">
            <div className="p-2 w-fit bg-sky-950 rounded-md font-semibold mb-2">
              <h1>{`Stall No. ${foundRental?.stall?.number}`}</h1>
            </div>
            <p className="ml-1">{foundRental?.stall?.section?.group}</p>
            <p className="ml-1">{foundRental?.stall?.section?.name}</p>
          </div>
          <div className="w-full text-sky-950 border-2 border-sky-600/50 rounded-b-md p-2">
            <div className="flex items-start gap-x-2">
              <FontAwesomeIcon icon={faStore} className="w-5" />
              <h1>{foundRental?.vendor?.name}</h1>
            </div>
            <div className="flex items-start gap-x-2">
              <FontAwesomeIcon icon={faUser} className="w-5" />
              <p>{foundRental?.vendor?.owner}</p>
            </div>
            <div className="flex items-start gap-x-2">
              <FontAwesomeIcon icon={faLocationDot} className="w-5" />
              <p>{foundRental?.vendor?.address}</p>
            </div>
          </div>
        </li>
      </ul>
    );
  } else {
    content = <p className="error">No rentals found.</p>;
  }

  const canSave = [validAmount, rental, cost].every(Boolean) && !isAddLoading;

  const onSavePaymentClicked = async (e) => {
    e.preventDefault();
    setTouchedAmount(true);

    const numericAmount = Number(amount);
    if (canSave) {
      await addNewPayment({
        rental,
        user: userId,
        cost,
        amount: numericAmount,
      });
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-blur-md bg-gray-800 bg-opacity-20 flex justify-center items-center z-50">
      <div className="bg-white w-1/3 p-5 rounded-lg shadow-md">
        <h1 className="text-center font-semibold text-lg mb-3">Collection</h1>
        <hr className="border-t border-sky-600 mb-5" />
        <label htmlFor="search" className="block">
          Search Vendor/Stall
        </label>
        <input
          type="search"
          name="search"
          placeholder="Store/Vendor/Group or Section"
          className="text-sky-800 border border-slate-200 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md w-full text-sm tracking-wide p-2 mb-5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-y-auto max-h-60 mb-5">{content}</div>
        <form method="POST" onSubmit={onSavePaymentClicked} className="default">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={onAmountChanged}
            className={`text-sky-800 border border-slate-200 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md w-full text-sm tracking-wide p-2 ${
              !validAmount && touchedAmount ? "border-red-500" : ""
            }`}
          />
          {foundRental &&
          amount !== 0 &&
          amount % foundRental.stall?.cost === 0 ? (
            <></>
          ) : (
            <p className="error">
              Amount is not divisible by stall's cost (
              {foundRental?.stall?.cost?.toFixed(2)})
            </p>
          )}
          <div className="flex justify-end gap-4 mt-5">
            <button
              className="btn-secondary w-56 py-2 rounded-md"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              title="Save"
              className="btn-primary w-56 py-2 rounded-md"
              disabled={isAddLoading}
              type="submit"
            >
              {isAddLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPayment;
