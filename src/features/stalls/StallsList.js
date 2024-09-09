import Stall from "./Stall";
import { useState } from "react";

const StallsList = () => {
  const [showFishSidewalk, setShowFishSidewalk] = useState(false);
  const [showVegetables, setShowVegetables] = useState(false);

  const randomOccupied = Array.from({ length: 36 }, () => Math.random() > 0.5);
  const randomOccupied2 = Array.from({ length: 16 }, () => Math.random() > 0.5);

  const content = (
    <div className="grid grid-cols-12 gap-x-5">
      <div className="flex flex-col gap-y-2 col-span-2">
        <button
          className={`py-2 px-3 rounded-md text-start ${
            showVegetables ? "bg-sky-700 text-white" : "bg-white/70"
          }`}
          onClick={() => {
            setShowFishSidewalk(false);
            setShowVegetables(true);
          }}
        >
          Vegetable Section
        </button>
        <button
          className={`py-2 px-3 bg-white/70 rounded-md text-start ${
            showFishSidewalk ? "bg-sky-700 text-white" : "bg-white/70"
          }`}
          onClick={() => {
            setShowVegetables(false);
            setShowFishSidewalk(true);
          }}
        >
          Fish Sidewalk
        </button>
      </div>

      {showFishSidewalk && (
        <div className="col-span-10 ps-5">
          {/* Fish Sidewalk Section */}
          <div className="flex items-center gap-x-2 text-sm mb-7">
            <div className="bg-white rounded-full p-2"></div>
            <div>Vacant</div>

            <div className="bg-sky-600 rounded-full p-2 ms-7"></div>
            <div>Occupied</div>
          </div>
          <h1 className="mb-2">Section A</h1>
          <div className="grid grid-cols-8 gap-x-1 gap-y-5 mb-5">
            {randomOccupied2.map((occupied, index) => (
              <Stall occupied={occupied} number={index + 1} key={index + 1} />
            ))}
          </div>
        </div>
      )}

      {showVegetables && (
        <div className="col-span-10 ps-5">
          {/* Vegetable Section */}
          <div className="flex items-center gap-x-2 text-sm mb-7">
            <div className="bg-white rounded-full p-2"></div>
            <div>Vacant</div>

            <div className="bg-sky-600 rounded-full p-2 ms-7"></div>
            <div>Occupied</div>
          </div>
          <h1 className="mb-2">Section A</h1>
          <div className="grid grid-cols-18 gap-x-1 gap-y-5 mb-5">
            {randomOccupied.map((occupied, index) => (
              <Stall occupied={occupied} number={index + 1} key={index + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
  return content;
};

export default StallsList;
