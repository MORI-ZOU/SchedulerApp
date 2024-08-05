import { useContext } from 'react';
import {
  DatabaseContext,
  DatabaseContextType,
} from '../providers/DatabaseProvider';

export const useLogin = (): DatabaseContextType => useContext(DatabaseContext);
