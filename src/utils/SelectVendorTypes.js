// import CreatableSelect from "react-select/creatable";
// import { useGetVendorsQuery } from "../features/vendors/vendorsApiSlice";

// const SelectVendorTypes = ({ valid, touched, state, onChange }) => {
//   const { data: vendors } = useGetVendorsQuery("vendorsList", {
//     pollingInterval: 60000,
//     refetchOnFocus: true,
//     refetchOnMountOrArgChange: true,
//   });

//   const options = vendors
//     ? [...new Set(vendors.ids.map((id) => vendors.entities[id].type))].map(
//         (type) => {
//           return { value: type, label: type };
//         }
//       )
//     : [];
//   const styles = {
//     control: (provided) => ({
//       ...provided,
//     }),

//     option: (provided, state) => ({
//       ...provided,
//     }),
//   };

//   const handleVendorChange = (selectedOption) => {
//     if (selectedOption) {
//       onChange({ target: { value: selectedOption.value } });
//     } else {
//       onChange({ target: { value: "" } });
//     }
//   };

//   return (
//     <CreatableSelect
//       name="vendor"
//       options={options}
//       styles={styles}
//       value={
//         options.find((option) => option.value === state) || {
//           label: state,
//           value: state,
//         }
//       }
//       onChange={handleVendorChange}
//       className={
//         !valid && touched
//           ? "border border-red-500 col-span-4 rounded-md"
//           : "text-sky-800 col-span-4 rounded-md"
//       }
//       placeholder="Select a vendor"
//     />
//   );
// };

// export default SelectVendorTypes;
