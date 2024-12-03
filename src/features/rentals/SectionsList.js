import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { useGetSectionsQuery } from "../stalls/sectionsApiSlice";
import { useGetStallsQuery } from "../stalls/stallsApiSlice";
import Stall from "../stalls/Stall";
import { useState } from "react";

const SectionsList = () => {
  const location = useLocation();
  const sectionGroup = location.state?.selectedSectionGroup || "";

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

  const [selectedGroup, setSelectedGroup] = useState(sectionGroup ?? "");

  // Get unique groups
  const groups = sections
    ? [...new Set(sections.ids.map((id) => sections.entities[id].group))]
    : [];

  // Filter sections based on the selected group
  const filteredSections = sections?.ids
    .map((id) => sections.entities[id])
    .filter((section) => section.group === selectedGroup)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
  };

  const content = (
    <div className="p-5">
      <div className="flex items-center justify-between gap-x-4 mb-4">
        <h1 className="text-lg font-semibold text-sky-950">MARKET STALL</h1>
        <div className="flex items-center gap-x-2 text-xs">
          <div className="bg-white rounded-full p-2"></div>
          <div>Vacant</div>

          <div className="bg-rose-600/90 rounded-full p-2 ms-7"></div>
          <div>Occupied</div>
        </div>
      </div>

      <div className="mb-4 text-xs">
        <div className="flex space-x-4 overflow-x-auto items-center">
          <FontAwesomeIcon icon={faMapLocation} className="h-6" />
          {groups.map((group) => (
            <button
              key={group}
              className={`px-4 py-2 rounded-full border ${
                selectedGroup === group ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => handleGroupChange(group)}
            >
              {group} Area
            </button>
          ))}
        </div>
      </div>

      {selectedGroup && (
        <div className={`flex flex-col gap-y-5 pb-5 p-2 bg-white/50`}>
          {filteredSections.map((section) => {
            const filteredStalls = Object.values(stalls?.entities || {}).filter(
              (stall) => stall.section._id === section.id
            );

            filteredStalls.sort((a, b) => a.number - b.number);

            return (
              <div key={section.id}>
                <h1 className="mb-2">{section.name}</h1>
                <div className={`grid grid-cols-${section.stallsPerRow} gap-2`}>
                  {filteredStalls.map((stall) => (
                    <button
                      key={stall.id}
                      onDoubleClick={() =>
                        stall.available === true
                          ? navigate(`/dashboard/renting/${stall.id}`, {
                              state: {
                                selectedSectionGroup: selectedGroup,
                              },
                            })
                          : navigate(`/dashboard/renting/view/${stall.id}`, {
                              state: {
                                selectedSectionGroup: selectedGroup,
                              },
                            })
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
      )}
    </div>
  );

  return content;
};

export default SectionsList;
