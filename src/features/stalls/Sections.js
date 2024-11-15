import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { useGetSectionsQuery } from "./sectionsApiSlice";
import {
  useGetStallsQuery,
  useAddStallToSectionMutation,
} from "./stallsApiSlice";

import NewStallForm from "./NewStallForm";
import Stall from "./Stall";

const Sections = () => {
  const location = useLocation();
  const initialGroup = location.state?.selectedSectionGroup || "";
  const [showNewStallForm, setShowNewStallForm] = useState(false);
  const [selectedSectionGroup, setSelectedSectionGroup] =
    useState(initialGroup);

  const [addStallToSection] = useAddStallToSectionMutation();

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
  const uniqueGroups = Array.from(
    new Set(
      Object.values(sections?.entities || {}).map((section) => section.group)
    )
  );

  const filteredSections = selectedSectionGroup
    ? Object.values(sections?.entities || {})
        .filter((section) => section.group === selectedSectionGroup)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleAddStallToSection = async (e, sectionId) => {
    e.preventDefault();
    await addStallToSection({ section: sectionId });
  };

  const content = (
    <>
      <div className="px-5 pb-5">
        <div className="mb-2 flex items-center gap-x-4">
          <h1>Groups / Sections</h1>
          <button
            className="rounded-full"
            onClick={() => setShowNewStallForm(true)}
          >
            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
          </button>
        </div>

        <img
          src={`${process.env.PUBLIC_URL}/images/layout.jpg`}
          alt="Layout"
          className="mb-5 h-[40rem] shadow-md border-2 border-sky-700"
        />

        <div className="flex flex-row gap-y-2 col-span-2 items-center gap-x-5 rounded-md mb-5">
          <div className="text-sm">Select Group: </div>
          <select
            value={selectedSectionGroup}
            onChange={(e) => setSelectedSectionGroup(e.target.value)}
            className="p-2 w-1/4 rounded-md border border-slate-600/20 text-xs font-semibold"
          >
            {uniqueGroups.map((group, index) => (
              <option key={index} value={group}>
                {group
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-x-4 mb-4">
          <h1>Stalls</h1>
        </div>
        {selectedSectionGroup && (
          <div className={`flex flex-col gap-y-5 pb-5 p-2 bg-white/50`}>
            {filteredSections.map((section) => {
              const filteredStalls = Object.values(
                stalls?.entities || {}
              ).filter((stall) => stall.section._id === section.id);

              filteredStalls.sort((a, b) => a.number - b.number);

              return (
                <div key={section.id} className="mb-5">
                  <div className="mb-2 flex items-center gap-x-4">
                    <h1>{section.name}</h1>
                    <button
                      onClick={(e) => handleAddStallToSection(e, section.id)}
                      className="rounded-full"
                    >
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="text-lg"
                      />
                    </button>
                  </div>
                  <div
                    className={`grid grid-cols-${section.stallsPerRow} gap-2`}
                  >
                    {filteredStalls.map((stall) => (
                      <button
                        key={stall.id}
                        onDoubleClick={() =>
                          navigate(`/dashboard/sections/stalls/${stall.id}`, {
                            state: { selectedSectionGroup },
                          })
                        }
                      >
                        <Stall
                          occupied={!stall.available}
                          number={stall.number}
                          reserved={stall.reserved}
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
      {showNewStallForm && (
        <NewStallForm onCancel={() => setShowNewStallForm(false)} />
      )}
    </>
  );
  return content;
};

export default Sections;
