import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetSectionsQuery } from "./sectionsApiSlice";
import { useGetStallsQuery } from "./stallsApiSlice";

import Stall from "./Stall";

const StallsList = () => {
  const [selectedSectionGroup, setSelectedSectionGroup] = useState("");

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

  const filteredSections = selectedSectionGroup
    ? Object.values(sections.entities)
        .filter((section) => section.group === selectedSectionGroup)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleSectionGroupClick = (group) => {
    setSelectedSectionGroup(group);
  };

  const content = (
    <div className="grid grid-cols-12 gap-x-5">
      <div className="flex flex-col gap-y-2 col-span-2">
        {sections?.ids?.map((id) => {
          const group = sections.entities[id].group;

          if (!uniqueGroups.has(group)) {
            uniqueGroups.add(group);
            return (
              <button
                key={sections.entities[id].id}
                className={`py-2 px-3 rounded-md text-start ${
                  selectedSectionGroup === sections.entities[id].group
                    ? "bg-sky-700 text-white"
                    : "bg-white/70"
                }`}
                onClick={() =>
                  handleSectionGroupClick(sections.entities[id].group)
                }
              >
                {group}
              </button>
            );
          }

          return null;
        })}
      </div>
      {selectedSectionGroup && (
        <div
          className={`flex flex-col col-span-10 gap-y-5 pb-5 p-2 bg-white/50`}
        >
          {filteredSections.map((section) => {
            const filteredStalls = Object.values(stalls.entities).filter(
              (stall) => stall.section === section.id
            );

            // let gridCols;
            // gridCols = [
            //   "grid-cols-1",
            //   "grid-cols-2",
            //   "grid-cols-3",
            //   "grid-cols-4",
            //   "grid-cols-5",
            //   "grid-cols-6",
            //   "grid-cols-7",
            //   "grid-cols-8",
            //   "grid-cols-9",
            //   "grid-cols-10",
            //   "grid-cols-11",
            //   "grid-cols-12",
            //   "grid-cols-13",
            //   "grid-cols-14",
            //   "grid-cols-15",
            //   "grid-cols-16",
            //   "grid-cols-17",
            //   "grid-cols-18",
            //   "grid-cols-19",
            //   "grid-cols-20",
            //   "grid-cols-21",
            //   "grid-cols-22",
            //   "grid-cols-23",
            //   "grid-cols-24",
            // ];
            return (
              <div key={section.id}>
                <h1 className="mb-2">{section.name}</h1>
                <div className={`grid grid-cols-${section.stallsPerRow} gap-2`}>
                  {filteredStalls.map((stall) => (
                    <button
                      key={stall.id}
                      onDoubleClick={() =>
                        navigate(`/dashboard/stalls/${stall.id}`)
                      }
                    >
                      <Stall
                        occupied={!stall.available}
                        number={stall.number}
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

export default StallsList;
