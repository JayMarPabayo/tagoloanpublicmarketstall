import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPersonShelter,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import { useGetStallsQuery } from "../stalls/stallsApiSlice";
import { useGetSectionsQuery } from "../stalls/sectionsApiSlice";
import { useAddNewRentalMutation } from "./rentalsApiSlice";
import SelectTenant from "../../utils/SelectTenant";
import RentalHistory from "./RentalHistory";

const RentStall = () => {
  const [addNewRental, { isLoading, isSuccess, error }] =
    useAddNewRentalMutation();

  const navigate = useNavigate();

  const [vendor, setVendor] = useState("");
  const [validVendor, setValidVendor] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [validStartDate, setValidStartDate] = useState(false);

  const [touchedStartDate, setTouchedStartDate] = useState(false);
  const [touchedVendor, setTouchedVendor] = useState(false);

  const { id } = useParams();

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

  useEffect(() => {
    setValidVendor(vendor !== "");
  }, [vendor]);

  useEffect(() => {
    setValidStartDate(startDate !== "" && startDate !== null);
  }, [startDate]);

  useEffect(() => {
    if (isSuccess) {
      setVendor("");
      setStartDate("");
      toast.success("Stall rented successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(`/dashboard/renting`, {
        state: { selectedSectionGroup: stall.section.group },
      });
    }
  }, [isSuccess, navigate, stall?.section?.group]);

  useEffect(() => {
    if (error) {
      toast.error(
        error?.data?.message || "An error occurred. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }, [error]);

  const onVendorChanged = (e) => {
    setVendor(e.target.value);
    setTouchedVendor(true);
  };

  const onStartDateChanged = (e) => {
    setStartDate(e.target.value);
    setTouchedStartDate(true);
  };

  const canSave = [validVendor, validStartDate].every(Boolean) && !isLoading;

  const onSaveRentalClicked = async (e) => {
    e.preventDefault();
    setTouchedVendor(true);
    if (canSave) {
      await addNewRental({
        stall: id,
        vendor,
        startDate,
      });
    }
  };

  const content = (
    <div className="flex gap-x-2">
      <div className="w-1/2">
        <div className="p-5">
          <div className="bg-white/70 rounded-md p-5 shadow-md">
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

            <section className="flex">
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
          </div>
        </div>
        <div className="p-5">
          <form
            method="POST"
            onSubmit={onSaveRentalClicked}
            className="form-input bg-sky-400/10 rounded-md shadow-md py-2 px-4"
          >
            <div className="flex items-center gap-x-3 text-lg mb-5">
              <FontAwesomeIcon icon={faPersonShelter} />
              <h3 className="text-sky-800 font-medium">Rent Details</h3>
            </div>

            <label htmlFor="vendor">Select Vendor</label>
            <SelectTenant
              valid={validVendor}
              touched={touchedVendor}
              state={vendor}
              onChange={onVendorChanged}
            />

            <div className="mt-5">
              <label htmlFor="startDate">Starting Date</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={onStartDateChanged}
                min={new Date().toISOString().split("T")[0]}
                className={
                  !validStartDate && touchedStartDate
                    ? "border border-red-500"
                    : ""
                }
              />
            </div>

            <div className="flex justify-end gap-x-4 mt-10">
              <button
                type="button"
                className="btn-secondary w-32 py-2 rounded-md"
                onClick={() => {
                  navigate(`/dashboard/renting`);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary w-32 py-2 rounded-md"
              >
                {isLoading && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                )}
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="p-5 w-1/2">{<RentalHistory stall={stall} />}</div>
    </div>
  );

  return content;
};

export default RentStall;
