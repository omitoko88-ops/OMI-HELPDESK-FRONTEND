import { createContext, useContext, useState, ReactNode } from "react";

const TableContentContext = createContext<{
  setTableContent: (node: ReactNode) => void;
  tableContent: ReactNode;
}>({
  setTableContent: () => {},
  tableContent: null,
});

export const TableContentProvider = ({ children }: { children: ReactNode }) => {
  const [tableContent, setTableContent] = useState<ReactNode>(null);

  return (
    <TableContentContext.Provider value={{ setTableContent, tableContent }}>
      {children}
    </TableContentContext.Provider>
  );
};

export const useTableContent = () => useContext(TableContentContext);
