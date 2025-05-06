import { getPublicSVG } from '@app/utils/get-public-assets';
import classNames from 'classnames';
import { Checkbox, Table } from 'flowbite-react';
import { useId } from 'react';
import { ReactSVG } from 'react-svg';

export interface ITableData {
  id: string | number;
  cols: { [key: string]: string | React.ReactNode };
  rowClassName?: string;
}

interface DashboardTableProps {
  toggle?: boolean;
  headers: string[];
  loading?: boolean;
  data: ITableData[];
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  data,
  headers,
  toggle = false,
  loading = false,
}) => {
  const tableId = useId();

  if (loading)
    return (
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          {toggle && (
            <Table.HeadCell>
              <span className="sr-only">Toggle selected</span>
              <Checkbox />
            </Table.HeadCell>
          )}
          {headers.map((header) => (
            <Table.HeadCell className="whitespace-nowrap" key={header + '-table-header'}>
              {header.replace(/([a-z](?=[A-Z]))/g, '$1 ')}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {/* placeholder table with 7 rows */}
          {[...Array(7).keys()].map((row) => (
            <Table.Row
              key={row + '-table-row'}
              className="cursor-default hover:bg-gray-100 dark:hover:bg-gray-700">
              {toggle && (
                <Table.Cell className="w-4 p-4">
                  <Checkbox />
                </Table.Cell>
              )}
              {headers.map((col) => (
                <Table.Cell
                  key={`row-${row}-col-${col}`}
                  className="whitespace-nowrap p-4 text-sm font-normal text-gray-500/50 dark:text-gray-400/50">
                  <div className="h-9">
                    <div className="mb-2.5 h-3 w-24 animate-pulse rounded bg-gray-300/50 delay-1000 dark:bg-gray-600/50"></div>
                  </div>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        {toggle && (
          <Table.HeadCell>
            <span className="sr-only">Toggle selected</span>
            <Checkbox />
          </Table.HeadCell>
        )}
        {headers.map((header) => (
          <Table.HeadCell className="whitespace-nowrap" key={header + '-table-header'}>
            {header.replace(/([a-z](?=[A-Z]))/g, '$1 ')}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="relative divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {!data.length && (
          <Table.Row className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[inherit]">
            <Table.Cell
              colSpan={headers.length + (toggle ? 1 : 0)}
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-primary">
              <ReactSVG
                wrapper="span"
                src={getPublicSVG('illustrations', 'empty')}
                className="h-96 w-auto max-w-full"
                beforeInjection={(svg) => {
                  svg.setAttribute('style', 'height: 100%;');
                  return svg;
                }}
                title="Empty table illustration"
              />
              <p className="text-2xl font-semibold text-black/50">No Data</p>
            </Table.Cell>
          </Table.Row>
        )}
        {data?.map((row) => (
          <Table.Row
            key={tableId + '-' + row.id + '-table-row'}
            className={classNames(
              row.rowClassName,
              'cursor-default hover:bg-gray-100 dark:hover:bg-gray-700'
            )}>
            {toggle && (
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>
            )}
            {headers.map((col) => (
              <Table.Cell
                key={`row-${row.id}-col-${col}-${tableId}`}
                className="h-8 whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                {row.cols[col]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        {[...Array(Math.max(7 - data.length, 0)).keys()].map((row) => (
          <Table.Row key={row + '-table-row'} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {toggle && (
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>
            )}
            {headers.map((col) => (
              <Table.Cell
                key={`row-${row}-col-${col}`}
                className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="h-10"></div>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default DashboardTable;
