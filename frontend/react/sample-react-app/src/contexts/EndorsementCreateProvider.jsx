import { tabNames } from "@components/EndorsementCreate/data";
import { createContext, useContext, useState } from "react";
const EndorsementCreateContext = createContext(null);

export function EndorsementCreateProvider({ children }) {
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [endorsement, setEndorsement] = useState({
    Test: "null",
  });

  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
  };

  const value = { activeTab, handleChangeTab, endorsement, setEndorsement };

  return (
    <EndorsementCreateContext.Provider value={value}>
      {children}
    </EndorsementCreateContext.Provider>
  );
}

export function useEndorsementContext() {
  return useContext(EndorsementCreateContext);
}
