import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { useGetSectionsQuery } from "./sectionsApiSlice";
import { useGetStallsQuery } from "./stallsApiSlice";

import NewStallForm from "./NewStallForm";
import Stall from "./Stall";

const Sections = () => {
  const [showNewStallForm, setShowNewStallForm] = useState(false);
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
    <>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-x-4">
          <h1>Groups / Sections</h1>
          <button
            className="rounded-full"
            onClick={() => setShowNewStallForm(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
          </button>
        </div>

        <div className="flex flex-row gap-y-2 col-span-2 bg-white/50 rounded-md mb-10">
          {sections?.ids?.map((id) => {
            const group = sections.entities[id].group;

            if (!uniqueGroups.has(group)) {
              uniqueGroups.add(group);
              return (
                <button
                  key={sections.entities[id].id}
                  className={`p-2 w-28 rounded-md text-center border border-slate-600/20 text-wrap text-xs font-semibold ${
                    selectedSectionGroup === sections.entities[id].group
                      ? "bg-blue-100"
                      : ""
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

        <div className="flex items-center gap-x-4 mb-4">
          <h1>Stalls</h1>
          <div className="flex items-center gap-x-2 text-xs">
            <div className="bg-white rounded-full p-2"></div>
            <div>Vacant</div>

            <div className="bg-sky-600 rounded-full p-2 ms-7"></div>
            <div>Occupied</div>
          </div>
        </div>
        {selectedSectionGroup && (
          <div className={`flex flex-col gap-y-5 pb-5 p-2 bg-white/50`}>
            {filteredSections.map((section) => {
              const filteredStalls = Object.values(stalls.entities).filter(
                (stall) => stall.section === section.id
              );

              // const gridCols = [
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
                  <div
                    className={`grid grid-cols-${section.stallsPerRow} gap-2`}
                  >
                    {filteredStalls.map((stall) => (
                      <Stall
                        occupied={!stall.available}
                        number={stall.number}
                        key={stall.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showNewStallForm && (
        <NewStallForm onCancel={() => setShowNewStallForm(false)} />
      )}
    </>
  );
  return content;
};

export default Sections;
