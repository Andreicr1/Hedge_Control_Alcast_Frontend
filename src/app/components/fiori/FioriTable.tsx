import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
  sortable?: boolean;
}

interface FioriTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  idField?: string;
  emptyMessage?: string;
  loading?: boolean;
  stickyHeader?: boolean;
  alternateRows?: boolean;
}

export function FioriTable({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  idField = 'id',
  emptyMessage = 'No data available',
  loading = false,
  stickyHeader = false,
  alternateRows = true,
}: FioriTableProps) {
  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set());
    } else {
      const allIds = new Set(data.map((row) => String(row[idField])));
      onSelectionChange(allIds);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-[var(--sapList_Background)] border border-[var(--sapList_BorderColor)] rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead
            className={`bg-[var(--sapList_HeaderBackground)] ${stickyHeader ? 'sticky top-0 z-10' : ''}`}
          >
            <tr className="border-b border-[var(--sapList_HeaderBorderColor)]">
              {selectable && (
                <th className="px-4 py-3 text-left" style={{ width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.size === data.length}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-${column.align || 'left'} text-[var(--sapList_HeaderTextColor)] text-sm font-normal`}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <button
                        className="text-[var(--sapContent_LabelColor)] hover:text-[var(--sapContent_ForegroundColor)]"
                        aria-label={`Sort by ${column.header}`}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <path d="M6 3L9 7H3L6 3Z" />
                          <path d="M6 9L3 5H9L6 9Z" opacity="0.4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-[var(--sapContent_LabelColor)]"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-[var(--sapContent_LabelColor)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowId = String(row[idField]);
                const isSelected = selectedRows.has(rowId);
                const isClickable = !!onRowClick;
                
                return (
                  <tr
                    key={rowId}
                    className={`
                      border-b border-[var(--sapList_BorderColor)]
                      ${alternateRows && rowIndex % 2 === 1 ? 'bg-[#fafafa]' : ''}
                      ${isSelected ? 'bg-[var(--sapList_SelectionBackgroundColor)]' : ''}
                      ${isClickable ? 'cursor-pointer hover:bg-[var(--sapList_HoverBackground)]' : ''}
                      transition-colors
                    `}
                    onClick={() => isClickable && onRowClick(row)}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer"
                          aria-label={`Select row ${rowId}`}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 py-3 text-${column.align || 'left'} text-sm text-[var(--sapContent_ForegroundColor)]`}
                      >
                        {column.render
                          ? column.render(row[column.accessor], row)
                          : String(row[column.accessor] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
