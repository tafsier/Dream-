
    import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { formatDistanceToNow } from 'date-fns';
    import { arSA, enUS } from 'date-fns/locale';
    import DreamListLoading from '@/components/dashboard/DreamListLoading';
    import DreamListError from '@/components/dashboard/DreamListError';
    import NoDreamsMessage from '@/components/dashboard/NoDreamsMessage';
    import DreamListFilters from '@/components/dashboard/dreamlist/DreamListFilters';
    import DreamListPagination from '@/components/dashboard/dreamlist/DreamListPagination';
    import DreamListHeader from '@/components/dashboard/dreamlist/DreamListHeader';
    import DreamListGrid from '@/components/dashboard/dreamlist/DreamListGrid';
    import DreamListUpdateIndicator from '@/components/dashboard/dreamlist/DreamListUpdateIndicator';
    import InterpretationDialog from '@/components/dashboard/InterpretationDialog';
    
    const DreamListDisplay = ({
        dreams,
        paginatedDreams,
        loading,
        error,
        isDialogOpen,
        selectedDreamForDialog,
        handleViewInterpretation,
        handleDeleteDream,
        handleCloseDialog,
        fetchDreams,
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        sortOrder,
        setSortOrder,
        newUpdates,
        currentPage,
        setCurrentPage,
        totalPages,
        t,
        language
    }) => {
    
        const handleRefresh = React.useCallback(() => {
            fetchDreams(true); 
        }, [fetchDreams]);
    
        if (loading && dreams.length === 0) return <DreamListLoading t={t} />;
        if (error) return <DreamListError t={t} message={error} />;
    
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg"
            >
                <DreamListHeader onRefresh={handleRefresh} t={t} />
                <DreamListFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    t={t}
                />
                <AnimatePresence>
                    {newUpdates > 0 && <DreamListUpdateIndicator count={newUpdates} onRefresh={handleRefresh} t={t} />}
                </AnimatePresence>
    
                {dreams.length === 0 && !loading ? (
                    <NoDreamsMessage t={t} />
                ) : (
                    <>
                        <DreamListGrid
                            dreams={paginatedDreams}
                            onViewInterpretation={handleViewInterpretation}
                            onDeleteDream={handleDeleteDream}
                            t={t}
                            language={language}
                            formatDate={(date) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: language === 'ar' ? arSA : enUS })}
                        />
                        {totalPages > 1 && (
                            <DreamListPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
    
                <InterpretationDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    dream={selectedDreamForDialog}
                    t={t}
                    language={language}
                />
            </motion.div>
        );
    };
    
    export default DreamListDisplay;
  