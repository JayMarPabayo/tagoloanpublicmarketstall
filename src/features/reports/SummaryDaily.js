import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "../../lease.css";

import { useGetPaymentsQuery } from "../payments/paymentsApiSlice";

import Spinner from "../../utils/Spinner";

const SummaryDaily = () => {
  const {
    data: payments,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetPaymentsQuery("paymentsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { mode: passedMode } = useParams();

  const [mode] = useState(passedMode ?? "Daily");

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    paperSize: "A4",
  });
  const groupPayments = () => {
    if (!payments) return [];

    const grouped = {};
    payments.ids.forEach((id) => {
      const payment = payments.entities[id];
      const date = dayjs(payment.date);

      let key;
      let displayPeriod;

      if (mode === "Daily") {
        key = date.format("YYYY-MM-DD");
        displayPeriod = date.format("DD MMMM YYYY");
      } else if (mode === "Weekly") {
        key = date.startOf("week").format("YYYY-MM-DD");
        const weekStart = date.startOf("week").format("DD MMMM");
        const weekEnd = date.endOf("week").format("DD MMMM YYYY");
        displayPeriod = `${weekStart} - ${weekEnd}`;
      } else if (mode === "Monthly") {
        key = date.format("YYYY-MM");
        displayPeriod = date.format("MMMM YYYY");
      } else if (mode === "Yearly") {
        key = date.format("YYYY");
        displayPeriod = date.format("YYYY");
      }

      if (!grouped[key]) grouped[key] = { total: 0, displayPeriod };
      grouped[key].total += payment.amount;
    });

    return Object.values(grouped);
  };

  const renderPaginatedContent = (groupedPayments) => {
    const rowsPerPage = 25;
    const pages = [];

    for (let i = 0; i < groupedPayments.length; i += rowsPerPage) {
      const pageRows = groupedPayments.slice(i, i + rowsPerPage);
      const pageNumber = i / rowsPerPage + 1;

      pages.push(
        <div
          key={`page-${pageNumber}`}
          className="page-container relative bg-white rounded-sm shadow-md p-12 w-[1000px] h-[1320px] mx-auto text-slate-800 text-base mb-10"
        >
          <section className="text-center mb-10">
            <h1>Republic of the Philippines</h1>
            <h1>PROVINCE OF MISAMIS ORIENTAL</h1>
            <h1 className="mb-2">Municipality of Tagoloan</h1>
            <h1 className="font-bold text-base">
              TAGOLOAN PUBLIC MARKET RENTAL STALL
            </h1>
          </section>
          <section className="text-start mb-10">
            <h1 className="font-bold text-base">
              Rental Stall Payment Summary | {mode}
            </h1>
          </section>
          <table className="w-full mt-5">
            <thead>
              <tr>
                <th>{mode} Period</th>
                <th>Total Collection</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(({ displayPeriod, total }) => (
                <tr
                  key={displayPeriod}
                  className="border-b border-slate-600/20"
                >
                  <td>{displayPeriod}</td>
                  <td>₱ {total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="absolute bottom-5 right-5 text-slate-600">
            Page {pageNumber}
          </footer>
        </div>
      );
    }

    return pages;
  };

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const groupedPayments = groupPayments();
    content = renderPaginatedContent(groupedPayments);
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
      <div ref={contentRef}>{content}</div>
    </div>
  );
};

export default SummaryDaily;
