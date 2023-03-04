import { Link } from "react-router-dom";

function Button({ type, to, size, n, h, add, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center text-white bg-blue-${n} hover:bg-blue-${h} font-medium rounded-lg text-base px-5 py-2.5 text-center ml-3 ${add}`}
    >
      {children}
    </Link>
  );
}

export default Button;
