import { MouseEvent } from 'react';
import { useResourceSortContext } from '../context/ResourceSortContext';
import { ResourceSort } from '../types/Resource';
import Button from './Shared/Button';

const SortToggle = () => {
  const { sort, dispatch: resourceSortDispatch } = useResourceSortContext();

  const toggleSort = (sortKey: keyof ResourceSort) => {
    return (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      resourceSortDispatch({
        type: 'set',
        sort: {
          ...sort,
          [sortKey]: sort[sortKey] === 'asc' ? 'desc' : 'asc'
        }
      });
    };
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <h3>Sort by date </h3>
      <Button onClick={toggleSort('created_at')}>
        {sort.created_at.toUpperCase()}
      </Button>
    </div>
  );
};

export default SortToggle;
