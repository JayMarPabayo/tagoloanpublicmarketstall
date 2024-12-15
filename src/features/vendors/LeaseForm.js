import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import "../../lease.css";

const LeaseForm = () => {
  const location = useLocation();
  const rental = location.state?.rental || "";

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    paperSize: "A4",
  });

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
              APPLICATION TO LEASE MARKET STALL
            </h1>
          </section>

          <section className="flex flex-col items-end mb-10">
            <div className="border-b border-black w-96 text-center text-base">
              {rental.vendor?.address}
            </div>
            <div className="w-96 text-center font-semibold mb-3">Address</div>

            <div className="border-b border-black w-96 text-center text-base">
              {formatDate(rental.startDate)}
            </div>
            <div className="w-96 text-center font-semibold">Date</div>
          </section>

          <section className="text-start mb-10">
            <h1 className="font-bold">The Market Committee</h1>
            <h1 className="font-bold">c/o The Municipal Treasurer, Chairman</h1>
            <h1 className="font-bold">Municipality of Tagoloan</h1>
          </section>

          <div className="mb-5 text-base">Sir, Madam</div>

          <p className="text-base indent-10 mb-5">
            I, {rental.vendor?.owner} hereby apply to lease Stall No.{" "}
            {rental.stall?.number}, {rental.stall?.section?.group} Area{" "}
            {rental.stall?.section?.name} of Tagoloan Public Market. I am{" "}
            {calculateAge(rental.vendor?.birthdate)} years old. A citizen of the
            Philippines and residing at {rental.vendor?.address}.
          </p>

          <p className="text-base indent-10 mb-5">
            Should the above-mentioned stall, room, booth or space be leased to
            me in accordance with the market rules and regulations. I promise to
            hold same under the following conditions:
          </p>

          <section className="ps-5 grid grid-cols-12 gap-x-2 text-base mb-10">
            <div className="col-span-1 text-end">1.</div>
            <p className="col-span-11 mb-2">
              That while I am occupying or leasing this stall room, booth or
              space. It shall at all times have my picture and that of my helper
              (or helpers) framed and displayed conspicuously in the stall room,
              booth or space.
            </p>

            <div className="col-span-1 text-end">2.</div>
            <p className="col-span-11 mb-2">
              I shall keep the stall and pertinent room, booth or space at all
              times in good sanitary condition and comply strictly with all
              market laws, ordinances, rules and regulations, now existing or
              which may hereafter be promulgated.
            </p>

            <div className="col-span-1 text-end">3.</div>
            <p className="col-span-11 mb-2">
              I shall pay the corresponding rents and cash tickets for the
              stall, room, table or space in the manner prescribed by existing
              ordinance.
            </p>

            <div className="col-span-1 text-end">4.</div>
            <p className="col-span-11 mb-2">
              I shall pay the corresponding goodwill money set forth in Section
              11 for every stall room, booth or space occupied.
            </p>

            <div className="col-span-1 text-end">5.</div>
            <p className="col-span-11 mb-2">
              Should I no longer be interested of the rights and privilege of my
              stall, I shall inform for proper sublease, rent or sale could be
              effected; otherwise, the same is considered null and void.
            </p>

            <div className="col-span-1 text-end">6.</div>
            <p className="col-span-11 mb-2">
              Everyday that I hire for one day's operation. I shall promptly
              notify the market authorities of my absence and give the reason.
            </p>

            <div className="col-span-1 text-end">7.</div>
            <p className="col-span-11 mb-2">
              Any violation on my part or on the part of my helpers of the
              foregoing terms and condition shall be sufficient cause for the
              authorities to cancel my lease contract.
            </p>
          </section>

          <section className="flex flex-col items-end">
            <div className="w-96 text-start mb-5">Very truly yours,</div>
            <div className="border-b border-black w-96 text-center text-base">
              {rental.vendor?.owner}
            </div>
            <div className="w-96 text-center font-semibold mb-3">Applicant</div>
          </section>
        </div>
        <div className="page-container bg-white rounded-sm shadow-md p-12 w-[1000px] h-[1320px] mx-auto text-slate-800 text-base mb-10">
          <p className="text-base indent-10 mb-24 mt-24">
            I, {rental.vendor?.owner} do hereby state that I am the person who
            signed this foregoing application, that I have read the same and the
            contents are true and correct to the best of my knowledge.
          </p>

          <section className="flex flex-col items-end mb-36">
            <div className="border-b border-black w-96 text-center text-base">
              {rental.vendor?.owner}
            </div>
            <div className="w-96 text-center font-semibold">
              Signature Over Printed Name
            </div>
            <div className="w-96 text-center">Applicant</div>
          </section>

          <p className="text-base indent-10 mb-24">
            <span className="font-semibold">SUBSCRIBED AND SWORN TO</span>{" "}
            before me this {getCurrentDateWithOrdinal()} at
            _______________________ Philippines, affiant applicant exhibiting to
            me his/her Residence Certificate No. _____________________ issued on
            ___________________________ at
            ______________________________________________, Philippines.
          </p>

          <section className="flex flex-col items-end">
            <div className="border-b border-black w-96 text-center text-base"></div>
            <div className="w-96 text-center font-semibold">
              Signature Over Printed Name
            </div>
            <div className="w-96 text-center">Administering Officer</div>
          </section>
        </div>
      </div>
    </div>
  );
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function calculateAge(birthdate) {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function getCurrentDateWithOrdinal() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-GB", { month: "long" });

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  return `${day}${suffix} of ${month}, ${year}`;
}

export default LeaseForm;
