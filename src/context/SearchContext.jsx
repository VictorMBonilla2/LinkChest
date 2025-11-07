// VistaContext.js
import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [lastEvent, setLastEvent] = useState(null);

  const emitChange = (event) => {
    // event puede ser: { type: "ENLACE_ELIMINADO", payload: {...} }
    setLastEvent(event);
  };

  return (
    <SearchContext.Provider value={{ lastEvent, emitChange }}>
      {children}
    </SearchContext.Provider>
  );
}

export const UseContextSearch = () => useContext(SearchContext);
