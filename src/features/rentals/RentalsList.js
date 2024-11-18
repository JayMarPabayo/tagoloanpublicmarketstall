import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";

import Rental from "./Rental";
import DailyPayment from "../payments/DailyPayment";
import SummaryPayment from "../payments/SummaryPayment";
import Spinner from "../../utils/Spinner";
import NewPayment from "../payments/NewPayment";
import useAuth from "../../hooks/useAuth";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";

const RentalsList = () => {
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [isDailyPaymentModalOpen, setIsDailyPaymentModalOpen] = useState(false);
  const [isSummaryPaymentModalOpen, setIsSummaryPaymentModalOpen] =
    useState(false);
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

    const filteredIds = ids.filter((rentalId) => {
      const rental = entities[rentalId];
      const today = new Date();
      return rental && !rental.endDate && new Date(rental.startDate) <= today;
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
        <section className="flex items-center justify-center md:justify-end gap-x-2 px-5">
          <h3 className="text-sky-800 font-medium md:me-auto text-xs md:text-base">
            Payment Overview
          </h3>

          <button
            className="btn-secondary"
            onClick={() => setIsDailyPaymentModalOpen(true)}
          >
            <FontAwesomeIcon icon={faCalendarDays} />
            <div>Daily Records</div>
          </button>
          <button
            className="btn-secondary"
            onClick={() => setIsSummaryPaymentModalOpen(true)}
          >
            <FontAwesomeIcon icon={faFileInvoice} />
            <div>Payment Summary</div>
          </button>
          {isStaff && (
            <button
              className="btn-primary"
              onClick={() => onNewPaymentClicked()}
            >
              New Payment
            </button>
          )}
        </section>
        <div className="grid grid-cols-12 py-5 md:p-5 gap-x-5">
          <div className="col-span-12">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="hidden md:table-cell">Store</th>
                  <th className="hidden md:table-cell">Owner</th>
                  <th className="md:hidden">Store/Owner</th>

                  <th className="hidden md:table-cell">Section</th>
                  <th className="hidden md:table-cell">Stall</th>
                  <th className="md:hidden">Stall Section</th>
                  <th>Cost</th>
                  <th>Due Date</th>
                  <th>Outstanding Balance</th>
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

        {isDailyPaymentModalOpen && (
          <DailyPayment onCancel={() => setIsDailyPaymentModalOpen(false)} />
        )}

        {isSummaryPaymentModalOpen && (
          <SummaryPayment
            onCancel={() => setIsSummaryPaymentModalOpen(false)}
          />
        )}
      </>
    );
  }
  return content;
};

export default RentalsList;
