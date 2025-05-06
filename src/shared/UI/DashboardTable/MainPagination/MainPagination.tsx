import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface MainPaginationProps {
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>;
  data: IEndpointResponse<any[], any> | undefined;
}

const MainPagination: FC<MainPaginationProps> = function ({ setPageIndex, data }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page: number = +(searchParams.get('page') ?? 1);

  const handlePageChange: (_page: number) => void = (_page) => {
    if (_page < 1) return;
    if (_page > (data?.pagination?.totalPages ?? 1)) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', _page.toString());
    setSearchParams(newSearchParams.toString());
    setPageIndex && setPageIndex(_page);
  };

  useEffect(() => {
    setSearchParams({ ...searchParams, page: page.toString() });
  }, []);

  return (
    <div className="mt-5 flex items-center justify-center text-center">
      <nav aria-label="table navigation buttons">
        <ul className="inline-flex -space-x-px">
          <li
            className="ml-0 cursor-pointer select-none rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={(): void => handlePageChange(page - 1)}>
            Previous
          </li>
          {[...Array(data?.pagination?.totalPages ?? 0).keys()].map((_page) => (
            <li
              key={_page}
              onClick={(): void => handlePageChange(_page + 1)}
              className={classNames(
                'cursor-pointer select-none',
                { 'bg-primary/10': _page === (data?.pagination?.page ?? 1) - 1 },
                'border border-gray-300 px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              )}>
              {_page + 1}
            </li>
          ))}
          <li
            onClick={(): void => handlePageChange(page + 1)}
            className="cursor-pointer select-none rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainPagination;
