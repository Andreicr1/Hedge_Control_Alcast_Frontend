import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
  width?: number;
}

interface SAPGridTableProps {
  title?: string;
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  idField?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  actions?: ReactNode;
  emptyMessage?: string;
}

export function SAPGridTable({
  title,
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  idField = 'id',
  searchPlaceholder = 'Search',
  onSearch,
  actions,
  emptyMessage = 'No data available',
}: SAPGridTableProps) {
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
    <div className="flex flex-col size-full bg-white rounded-xl shadow-[0_0_0_1px_rgba(168,179,189,0.5)]">
      {/* Table Toolbar - SAP Fiori Style - Only show if title, search or actions exist */}
      {(title || onSearch || actions) && (
        <div className="bg-white relative rounded-tl-xl rounded-tr-xl border-b border-[#a8b3bd]">
          <div className="flex items-center justify-between px-2 py-0 h-11">
            {/* Title Section */}
            {title && (
              <div className="flex items-center">
                <p className="font-['72',sans-serif] font-bold text-base text-[#1d2d3e]">{title}</p>
              </div>
            )}

            {/* Actions Section */}
            {(onSearch || actions) && (
              <div className="flex gap-2 items-center ml-auto">
                {/* Search Input */}
                {onSearch && (
                  <div className="h-[26px] relative rounded w-[280px]">
                    <div className="absolute bg-white flex items-center left-0 h-[26px] overflow-hidden pl-0 pr-2 py-0 right-0 rounded top-0 shadow-[inset_0px_0px_0px_1px_rgba(85,107,129,0.25)]">
                      <div className="flex-1 mr-[-8px]">
                        <div className="flex items-center size-full">
                          <div className="flex items-center px-2 py-[5px] w-full">
                            <input
                              type="text"
                              placeholder={searchPlaceholder}
                              onChange={(e) => onSearch && onSearch(e.target.value)}
                              className="flex-1 h-4 text-sm italic text-[#556b82] outline-none bg-transparent placeholder:text-[#556b82] placeholder:italic font-['72',sans-serif]"
                            />
                          </div>
                        </div>
                      </div>
                      <button className="bg-transparent flex h-[26px] items-center justify-center px-2 py-[5px] rounded w-8">
                        <svg className="size-4" fill="none" viewBox="0 0 16 16">
                          <path
                            d="M14.5 14.5L10.5 10.5M11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5Z"
                            stroke="#131E29"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 h-0 left-0 right-0">
                        <div className="absolute -left-px -right-0 -bottom-px">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 1">
                            <line stroke="rgba(85, 107, 129, 1)" x2="280" y1="0.5" y2="0.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Actions */}
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {/* Header Row */}
        <div className="h-8 relative w-full border-b border-[#a8b3bd]">
          <div className="absolute flex items-start left-0 top-0">
            {/* Checkbox Column */}
            {selectable && (
              <div className="bg-white flex items-center justify-center h-8 w-8 px-0 py-2">
                <div className="absolute border-r border-[#e5e5e5] inset-0 pointer-events-none" />
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onChange={handleSelectAll}
                  className="size-4 rounded border border-[#556b81] cursor-pointer accent-[#0064d9]"
                />
              </div>
            )}

            {/* Column Headers */}
            {columns.map((column, idx) => (
              <div
                key={idx}
                className={`bg-white flex items-center h-8 px-2 py-2 w-[200px] ${
                  column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : ''
                }`}
                style={{ width: column.width || 200 }}
              >
                <div className="absolute border-r border-[#e5e5e5] inset-0 pointer-events-none" />
                <p
                  className={`flex-1 font-['72',sans-serif] font-semibold text-sm text-[#131e29] whitespace-nowrap overflow-hidden text-ellipsis ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {column.header}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Rows */}
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-[#556b82] text-sm">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIdx) => {
            const rowId = String(row[idField]);
            const isSelected = selectedRows.has(rowId);

            return (
              <div
                key={rowId}
                className={`flex items-start cursor-pointer hover:bg-[#f5f5f5] transition-colors ${
                  isSelected ? 'bg-[#e5f0fa]' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {/* Checkbox Cell */}
                {selectable && (
                  <div className="bg-white flex items-center justify-center min-h-8 w-8 px-0 py-1">
                    <div className="absolute border-r border-b border-[#e5e5e5] inset-0 pointer-events-none" />
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(rowId)}
                      onClick={(e) => e.stopPropagation()}
                      className="size-4 rounded border border-[#556b81] cursor-pointer accent-[#0064d9]"
                    />
                  </div>
                )}

                {/* Data Cells */}
                {columns.map((column, colIdx) => {
                  const value = row[column.accessor];
                  const displayValue = column.render ? column.render(value, row) : String(value ?? '');

                  return (
                    <div
                      key={`${rowId}-cell-${colIdx}`}
                      className={`bg-white flex items-center min-h-8 px-2 py-1 w-[200px] ${
                        column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : ''
                      }`}
                      style={{ width: column.width || 200 }}
                    >
                      <div className="absolute border-r border-b border-[#e5e5e5] inset-0 pointer-events-none" />
                      <div
                        className={`flex-1 font-['72',sans-serif] text-sm text-[#131e29] overflow-hidden ${
                          column.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {displayValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}