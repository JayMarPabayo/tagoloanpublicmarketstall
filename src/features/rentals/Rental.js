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
          <td className="md:hidden">
            <p className="font-medium">{rental.vendor?.name}</p>
            <p className="text-xs text-slate-600">{rental.vendor?.owner}</p>
          </td>

          <td className="hidden md:table-cell">{rental.vendor?.name}</td>
          <td className="hidden md:table-cell">{rental.vendor?.owner}</td>

          <td className="md:hidden">
            <p className="font-medium">{rental.stall?.section?.group}</p>
            <p className="mb-1">{rental.stall?.section?.name}</p>
            <span className="p-1 bg-sky-900/90 rounded-md text-white">{`Stall ${rental.stall.number}`}</span>
          </td>

          <td className="hidden md:table-cell">
            <span className="font-medium">{rental.stall?.section?.group}</span>
            <span className="ms-2">{rental.stall?.section?.name}</span>
          </td>

          <td className="hidden md:table-cell">
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

                  if (startDate > today) {
                    return null;
                  }

                  const diffTime = today - dueDate;
                  const diffDays =
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

                  if (diffDays > 0) {
                    return (
                      <div className="flex items-start md:items-center gap-x-2 text-xs text-slate-700 sm:flex-row flex-col">
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
                      <div className="flex items-start md:items-center gap-x-2 text-xs text-slate-700 sm:flex-row flex-col">
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
          </td>
          <td>
            {rental?.dueDate
              ? (() => {
                  const dueDate = new Date(rental?.dueDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const diffTime = today - dueDate;
                  const diffDays =
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                  console.log(diffDays);
                  if (diffDays > 0) {
                    return (
                      <p>
                        ₱ {Number(diffDays * rental?.stall?.cost).toFixed(2)}
                      </p>
                    );
                  } else if (diffDays === 1) {
                    return <p>₱ {Number(rental?.stall?.cost).toFixed(2)}</p>;
                  } else if (diffDays <= 0) {
                    return (
                      <div className="py-1 px-3 bg-emerald-800 text-white font-medium rounded-md">
                        Paid
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
