import Icons from "../assets/icons/Icons";

function Error404() {
  return (
    <div className="container mx-auto pt-56">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[430px] h-[280px] bg-blue-500 text-center rounded-3xl shadow-2xl shadow-sky-500/50 relative">
          <img
            src={Icons[4]}
            alt=""
            className="absolute w-[300px] h-[300px] -top-[100px] -left-[160px]"
          />
          <p className="text-[200px] font-roboto text-white/90">404</p>
        </div>
        <p className="text-xl font-roboto w-[400px] text-center mt-20">
          Hey buddy! Looks like you're accessing a page that are not available!
        </p>
      </div>
    </div>
  );
}

export default Error404;
