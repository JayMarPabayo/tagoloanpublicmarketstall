import { useState } from "react";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import PaymentHistory from "../payments/PaymentHistory";

const Rental = ({ rentalId }) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const { rental } = useGetRentalsQuery("rentalsList", {
    selectFromResult: ({ data }) => ({
      rental: data?.entities[rentalId],
    }),
  });

  if (rental && rental.vendor) {
    return (
      <>
        <tr
          onClick={() => setIsHistoryModalOpen(true)}
          className="border-b border-slate-600/20 hover:scale-[98%] active:scale-[96%] cursor-pointer duration-300"
        >
          <td>{rental.vendor?.name}</td>
          <td>{rental.vendor?.owner}</td>
          <td>
            <span className="font-medium">{rental.stall?.section?.group}</span>
            <span className="ms-2">{rental.stall?.section?.name}</span>
          </td>
          <td>
            <span className="py-1 px-3 bg-sky-900/90 rounded-md text-white">{`Stall No. ${rental.stall.number}`}</span>
          </td>
          <td>₱ {rental.stall?.cost?.toFixed(2)}</td>
          <td className="flex flex-col gap-y-1 items-start">
            <div>
              {rental?.dueDate
                ? new Date(rental?.dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
            {rental?.dueDate && rental?.startDate
              ? (() => {
                  const dueDate = new Date(rental?.dueDate);
                  const startDate = new Date(rental?.startDate);
                  const today = new Date();

                  // Check if startDate is in the future
                  if (startDate > today) {
                    return null; // Don’t show any status
                  }

                  const diffTime = today - dueDate;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

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
          </td>
        </tr>
        {isHistoryModalOpen && (
          <PaymentHistory
            onCancel={() => setIsHistoryModalOpen(false)}
            rental={rental}
          />
        )}
      </>
    );
  } else return null;
};

export default Rental;
