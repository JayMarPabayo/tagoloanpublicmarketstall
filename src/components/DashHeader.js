import { Link } from "react-router-dom";

const DashHeader = () => {
  const content = (
    <header className="font-medium text-lg text-sky-800 border-b border-sky-700 p-3 mb-8">
      <Link to="/">Tagoloan Public Market Stall Fee Management System</Link>
    </header>
  );

  return content;
};

export default DashHeader;
