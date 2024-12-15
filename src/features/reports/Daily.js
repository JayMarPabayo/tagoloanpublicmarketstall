import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import "../../lease.css";

import { useGetRentalsQuery } from "../rentals/rentalsApiSlice";
import { useGetPaymentsQuery } from "../payments/paymentsApiSlice";

import Spinner from "../../utils/Spinner";

const Daily = () => {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const status = searchParams.get("status");

  const [selectedDate] = useState(dateParam ? new Date(dateParam) : new Date());

  const [statusFilter] = useState(status);

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

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    paperSize: "A4",
  });

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(selectedDate));

  if (isSuccess) {
    const { ids, entities } = rentals;

    const formattedSelectedDate = new Date(selectedDate).toDateString();
    const filteredIds = ids.filter((rentalId) => {
      const rental = entities[rentalId];
      const today = new Date();
      return rental && !rental.endDate && new Date(rental.startDate) <= today;
    });

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
            key={rentalId}
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
                className={`text-center font-medium text-[0.9rem] ${
                  hasPaid ? "text-green-700" : "text-red-700"
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
    );
  }

  return (
    <div>
      <section className="mx-auto flex gap-x-2 justify-center items-center mb-2">
        <button
          onClick={reactToPrintFn}
          className="btn-primary flex items-center gap-x-2 w-28"
        >
          <FontAwesomeIcon icon={faPrint} />
          <h3 className="font-medium">Print</h3>
        </button>
      </section>
      <div ref={contentRef}>
        <div className="page-container bg-white rounded-sm shadow-md p-12 w-[1000px] h-[1320px] mx-auto text-slate-800 text-base mb-10">
          <section className="text-center mb-10">
            <h1>Republic of the Philippines</h1>
            <h1>PROVINCE OF MISAMIS ORIENTAL</h1>
            <h1 className="mb-2">Municipality of Tagoloan</h1>
            <h1 className="font-bold text-base">
              TAGOLOAN PUBLIC MARKET RENTAL STALL
            </h1>
          </section>
          <section className="text-start mb-10">
            <h1 className="font-bold text-base">Daily Stall Payment Status</h1>
            <div className="flex items-center gap-x-2">
              <FontAwesomeIcon icon={faCalendarDay} />
              <h1 className="font-medium text-base text-slate-700">
                {formattedDate}
              </h1>
            </div>
          </section>

          {content}
        </div>
      </div>
    </div>
  );
};

export default Daily;
