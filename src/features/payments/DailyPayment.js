import { useState } from "react";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";
import { useGetPaymentsQuery } from "./paymentsApiSlice";

import Spinner from "../../utils/Spinner";

const DailyPayment = ({ onCancel }) => {
  const {
    data: rentals,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetRentalsQuery("rentalsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: payments } = useGetPaymentsQuery("paymentsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [statusFilter, setStatusFilter] = useState("All");

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onCancel();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = rentals;

    const formattedSelectedDate = new Date(selectedDate).toDateString();
    const filteredIds = ids.filter((rentalId) => {
      const rental = entities[rentalId];
      return rental && !rental.endDate;
    });

    // Apply the filter for "Paid", "Not Paid", or "All"
    const filteredContent = filteredIds.filter((rentalId) => {
      const rental = entities[rentalId];
      const hasPaid = payments?.ids.some((paymentId) => {
        const payment = payments.entities[paymentId];
        const paymentDate = new Date(payment.date).toDateString();
        return (
          payment.rental._id === rental._id &&
          paymentDate === formattedSelectedDate
        );
      });

      if (statusFilter === "All") return true;
      if (statusFilter === "Paid") return hasPaid;
      if (statusFilter === "Not Paid") return !hasPaid;
      return true;
    });

    const tableContent = filteredContent.length ? (
      filteredContent.map((rentalId) => {
        const rental = entities[rentalId];
        const hasPaid = payments?.ids.some((paymentId) => {
          const payment = payments.entities[paymentId];
          const paymentDate = new Date(payment.date).toDateString();
          return (
            payment.rental._id === rental._id &&
            paymentDate === formattedSelectedDate
          );
        });

        return (
          <tr
            key={rentalId} // Add unique key for each row
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
              <span className="font-medium">
                {rental.stall?.section?.group}
              </span>
              <span className="ms-2">{rental.stall?.section?.name}</span>
            </td>

            <td className="hidden md:table-cell">
              <span className="py-1 px-3 bg-sky-900/90 rounded-md text-white">{`Stall No. ${rental.stall.number}`}</span>
            </td>

            <td>
              <p
                className={`md:py-1 md:px-3 rounded-md text-center font-medium md:text-white text-[0.6rem] md:text-xs ${
                  hasPaid
                    ? "text-green-700 md:bg-green-600"
                    : "text-red-700 md:bg-red-600"
                }`}
              >
                {hasPaid ? "Paid" : "Not Paid"}
              </p>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="4" className="text-center py-4">
          No rentals found
        </td>
      </tr>
    );

    content = (
      <div
        onClick={handleOverlayClick}
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div
          onClick={handleModalClick}
          className="bg-slate-100/90 p-5 pb-10 rounded-lg shadow-md w-full md:w-3/4"
        >
          <section className="flex items-center justify-end gap-x-2 md:px-5">
            <h3 className="text-sky-800 font-medium me-auto text-xs md:text-base">
              Daily Overview
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className=" cursor-pointer text-sky-800 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md w-36 text-xs md:text-sm tracking-wide p-2"
            />
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="cursor-pointer text-sky-800 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md text-xs md:text-sm tracking-wide p-2"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Not Paid">Not Paid</option>
            </select>
          </section>
          <hr className="border-t border-slate-400/50 my-3" />
          <div className="grid grid-cols-12 py-5 md:p-5 gap-x-5 ">
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
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>{tableContent}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return content;
};

export default DailyPayment;
