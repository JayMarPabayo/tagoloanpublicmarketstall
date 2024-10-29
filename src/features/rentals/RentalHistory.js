import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { useGetRentalsQuery } from "./rentalsApiSlice";

import PaymentHistory from "../payments/PaymentHistory";

const RentalHistory = ({ stall }) => {
  const { data: rentals, isSuccess } = useGetRentalsQuery("rentalsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentRental, setCurrentRental] = useState(null);

  if (isSuccess) {
    const { ids, entities } = rentals;

    const filteredIds = ids.filter((id) => {
      const rental = entities[id];
      return rental;
    });

    const RentalsList = filteredIds.length ? (
      filteredIds.map((id) => {
        const rental = entities[id];
        if (rental.stall?._id === stall?.id) {
          const startDateFormatted = formatDate(rental.startDate);
          let dateDisplay;

          if (rental.endDate) {
            dateDisplay = `${startDateFormatted} - ${formatDate(
              rental.endDate
            )}`;
          } else if (!rental.stall?.available) {
            dateDisplay = `${startDateFormatted} - Present`;
          }
          return (
            <div
              key={id} // Change to id for uniqueness
              onClick={() => {
                setCurrentRental(rental);
                setIsHistoryModalOpen(true);
              }}
              className="rounded-md bg-amber-200 shadow-md p-2 flex items-start justify-between cursor-pointer hover:bg-amber-300 hover:scale-105 active:scale-100 duration-300"
            >
              <div>
                <div className="font-bold text-lg">{rental.vendor?.name}</div>
                <div className="text-slate-600">{rental.vendor?.owner}</div>
              </div>
              <div>
                <div className="text-slate-600">{dateDisplay}</div>
              </div>
            </div>
          );
        } else return null;
      })
    ) : (
      <div>
        <span>No payments found</span>
      </div>
    );
    return (
      <div className="w-full form-input bg-white/90 shadow-md rounded-md p-6">
        <div className="flex items-center gap-x-3 text-lg mb-7">
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <h3 className="text-sky-800 font-medium">Rental History</h3>
        </div>
        <section className="flex flex-col gap-y-4">{RentalsList}</section>

        {isHistoryModalOpen && (
          <PaymentHistory
            onCancel={() => setIsHistoryModalOpen(false)}
            rental={currentRental}
          />
        )}
      </div>
    );
  } else return null;
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default RentalHistory;
