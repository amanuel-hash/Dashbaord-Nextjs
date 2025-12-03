import { OverlayLoaderContext } from "../../contexts/OverlayLoaderContext";
import { useContext } from "react";

const OverlayLoader = () => {
  const { Loading } = useContext(OverlayLoaderContext);
  if (!Loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-green-100 bg-opacity-10">
      <div className="absolute h-full w-full"></div>
      <div className="relative z-[10000]">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary text-4xl text-primary">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-[#ffffff] text-2xl text-[#ffffff]"></div>
        </div>
      </div>
    </div>
  );
};

export default OverlayLoader;
