/**
 * Data Container Component
 * 
 * Wrapper que gerencia automaticamente estados de loading, error e empty.
 * Simplifica a integração de dados da API com a UI.
 */

import { ReactNode } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { ApiError } from '../../../types';

interface DataContainerProps<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
  
  // Empty state customization
  emptyCondition?: (data: T) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  
  // Loading state customization
  loadingMessage?: string;
  
  // Error state customization
  errorTitle?: string;
  
  // Layout options
  fullPage?: boolean;
}

export function DataContainer<T>({
  data,
  isLoading,
  isError,
  error,
  onRetry,
  children,
  emptyCondition,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  loadingMessage,
  errorTitle,
  fullPage = false,
}: DataContainerProps<T>) {
  // Loading state
  if (isLoading) {
    return <LoadingState message={loadingMessage} fullPage={fullPage} />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        title={errorTitle}
        fullPage={fullPage}
      />
    );
  }

  // No data
  if (!data) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        fullPage={fullPage}
      />
    );
  }

  // Check empty condition (e.g., empty array)
  if (emptyCondition && emptyCondition(data)) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        fullPage={fullPage}
      />
    );
  }

  // Render children with data
  return <>{children(data)}</>;
}

/**
 * Specialized version for array data
 */
interface ListContainerProps<T> extends Omit<DataContainerProps<T[]>, 'emptyCondition' | 'data'> {
  items: T[] | null;
}

export function ListContainer<T>({
  items,
  ...props
}: ListContainerProps<T>) {
  return (
    <DataContainer<T[]>
      {...props}
      data={items}
      emptyCondition={(data) => data.length === 0}
    />
  );
}
