import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPersonShelter } from "@fortawesome/free-solid-svg-icons";

import {
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} from "./vendorsApiSlice";

import DeleteConfirmationModal from "../../utils/DeleteConfirmationModal";
import SelectVendorTypes from "../../utils/SelectVendorTypes";
import StallsRented from "./StallsRented";

const EditVendorForm = ({ vendor }) => {
  const [updateVendor, { isLoading, isSuccess, error }] =
    useUpdateVendorMutation();
  const [
    deleteVendor,
    { isLoading: isDelLoading, isSuccess: isDelSuccess, error: delerror },
  ] = useDeleteVendorMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const [storename, setStorename] = useState(vendor.name);
  const [validStorename, setValidStorename] = useState(false);

  const [fullname, setFullname] = useState(vendor.owner);
  const [validFullname, setValidFullname] = useState(false);

  const [birthdate, setBirthdate] = useState("");
  const [validBirthdate, setValidBirthdate] = useState(false);

  const [type, setType] = useState(vendor.type);
  const [validType, setValidType] = useState(false);

  const [address, setAddress] = useState(vendor.address);
  const [validAddress, setValidAddress] = useState(false);

  const [contact, setContact] = useState(vendor.contact);
  const [validContact, setValidContact] = useState(false);

  const [touchedStorename, setTouchedStorename] = useState(false);
  const [touchedFullname, setTouchedFullname] = useState(false);
  const [touchedBirthdate, setTouchedBirthdate] = useState(false);
  const [touchedtype, setTouchedType] = useState(false);
  const [touchedAddress, setTouchedAddress] = useState(false);
  const [touchedContact, setTouchedContact] = useState(false);

  useEffect(() => {
    setValidStorename(storename !== "");
  }, [storename]);

  useEffect(() => {
    setValidFullname(fullname !== "");
  }, [fullname]);

  useEffect(() => {
    // Set the initial value in YYYY-MM-DD format
    if (vendor.birthdate) {
      setBirthdate(new Date(vendor.birthdate).toISOString().split("T")[0]);
    }
  }, [vendor.birthdate]);

  useEffect(() => {
    const today = new Date();
    const selectedDate = new Date(birthdate);

    setValidBirthdate(birthdate !== "" && selectedDate <= today);
  }, [birthdate]);

  useEffect(() => {
    setValidType(type !== "");
  }, [type]);

  useEffect(() => {
    setValidAddress(address !== "");
  }, [address]);

  useEffect(() => {
    setValidContact(contact !== "");
  }, [contact]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setFullname("");
      setBirthdate("");
      setStorename("");
      setType("");
      setAddress("");
      setContact("");
      navigate("/dashboard/vendors");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onStorenameChanged = (e) => {
    setStorename(e.target.value);
    setTouchedStorename(true);
  };

  const onFullnameChanged = (e) => {
    setFullname(e.target.value);
    setTouchedFullname(true);
  };

  const onBirthdateChanged = (e) => {
    setBirthdate(e.target.value);
    setTouchedBirthdate(true);
  };

  const onTypeChanged = (e) => {
    setType(e.target.value);
    setTouchedType(true);
  };

  const onAddressChanged = (e) => {
    setAddress(e.target.value);
    setTouchedAddress(true);
  };

  const onContactChanged = (e) => {
    setContact(e.target.value);
    setTouchedContact(true);
  };

  const onUpdateVendorClicked = async (e) => {
    setTouchedFullname(true);
    setTouchedBirthdate(true);
    setTouchedStorename(true);
    setTouchedType(true);
    setTouchedAddress(true);
    setTouchedContact(true);
    await updateVendor({
      id: vendor.id,
      owner: fullname,
      birthdate,
      name: storename,
      type,
      address,
      contact,
    });
  };

  const onDeleteVendorClicked = async () => {
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    await deleteVendor({ id: vendor.id });
  };
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  let canSave;

  canSave =
    [
      validStorename,
      validFullname,
      validBirthdate,
      validType,
      validAddress,
      validContact,
    ].every(Boolean) && !isLoading;

  const errMessage = (error?.data?.message || delerror?.data?.message) ?? "";

  console.log(vendor);
  const content = (
    <div className="flex gap-x-2">
      <div className="w-1/2">
        <div className="p-5">
          <form
            className="w-[40rem] form-input bg-white/20 shadow-md rounded-md p-6"
            method="POST"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-x-3 text-lg mb-7">
              <FontAwesomeIcon icon={faPersonShelter} />
              <h3 className="text-sky-800 font-medium">Update vendor</h3>
            </div>
            <section className="grid grid-cols-5 items-center gap-y-4 mb-10">
              <label htmlFor="fullname">Owner</label>
              <input
                type="text"
                name="fullname"
                placeholder="Vendor's full name"
                value={fullname}
                onChange={onFullnameChanged}
                className={
                  !validFullname && touchedFullname
                    ? "border border-red-500"
                    : ""
                }
              />

              <label htmlFor="birthdate">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                placeholder="Vendor's Birthdate"
                value={birthdate}
                onChange={onBirthdateChanged}
                className={
                  !validBirthdate && touchedBirthdate
                    ? "border border-red-500"
                    : ""
                }
              />

              <label htmlFor="storename">Store/Shop</label>
              <input
                type="text"
                name="storename"
                placeholder="Store/Shop name"
                value={storename}
                className={
                  !validStorename && touchedStorename
                    ? "border border-red-500"
                    : ""
                }
                onChange={onStorenameChanged}
              />

              <label htmlFor="type">Type</label>
              <SelectVendorTypes
                valid={validType}
                touched={touchedtype}
                state={type}
                onChange={onTypeChanged}
              />

              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Vendor's Address"
                value={address}
                onChange={onAddressChanged}
                className={
                  !validAddress && touchedAddress ? "border border-red-500" : ""
                }
              />

              <label htmlFor="contact">Contact</label>
              <input
                type="tel"
                name="contact"
                placeholder="Vendor Tel/Mobile Info"
                value={contact}
                onChange={onContactChanged}
                className={
                  !validContact && touchedContact ? "border border-red-500" : ""
                }
              />
            </section>

            <p className="error">{errMessage}</p>

            <div className="flex items-center gap-x-5 justify-end">
              <button
                title="Delete"
                className="btn-secondary w-60"
                onClick={onDeleteVendorClicked}
              >
                {isDelLoading && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                )}
                <span>Delete</span>
              </button>
              <button
                title="Save"
                className="btn-primary w-60"
                disabled={!canSave}
                onClick={onUpdateVendorClicked}
              >
                {isLoading && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                )}
                <span>Update</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="p-5 w-1/2">{<StallsRented vendor={vendor} />}</div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );

  return content;
};

export default EditVendorForm;
