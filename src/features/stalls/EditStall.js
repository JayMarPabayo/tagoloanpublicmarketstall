import { useParams } from "react-router-dom";
import { useGetStallsQuery } from "./stallsApiSlice";

import EditStallForm from "./EditStallForm";

const EditStall = () => {
  const { id } = useParams();

  const { stall } = useGetStallsQuery("stallsList", {
    selectFromResult: ({ data }) => ({
      stall: data?.entities[id],
    }),
  });

  const content = stall ? <EditStallForm stall={stall} /> : <p>Loading...</p>;

  return content;
};

export default EditStall;
