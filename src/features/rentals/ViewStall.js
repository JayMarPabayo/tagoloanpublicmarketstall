import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPersonShelter,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useGetStallsQuery } from "../stalls/stallsApiSlice";
import { useGetSectionsQuery } from "../stalls/sectionsApiSlice";
import { useGetRentalsQuery, useVacateRentalMutation } from "./rentalsApiSlice";

import RentalHistory from "./RentalHistory";

const ViewStall = () => {
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

  const handleVacate = async () => {
    if (rental) {
      try {
        await vacateRental(rental._id).unwrap();
        navigate("/dashboard/renting");
      } catch (error) {
        console.error("Failed to vacate rental:", error);
      }
    }
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

            <div className="flex items-center justify-end">
              <button
                onClick={handleVacate}
                disabled={isLoading}
                className="px-10 py-1 rounded-md bg-black/80 text-white font-medium flex items-center gap-x-2"
              >
                <FontAwesomeIcon icon={faLinkSlash} />
                <div>{isLoading ? "Vacating..." : "Vacate"}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 w-1/2">{<RentalHistory stall={stall} />}</div>
    </div>
  );

  return content;
};

export default ViewStall;
