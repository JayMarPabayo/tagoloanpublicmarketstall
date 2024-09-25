import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard" className="text-sky-600 hover:underline mt-4 block">
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
