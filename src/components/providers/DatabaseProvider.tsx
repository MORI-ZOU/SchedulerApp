import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { DatabaseInfo } from '../../types/DatabaseInfo';

export type DatabaseContextType = {
  databaseInfo: DatabaseInfo | null;
  setDatabaseInfo: Dispatch<SetStateAction<DatabaseInfo | null>>;
};

export const DatabaseContext = createContext<DatabaseContextType>(
  {} as DatabaseContextType
);

export const DatabaseProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);

  return (
    <DatabaseContext.Provider value={{ databaseInfo, setDatabaseInfo }}>
      {children}
    </DatabaseContext.Provider>
  );
};
