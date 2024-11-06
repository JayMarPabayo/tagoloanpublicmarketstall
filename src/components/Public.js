import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";

const Public = () => {
  const content = (
    <section className="bg-cover bg-center h-screen">
      <header className="font-medium text-lg border-b border-sky-700 p-3 mb-8 text-center md:text-start">
        Tagoloan Public Market Stall Fee Management System
      </header>
      <main className="max-w-[50rem] text-sky-700 px-3 text-center md:text-start">
        <p className="mb-8">
          This platform is designed to streamline the management of stall
          rentals in public markets. With this system, market administrators can
          efficiently allocate stall spaces, handle rental payments, and track
          stall occupancy.
        </p>
        <div className="flex items-center gap-x-2 mb-3">
          <FontAwesomeIcon icon={faLocationDot} />
          <p className="text-sm text-start">
            New Public Market, Zone 7 Alejandro Casiño St, Poblacion Tagoloan,
            Tagoloan, 9001 Misamis Oriental
          </p>
        </div>
        <div className="flex items-center gap-x-2 mb-10">
          <FontAwesomeIcon icon={faPhone} />
          <p className="text-sm">(088) 822 7604</p>
        </div>

        <button className="btn-primary w-56 mx-auto md:mx-0">
          <Link to="login">Employee Log in</Link>
        </button>
      </main>
    </section>
  );
  return content;
};

export default Public;
