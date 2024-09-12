import CreatableSelect from "react-select/creatable";
import { useGetSectionsQuery } from "../features/stalls/sectionsApiSlice";

const SelectSectionGroup = ({ valid, touched, state, onChange }) => {
  const { data: sections } = useGetSectionsQuery("sectionsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const options = sections
    ? [...new Set(sections.ids.map((id) => sections.entities[id].group))].map(
        (group) => ({ value: group, label: group })
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

  const handleGroupChange = (selectedOption) => {
    if (selectedOption) {
      onChange({ target: { value: selectedOption.value } });
    } else {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <CreatableSelect
      name="group"
      options={options}
      styles={styles}
      value={
        options.find((option) => option.value === state) || {
          label: state,
          value: state,
        }
      }
      onChange={handleGroupChange}
      className={
        !valid && touched
          ? "border border-red-500 col-span-4 rounded-md"
          : "text-sky-800 col-span-4 rounded-md"
      }
      placeholder="Type or select a group"
    />
  );
};

export default SelectSectionGroup;
