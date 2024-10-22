import { useState } from "react";

import Rental from "./Rental";
import Spinner from "../../utils/Spinner";
import NewPayment from "../payments/NewPayment";
import useAuth from "../../hooks/useAuth";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";

const RentalsList = () => {
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const { isStaff } = useAuth();

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

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  const onNewPaymentClicked = async () => {
    setIsNewPaymentModalOpen(true);
  };
  const handlePaymentConfirm = async () => {
    setIsNewPaymentModalOpen(false);
  };
  const handleNewPaymentCancel = () => {
    setIsNewPaymentModalOpen(false);
  };

  if (isSuccess) {
    const { ids, entities } = rentals;

    console.log(entities);

    const filteredIds = ids.filter((rentalId) => {
      const rental = entities[rentalId];
      return rental;
    });

    const tableContent = filteredIds.length ? (
      filteredIds.map((rentalId) => (
        <Rental key={rentalId} rentalId={rentalId} />
      ))
    ) : (
      <tr>
        <td colSpan="5">No rentals found</td>
      </tr>
    );

    content = (
      <>
        <section className="flex items-center justify-between px-5">
          <h3 className="text-sky-800 font-medium">Rental Overview</h3>

          {isStaff && (
            <button
              className="btn-primary"
              onClick={() => onNewPaymentClicked()}
            >
              New Payment
            </button>
          )}
        </section>
        <div className="grid grid-cols-12 p-5 gap-x-5 ">
          <div className="col-span-12">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Section</th>
                  <th>Stall</th>
                  <th>Cost</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          </div>
        </div>
        {isNewPaymentModalOpen && (
          <NewPayment
            onConfirm={handlePaymentConfirm}
            onCancel={handleNewPaymentCancel}
          />
        )}
      </>
    );
  }
  return content;
};

export default RentalsList;
