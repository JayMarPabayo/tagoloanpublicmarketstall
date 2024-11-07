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
  const uniqueGroups = new Set();

  const filteredSections = selectedSectionGroup
    ? Object.values(sections?.entities || {})
        .filter((section) => section.group === selectedSectionGroup)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleSectionGroupClick = (group) => {
    setSelectedSectionGroup(group);
  };

  const handleAddStallToSection = async (e, sectionId) => {
    e.preventDefault();
    await addStallToSection({ section: sectionId });
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

        <img
          src={`${process.env.PUBLIC_URL}/images/layout.jpg`}
          alt="Layout"
          className="mb-5 h-[40rem] shadow-md border-2 border-sky-700"
        />

        <div className="flex flex-row gap-y-2 col-span-2 bg-white/50 rounded-md mb-5">
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
                  {group
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              );
            }

            return null;
          })}
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
