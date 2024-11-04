import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";

const StallsRented = ({ vendor }) => {
  const { data: rentals, isSuccess } = useGetRentalsQuery("rentalsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();

  //   const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentStall, setCurrentStall] = useState(null);

  if (isSuccess) {
    const { ids, entities } = rentals;

    const filteredIds = ids.filter((id) => {
      const rental = entities[id];
      return rental;
    });

    const RentalsList = filteredIds.length ? (
      filteredIds.map((id) => {
        const rental = entities[id];
        if (rental.vendor?._id === vendor?.id && !rental.endDate) {
          const startDateFormatted = formatDate(rental.startDate);
          let dateDisplay;

          if (rental.endDate) {
            dateDisplay = `${startDateFormatted} - ${formatDate(
              rental.endDate
            )}`;
          } else if (!rental.stall?.available) {
            dateDisplay = `${startDateFormatted}`;
          }
          return (
            <div
              key={id}
              onClick={() => {
                setCurrentStall(rental.stall);
                // setIsHistoryModalOpen(true);
              }}
              className="rounded-md bg-emerald-300 shadow-md p-2 flex items-start justify-between cursor-pointer"
            >
              <div>
                <div className="font-bold text-lg">
                  Stall No. {rental.stall?.number}
                </div>
                <div className="text-slate-600">
                  {rental.stall?.section?.group} {rental.stall?.section?.name}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button
                  onClick={() =>
                    navigate(`/dashboard/vendors/lease/${rental.id}`, {
                      state: {
                        rental,
                      },
                    })
                  }
                  className="btn-lease flex items-center gap-x-2"
                >
                  <FontAwesomeIcon icon={faFileContract} />
                  <div>Lease Form</div>
                </button>
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
          <h3 className="text-sky-800 font-medium">Stalls Occupied</h3>
        </div>
        <section className="flex flex-col gap-y-4">{RentalsList}</section>
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

export default StallsRented;
