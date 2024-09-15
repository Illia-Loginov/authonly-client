import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useReducer
} from 'react';
import { ResourceSort } from '../types/Resource';
import { initialSort } from '../config/resources.config';

type ResourceSortAction = {
  type: 'set';
  sort: ResourceSort;
};

interface ResourceSortContextValue {
  sort: ResourceSort;
  dispatch: Dispatch<ResourceSortAction>;
}

const ResourceSortContext = createContext<ResourceSortContextValue | null>(
  null
);

const resourceSortReducer = (
  _: ResourceSort,
  action: ResourceSortAction
): ResourceSort => {
  return action.sort;
};

export const ResourceSortProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [sort, dispatch] = useReducer(resourceSortReducer, initialSort);

  const contextValue: ResourceSortContextValue = {
    sort,
    dispatch
  };

  return (
    <ResourceSortContext.Provider value={contextValue}>
      {children}
    </ResourceSortContext.Provider>
  );
};

export const useResourceSortContext = () => {
  const context = useContext(ResourceSortContext);

  if (context === null) {
    throw new Error(
      'useResourceSortContext must be used within a ResourceSortProvider'
    );
  }

  return context;
};
