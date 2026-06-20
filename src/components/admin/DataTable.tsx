'use client';

import { Fragment, ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: (row: T) => string;
  onRowClick?: (row: T) => void;
  expandedRow?: string | null;
  renderExpanded?: (row: T) => ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  expandedRow,
  renderExpanded,
  emptyMessage = 'Không có dữ liệu',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-brand-gold/10">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-gold/10 bg-brand-black-light/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-normal uppercase tracking-widest text-gray-500 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const id = keyField(row);
            const expanded = expandedRow === id;
            return (
              <Fragment key={id}>
                <tr
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-brand-gold/5 transition ${
                    onRowClick ? 'cursor-pointer hover:bg-brand-gold/5' : ''
                  } ${expanded ? 'bg-brand-gold/5' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-gray-300 ${col.className ?? ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
                {expanded && renderExpanded && (
                  <tr>
                    <td colSpan={columns.length} className="bg-brand-black-light/50 px-4 py-4">
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
