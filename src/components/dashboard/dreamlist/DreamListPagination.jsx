
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card.jsx';

const DreamListPagination = ({ currentPage, totalPages, onPreviousPage, onNextPage, isLoading }) => {
  return (
    <CardFooter className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-slate-700">
      <Button
        onClick={onPreviousPage}
        disabled={currentPage === 1 || isLoading}
        variant="outline"
        className="dark:bg-slate-700 dark:border-slate-600"
      >
        السابق
      </Button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        صفحة {currentPage} من {totalPages}
      </span>
      <Button
        onClick={onNextPage}
        disabled={currentPage === totalPages || isLoading}
        variant="outline"
        className="dark:bg-slate-700 dark:border-slate-600"
      >
        التالي
      </Button>
    </CardFooter>
  );
};

export default DreamListPagination;
