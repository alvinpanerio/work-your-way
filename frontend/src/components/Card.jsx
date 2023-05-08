function Card({ children }) {
  return (
    <div className="w-full max-w-sm h-full 2xl:p-8 p-6 bg-white border border-gray-200 rounded-lg shadow">
      {children}
    </div>
  );
}

export default Card;
