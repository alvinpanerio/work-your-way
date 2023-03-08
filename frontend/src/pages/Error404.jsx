import Icons from "../assets/icons/Icons";

function Error404() {
  return (
    <div className="container mx-auto 2xl:pt-56 md:pt-48">
      <div className="flex flex-col items-center justify-center">
        <div className="2xl:w-[430px] md:w-[330px] 2xl:h-[280px] md:h-[180px] bg-blue-500 text-center rounded-3xl shadow-2xl shadow-sky-500/50 relative">
          <img
            src={Icons[4]}
            alt=""
            className="absolute 2xl:w-[300px] md:w-[200px] md:h-[200px] 2xl:h-[300px] md:-top-[80px] 2xl:-top-[100px] md:-left-[120px] 2xl:-left-[160px]"
          />
          <p className="2xl:text-[200px] md:text-[130px] font-roboto text-white/90">
            404
          </p>
        </div>
        <p className="2xl:text-xl md:text-base font-roboto w-[400px] text-center 2xl:mt-20 md:mt-12">
          Hey buddy! Looks like you're accessing a page that are not available!
        </p>
      </div>
    </div>
  );
}

export default Error404;
