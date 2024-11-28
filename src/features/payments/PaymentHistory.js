import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useGetPaymentsQuery } from "./paymentsApiSlice";
const PaymentHistory = ({ onCancel, rental }) => {
  const { data: payments, isSuccess } = useGetPaymentsQuery("paymentsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onCancel();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (isSuccess) {
    const { ids, entities } = payments;

    // -- payments by OR# with accumulated amount
    const paymentGroups = ids.reduce((acc, id) => {
      const payment = entities[id];
      if (payment && payment.rental?._id === rental?.id) {
        const { orNumber, amount, user, createdAt } = payment;

        if (!acc[orNumber]) {
          acc[orNumber] = {
            orNumber,
            user,
            createdAt,
            amount: 0,
          };
        }
        acc[orNumber].amount += amount;
      }
      return acc;
    }, {});

    const totalAmount = Object.values(paymentGroups).reduce(
      (sum, paymentGroup) => sum + paymentGroup.amount,
      0
    );

    const tableContent = Object.keys(paymentGroups).length ? (
      Object.values(paymentGroups).map((paymentGroup, index) => (
        <tr key={index} className="text-xs md:text-sm">
          <td>{paymentGroup.orNumber}</td>
          <td>{paymentGroup.user?.fullname}</td>
          <td>
            {new Date(paymentGroup.createdAt).toLocaleDateString("en-US")}
          </td>
          <td>₱ {paymentGroup.amount.toFixed(2)}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4">No payments found</td>
      </tr>
    );

    return (
      <>
        {" "}
        <div
          onClick={handleOverlayClick}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            onClick={handleModalClick}
            className="bg-slate-100/90 p-5 pb-10 rounded-lg shadow-md w-full md:w-1/2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sky-800 font-medium">Payment History</h3>
              <button onClick={onCancel}>
                <FontAwesomeIcon icon={faXmark} className="h-5" />
              </button>
            </div>
            <hr className="border-t border-slate-400/50 my-3" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-base font-semibold text-sky-950">
                  {rental.vendor?.name}
                </div>
                <div className="text-slate-700/70">{rental.vendor?.owner}</div>
              </div>
              <div className="flex flex-col gap-y-1 items-start">
                <div>
                  {rental?.dueDate
                    ? new Date(rental?.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
                {rental?.dueDate
                  ? (() => {
                      const dueDate = new Date(rental?.dueDate);
                      const today = new Date();
                      const diffTime = today - dueDate;
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );

                      if (diffDays > 0) {
                        return (
                          <div className="flex items-center gap-x-2 text-xs text-slate-700">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-rose-600"
                            />
                            <span>
                              {diffDays === 1
                                ? `Due 1 day ago`
                                : `Due ${diffDays} days ago`}
                            </span>
                          </div>
                        );
                      } else if (diffDays === 0) {
                        return (
                          <div className="flex items-center gap-x-2 text-xs text-slate-700">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-orange-400"
                            />
                            <span>Due is Today</span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center gap-x-2 text-xs text-slate-700">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-3 text-emerald-600"
                            />
                            <span>Paid</span>
                          </div>
                        );
                      }
                    })()
                  : "N/A"}
              </div>
            </div>

            <table className="w-full">
              <thead className="text-xs">
                <tr>
                  <th>OR#</th>
                  <th>Collector</th>
                  <th>Date Paid</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>

            <div className="mt-5">
              <div className="text-slate-600/80">
                Total amount accumulated:{" "}
                <span className="font-semibold text-lg text-sky-800">
                  ₱ {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else return null;
};

export default PaymentHistory;
