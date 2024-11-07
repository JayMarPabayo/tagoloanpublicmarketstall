import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";

import { useGetSectionsQuery } from "../stalls/sectionsApiSlice";
import { useGetStallsQuery } from "../stalls/stallsApiSlice";

import Stall from "../stalls/Stall";

const SectionsList = () => {
  const { data: sections } = useGetSectionsQuery("sectionsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: stalls } = useGetStallsQuery("stallsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();

  const uniqueGroups = new Set();

  const content = (
    <>
      <div className="p-5">
        <div className="flex items-center justify-between gap-x-4 mb-4">
          <h1 className="text-lg font-semibold text-sky-950">MARKET STALL</h1>
          <div className="flex items-center gap-x-2 text-xs">
            <div className="bg-white rounded-full p-2"></div>
            <div>Vacant</div>

            <div className="bg-sky-600 rounded-full p-2 ms-7"></div>
            <div>Occupied</div>
          </div>
        </div>
        {sections?.ids?.map((id) => {
          const group = sections?.entities?.[id]?.group;

          const filteredSections = group
            ? Object.values(sections?.entities || {})
                .filter((section) => section.group === group)
                .sort((a, b) => a.name.localeCompare(b.name))
            : [];

          if (!uniqueGroups.has(group)) {
            uniqueGroups.add(group);
            return (
              <div key={sections?.entities?.[id]?.id} className="mb-10">
                <div className="flex items-center gap-x-3 mb-2 p-2 bg-sky-950/85 text-white">
                  <FontAwesomeIcon icon={faMapLocation} />
                  <h1>{group} Area</h1>
                </div>

                <div className={`flex flex-col gap-y-5 pb-5 p-2 bg-white/50`}>
                  {filteredSections?.map((section) => {
                    const filteredStalls = Object.values(
                      stalls?.entities || {}
                    ).filter((stall) => stall.section._id === section.id);

                    filteredStalls.sort((a, b) => a.number - b.number);

                    return (
                      <div key={section.id}>
                        <h1 className="mb-2">{section.name}</h1>
                        <div
                          className={`grid grid-cols-${section.stallsPerRow} gap-2`}
                        >
                          {filteredStalls.map((stall) => (
                            <button
                              key={stall.id}
                              onDoubleClick={() =>
                                stall.available === true
                                  ? navigate(`/dashboard/renting/${stall.id}`)
                                  : navigate(
                                      `/dashboard/renting/view/${stall.id}`
                                    )
                              }
                            >
                              <Stall
                                occupied={!stall.available}
                                number={stall.number}
                                reserved={stall.reserved}
                                key={stall.id}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
  return content;
};

export default SectionsList;
