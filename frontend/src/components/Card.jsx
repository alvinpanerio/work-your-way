function Card({ children }) {
  return (
    <div className="w-full max-w-sm h-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
      {children}
    </div>
  );
}

export default Card;
