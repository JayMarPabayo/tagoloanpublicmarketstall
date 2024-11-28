import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  // faSpinner,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

// import { usePayBanDepositMutation } from "../rentals/rentalsApiSlice";
import CompensateBan from "./CompensateBan";

const PayBanDeposit = ({ onCancel, rental }) => {
  // const [payBanDeposit, { isLoading, isSuccess, error }] =
  //   usePayBanDepositMutation();

  const [showCompensateModal, setShowCompensateModal] = useState(false);
  const [showCompensateButton, setShowCompensateButton] = useState(false);

  // const [amount, setAmount] = useState(0);
  // const [validAmount, setValidAmount] = useState(false);

  // const [touchedAmount, setTouchedAmount] = useState(false);
  const [balance, setBalance] = useState(0);

  // useEffect(() => {
  //   setValidAmount(amount !== "" && amount > 0);
  // }, [amount]);

  // const onAmountChanged = (e) => {
  //   setAmount(e.target.value);
  //   setTouchedAmount(true);
  // };

  // useEffect(() => {
  //   if (isSuccess) {
  //     setAmount(0);
  //     setTouchedAmount(false);
  //   }
  // }, [isSuccess]);

  // let canSave;

  // canSave = [validAmount].every(Boolean) && !isLoading;

  // const onPayAmountClicked = async (e) => {
  //   setTouchedAmount(true);
  //   await payBanDeposit({
  //     id: rental.id,
  //     amount,
  //   });
  // };

  // const errMessage = error?.data?.message ?? "";

  useEffect(() => {
    if (rental) {
      const dueDate = new Date(rental.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = today - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        setBalance(Number(diffDays * rental.stall.cost).toFixed(2));
        setShowCompensateButton(true);
      } else {
        setBalance(Number(rental.stall.cost).toFixed(2));
        setShowCompensateButton(false);
      }
    }
  }, [rental]);

  const content = (
    <>
      <div className="cursor-auto fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <form
          className="w-[40rem] form-input bg-white/90 shadow-md rounded-md py-6 px-4"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-x-3 text-lg">
            <FontAwesomeIcon icon={faMoneyBillTransfer} />
            <h3 className="text-sky-800 font-medium">Ban Deposit</h3>
            <div className="flex gap-x-4 ms-auto items-center">
              <div>
                {rental?.dueDate && rental?.startDate
                  ? (() => {
                      const dueDate = new Date(rental?.dueDate);
                      const startDate = new Date(rental?.startDate);
                      const today = new Date();

                      if (startDate > today) {
                        return null;
                      }

                      const diffTime = today - dueDate;
                      const diffDays =
                        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

                      if (diffDays > 0) {
                        return (
                          <div className="flex items-center gap-x-2 text-base text-slate-700 sm:flex-row flex-col">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-rose-600"
                            />
                            <p>
                              {diffDays === 1
                                ? `Due 2 days ago`
                                : `Due ${diffDays + 1} days ago`}
                            </p>
                          </div>
                        );
                      } else if (diffDays === 0) {
                        return (
                          <div className="flex items-center gap-x-2 text-base text-slate-700 sm:flex-row flex-col">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-orange-400"
                            />
                            <p>Due is Today</p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-start md:items-center gap-x-2 text-xs text-slate-700 sm:flex-row flex-col">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-emerald-600"
                            />
                            <p>Paid</p>
                          </div>
                        );
                      }
                    })()
                  : "N/A"}
              </div>
              {showCompensateButton && (
                <button
                  title="Pay"
                  className="btn-ban w-44"
                  onClick={() => setShowCompensateModal(true)}
                >
                  <span>Compensate</span>
                </button>
              )}
            </div>
          </div>

          <hr className="border-t border-sky-600/50 my-3" />

          <div>Stall Ban Deposit Cost</div>
          <div className="bg-white border border-sky-600/50 rounded-md px-3 py-1 text-sky-800 text-lg mb-3">{`₱ ${Number(
            rental?.banAmount
          ).toFixed(2)}`}</div>

          {/* <div>Amount Paid</div>
          <div className="bg-white border border-sky-600/50 rounded-md px-3 py-1 text-sky-800 text-lg mb-3">{`₱ ${Number(
            rental?.banPaid
          ).toFixed(2)}`}</div> */}

          <div>Balance</div>
          <div className="bg-slate-800 rounded-md px-3 py-1 text-white text-lg">{`₱ ${Number(
            rental?.banPaid
          ).toFixed(2)}`}</div>

          <hr className="border-t border-sky-600/50 my-3" />

          {/* <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={onAmountChanged}
            className={
              !validAmount && touchedAmount ? "border border-red-500" : ""
            }
          /> */}

          <div className="flex items-center gap-x-5 justify-end mt-5">
            <button
              title="Close"
              className="btn-secondary w-44"
              onClick={onCancel}
            >
              <span>Close</span>
            </button>
            {/* <button
              title="submit"
              className="btn-primary w-44"
              disabled={!canSave}
              onClick={onPayAmountClicked}
            >
              {isLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Submit</span>
            </button> */}
          </div>
        </form>
      </div>
      {showCompensateModal && (
        <CompensateBan
          onCancel={() => setShowCompensateModal(false)}
          amount={Number(balance)}
          id={rental.id}
          cost={rental.stall?.cost}
        />
      )}
    </>
  );
  return content;
};

export default PayBanDeposit;
