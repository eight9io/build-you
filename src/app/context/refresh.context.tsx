import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IRefreshContext {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}
const RefreshContext = createContext<IRefreshContext>({
  refresh: false,
  setRefresh: undefined,
});

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
