import Select from "react-select";
import { useGetVendorsQuery } from "../features/vendors/vendorsApiSlice";

const SelectVendorTypes = ({ valid, touched, state, onChange }) => {
  const { data: vendors } = useGetVendorsQuery();

  const options = vendors
    ? [...new Set(vendors.ids.map((id) => vendors.entities[id].type))].map(
        (type) => ({ value: type, label: type })
      )
    : [];

  const styles = {
    control: (provided) => ({
      ...provided,
    }),

    option: (provided, state) => ({
      ...provided,
    }),
  };

  const handleTypeChange = (selectedOption) => {
    if (selectedOption) {
      onChange({ target: { value: selectedOption.value } });
    } else {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <Select
      name="type"
      options={options}
      styles={styles}
      value={
        options.find((option) => option.value === state) || {
          label: state,
          value: state,
        }
      }
      onChange={handleTypeChange}
      className={
        !valid && touched
          ? "border border-red-500 col-span-4 rounded-md"
          : "text-sky-800 col-span-4 rounded-md"
      }
    />
  );
};

export default SelectVendorTypes;
