import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { useGetRentalsQuery } from "./rentalsApiSlice";

const RentalHistory = ({ stall }) => {
  console.log(stall);
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
  if (isSuccess) {
    const { ids, entities } = rentals;

    const filteredIds = ids.filter((id) => {
      const rental = entities[id];
      return rental;
    });

    const RentalsList = filteredIds.length ? (
      filteredIds.map((id, index) => {
        const rental = entities[id];
        console.log(rental);
        if (rental.stall?._id === stall.id) {
          return (
            <div
              key={index}
              className="rounded-md bg-amber-200 shadow-md p-2 flex items-start justify-between"
            >
              <div>
                <div className="font-bold text-lg">{rental.vendor?.name}</div>
                <div className="text-slate-600">{rental.vendor?.owner}</div>
              </div>
              <div>
                <div className="text-slate-600">
                  {`${formatDate(rental.startDate)} - Present`}
                </div>
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
        {RentalsList}
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
