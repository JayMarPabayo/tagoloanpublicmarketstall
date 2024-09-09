import { useParams } from "react-router-dom";
import { useGetVendorsQuery } from "./vendorsApiSlice";

import EditVendorForm from "./EditVendorForm";

const EditVendor = () => {
  const { id } = useParams();

  const { vendor } = useGetVendorsQuery("vendorsList", {
    selectFromResult: ({ data }) => ({
      vendor: data?.entities[id],
    }),
  });

  const content = vendor ? (
    <EditVendorForm vendor={vendor} />
  ) : (
    <p>Loading...</p>
  );

  return content;
};

export default EditVendor;
