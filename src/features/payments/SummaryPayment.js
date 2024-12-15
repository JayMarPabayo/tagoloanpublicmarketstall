import { useState } from "react";
import dayjs from "dayjs";

import { useGetPaymentsQuery } from "./paymentsApiSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import Spinner from "../../utils/Spinner";

const SummaryPayment = ({ onCancel }) => {
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

  const [mode, setMode] = useState("Daily");

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onCancel();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

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

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const groupedPayments = groupPayments();

    content = (
      <table className="w-full mt-5">
        <thead>
          <tr>
            <th>{mode} Period</th>
            <th>Total Collection</th>
          </tr>
        </thead>
        <tbody>
          {groupedPayments.map(({ displayPeriod, total }) => (
            <tr key={displayPeriod} className="border-b border-slate-600/20">
              <td>{displayPeriod}</td>
              <td>₱ {total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={handleModalClick}
        className="bg-slate-100/90 p-5 pb-10 rounded-lg shadow-md md:w-1/2"
      >
        <section className="flex items-center justify-end gap-x-2">
          <h3 className="text-sky-800 font-medium me-auto">
            Collection Summary
          </h3>
          <select
            value={mode}
            onChange={handleModeChange}
            className="cursor-pointer text-sky-800 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md text-sm tracking-wide w-36 p-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button
            onClick={() => {
              window.open(
                `/dashboard/collection/summary-report/${mode}`,
                "_blank"
              );
            }}
            className="btn-secondary flex items-center gap-x-2"
          >
            <FontAwesomeIcon icon={faPrint} />
            <div>Print</div>
          </button>
        </section>
        <hr className="border-t border-slate-400/50 my-3" />

        <div className="max-h-96 overflow-y-auto">{content}</div>
      </div>
    </div>
  );
};

export default SummaryPayment;
