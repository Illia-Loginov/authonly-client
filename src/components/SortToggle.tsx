import { MouseEvent } from 'react';
import { useResourceSortContext } from '../context/ResourceSortContext';
import { ResourceSort } from '../types/Resource';

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
    <div className="flex flex-row">
      <h3>Sort by:</h3>
      <button onClick={toggleSort('created_at')}>
        Date {sort.created_at.toUpperCase()}
      </button>
    </div>
  );
};

export default SortToggle;
