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

  const stallForm = stall ? <EditStallForm stall={stall} /> : <p>Loading...</p>;

  return <div>{stallForm}</div>;
};

export default EditStall;
