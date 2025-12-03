import { createContext, useMemo, useState } from "react";

export const OverlayLoaderContext = createContext({
  Loading: false,
  setLoading: (isLoading: any) => {},
  toggleLoading: () => {},
});
const OverlayLoaderContextProvider = ({ children }: any) => {
  const [Loading, setIsLoading] = useState(false);

  const setLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const toggleLoading = () => {
    setIsLoading((prev) => !prev);
  };

  const values = useMemo(
    () => ({
      Loading,
      setLoading,
      toggleLoading,
    }),
    [Loading],
  );

  return (
    <OverlayLoaderContext.Provider value={values}>
      {children}
    </OverlayLoaderContext.Provider>
  );
};

export default OverlayLoaderContextProvider;
