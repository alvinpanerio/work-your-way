import { Link } from "react-router-dom";

function Button({ type, to, add, children }) {
  return (
    <Link to={to}>
      <button
        type={type}
        className={`inline-flex items-center text-white bg-blue-500 hover:bg-blue-700 font-medium 
      rounded-lg text-base px-5 py-2.5 text-center ${add}`}
      >
        {children}
      </button>
    </Link>
  );
}

export default Button;
