import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPersonShelter,
  faLinkSlash,
  faQrcode,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

import { useGetStallsQuery } from "../stalls/stallsApiSlice";
import { useGetSectionsQuery } from "../stalls/sectionsApiSlice";
import { useGetRentalsQuery, useVacateRentalMutation } from "./rentalsApiSlice";

import RentalHistory from "./RentalHistory";

const ViewStall = () => {
  const location = useLocation();
  const sectionGroup = location.state?.selectedSectionGroup || "";

  const { id } = useParams();
  const navigate = useNavigate();

  const { stall } = useGetStallsQuery("stallsList", {
    selectFromResult: ({ data }) => ({
      stall: data?.entities[id],
    }),
  });

  const sectionId = stall?.section;

  const { section } = useGetSectionsQuery("sectionsList", {
    selectFromResult: ({ data }) => ({
      section: data?.entities[sectionId],
    }),
  });

  const { rental } = useGetRentalsQuery("rentalsList", {
    selectFromResult: ({ data }) => {
      const rentalsArray = Object.values(data?.entities || {});
      return {
        rental: rentalsArray.find((rental) => rental.stall._id === id),
      };
    },
  });

  const [vacateRental, { isLoading }] = useVacateRentalMutation();
  const [showQRCode, setShowQRCode] = useState(false);

  const handleVacate = async () => {
    if (rental) {
      try {
        await vacateRental(rental._id).unwrap();
        toast.success("Stall vacated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/dashboard/renting", {
          state: {
            selectedSectionGroup: sectionGroup,
          },
        });
      } catch (error) {
        console.error("Failed to vacate rental:", error);
      }
    }
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleDownloadQRCode = () => {
    const qrCodeElement = document.getElementById("qr-code");
    html2canvas(qrCodeElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = "qr_code.png";
      a.click();
    });
  };

  const content = (
    <div className="flex gap-x-2">
      <div className="w-1/2">
        <div className="p-5">
          <div className="bg-white rounded-md p-5 shadow-md">
            <div className="flex items-center gap-x-3 text-lg mb-7">
              <FontAwesomeIcon icon={faStore} />
              <h3 className="text-sky-800 font-medium">Stall Information</h3>
              <div className="flex items-center gap-x-3 ms-auto font-medium">
                <h3 className="text-emerald-600">
                  {`₱ ${stall?.cost.toFixed(2)}`}
                </h3>
                <p>/ Day</p>
              </div>
            </div>

            <section className="fle mb-5">
              <div>
                <h1 className="text-lg font-medium">{section?.group}</h1>
                <span className="text-base font-normal">{section?.name}</span>
              </div>
              <div className="flex items-center bg-sky-900 rounded-md text-white py-1 px-5 tracking-widest text-2xl w-fit">
                <p>Stall No. {stall?.number}</p>
              </div>
              {stall?.notes && (
                <div className="ms-auto">
                  <p className="text-opacity-80 text-sm text-left">
                    {stall?.notes}
                  </p>
                </div>
              )}
            </section>

            <div className="flex items-center gap-x-3 text-lg mb-5">
              <FontAwesomeIcon icon={faPersonShelter} />
              <h3 className="text-sky-800 font-medium">Tenant Details</h3>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="w-36 text-teal-800/70 text-sm font-medium text-left">
                Store
              </p>
              <p className="text-lg font-medium">{rental?.vendor?.name}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <p className="w-36 text-teal-800/70 text-sm font-medium text-left">
                Owner
              </p>
              <p className="text-lg font-medium">{rental?.vendor?.owner}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <p className="w-36 text-teal-800/70 text-sm font-medium text-left">
                Address
              </p>
              <p className="text-lg font-medium">{rental?.vendor?.address}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <p className="w-36 text-teal-800/70 text-sm font-medium text-left">
                Contact
              </p>
              <p className="text-lg font-medium">{rental?.vendor?.contact}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <p className="w-36 text-teal-800/70 text-sm font-medium text-left">
                Date Started
              </p>
              <p className="text-lg font-medium">
                {rental?.startDate
                  ? new Date(rental.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-x-2 mt-3">
              <button
                onClick={handleVacate}
                disabled={isLoading}
                className="px-10 py-1 rounded-md bg-orange-800/80 text-white font-medium flex items-center gap-x-2"
              >
                <FontAwesomeIcon icon={faLinkSlash} />
                <div>{isLoading ? "Vacating..." : "Vacate"}</div>
              </button>
              <button
                onClick={handleShowQRCode}
                className="px-10 py-1 rounded-md bg-black text-white font-medium flex items-center gap-x-2"
              >
                <FontAwesomeIcon icon={faQrcode} />
                <div>Show QR Code</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 w-1/2">{<RentalHistory stall={stall} />}</div>

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md shadow-md w-96 flex flex-col items-center relative">
            <h3 className="text-lg font-bold mb-4">QR Code</h3>
            <div id="qr-code">
              <QRCode value={rental?._id || ""} />
            </div>
            <button
              onClick={handleDownloadQRCode}
              className="btn-secondary mt-5"
            >
              Download QR Code
            </button>
            <button
              onClick={handleCloseQRCode}
              className="absolute top-2 right-4"
            >
              <FontAwesomeIcon icon={faXmark} className="h-7 text-orange-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return content;
};

export default ViewStall;
