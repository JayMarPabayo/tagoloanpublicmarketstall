import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPersonShelter } from "@fortawesome/free-solid-svg-icons";

import { useAddNewVendorMutation } from "./vendorsApiSlice";

import SelectVendorTypes from "../../utils/SelectVendorTypes";

const NewVendorForm = () => {
  const [addNewVendor, { isLoading, isSuccess, error }] =
    useAddNewVendorMutation();

  const navigate = useNavigate();

  const [storename, setStorename] = useState("");
  const [validStorename, setValidStorename] = useState(false);

  const [fullname, setFullname] = useState("");
  const [validFullname, setValidFullname] = useState(false);

  const [birthdate, setBirthdate] = useState("");
  const [validBirthdate, setValidBirthdate] = useState(false);

  const [type, setType] = useState("");
  const [validType, setValidType] = useState(false);

  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);

  const [contact, setContact] = useState("");
  const [validContact, setValidContact] = useState(false);

  // const [banDeposit, setBanDeposit] = useState("");
  // const [validBanDeposit, setValidBanDeposit] = useState(false);

  const [touchedStorename, setTouchedStorename] = useState(false);
  const [touchedFullname, setTouchedFullname] = useState(false);
  const [touchedBirthdate, setTouchedBirthdate] = useState(false);
  const [touchedtype, setTouchedType] = useState(false);
  const [touchedAddress, setTouchedAddress] = useState(false);
  const [touchedContact, setTouchedContact] = useState(false);
  // const [touchedBanDeposit, setTouchedBanDeposit] = useState(false);

  useEffect(() => {
    setValidStorename(storename !== "");
  }, [storename]);

  useEffect(() => {
    setValidFullname(fullname !== "");
  }, [fullname]);

  useEffect(() => {
    const today = new Date();
    const selectedDate = new Date(birthdate);

    setValidBirthdate(
      birthdate !== "" &&
        !isNaN(new Date(birthdate).getTime()) &&
        selectedDate <= today
    );
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

  // useEffect(() => {
  //   setValidBanDeposit(!isNaN(banDeposit) && banDeposit >= 0);
  // }, [banDeposit]);

  useEffect(() => {
    if (isSuccess) {
      setFullname("");
      setBirthdate("");
      setStorename("");
      setType("");
      setAddress("");
      setContact("");
      // setBanDeposit("");
      navigate("/dashboard/vendors");
    }
  }, [isSuccess, navigate]);

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

  // const onBanDepositChanged = (e) => {
  //   setBanDeposit(e.target.value);
  //   setTouchedBanDeposit(true);
  // };

  const canSave =
    [
      validStorename,
      validFullname,
      validBirthdate,
      validType,
      validAddress,
      validContact,
      // validBanDeposit,
    ].every(Boolean) && !isLoading;

  const onSaveVendorClicked = async (e) => {
    e.preventDefault();
    setTouchedFullname(true);
    setTouchedBirthdate(true);
    setTouchedStorename(true);
    setTouchedType(true);
    setTouchedAddress(true);
    setTouchedContact(true);
    // setTouchedBanDeposit(true);
    if (canSave) {
      await addNewVendor({
        owner: fullname,
        name: storename,
        birthdate,
        type,
        address,
        contact,
        // banDeposit,
      });
    }
  };

  const content = (
    <div className="p-5">
      <form
        className="w-[40rem] form-input bg-white/20 shadow-md rounded-md p-6"
        method="POST"
        onSubmit={onSaveVendorClicked}
      >
        <div className="flex items-center gap-x-3 text-lg mb-7">
          <FontAwesomeIcon icon={faPersonShelter} />
          <h3 className="text-sky-800 font-medium">Create new vendor</h3>
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
              !validFullname && touchedFullname ? "border border-red-500" : ""
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
              !validBirthdate && touchedBirthdate ? "border border-red-500" : ""
            }
          />

          <label htmlFor="storename">Store/Shop</label>
          <input
            type="text"
            name="storename"
            placeholder="Store/Shop name"
            value={storename}
            className={
              !validStorename && touchedStorename ? "border border-red-500" : ""
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

          <label htmlFor="fullname">Address</label>
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

          <label htmlFor="fullname">Contact</label>
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

          {/* <label htmlFor="fullname">Ban Deposit</label>
          <input
            type="number"
            name="banDeposit"
            placeholder="Ban Deposit Amount"
            value={banDeposit}
            onChange={onBanDepositChanged}
            className={
              !validBanDeposit && touchedBanDeposit
                ? "border border-red-500"
                : ""
            }
          /> */}
        </section>
        <p className="error">{error?.data?.message}</p>
        <div className="flex">
          <button
            title="Save"
            className="btn-primary w-60 ml-auto"
            disabled={isLoading}
          >
            {isLoading && (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};

export default NewVendorForm;
