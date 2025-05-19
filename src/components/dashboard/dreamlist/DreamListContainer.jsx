
    import React from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useLanguage } from '@/contexts/useLanguage';
    import { useToast } from '@/components/ui/use-toast';
    import { useDreamManagement } from '@/hooks/useDreamManagement';
    import useDreamFilters from '@/hooks/useDreamFilters';
    import { useDreamRealtimeUpdates } from '@/hooks/useDreamRealtimeUpdates';
    import useDreamListState from '@/hooks/dreamlist/useDreamListState';
    import useDreamListEffects from '@/hooks/dreamlist/useDreamListEffects';
    import DreamListDisplay from '@/components/dashboard/dreamlist/DreamListDisplay';
    
    const ITEMS_PER_PAGE = 9;
    
    const DreamListContainer = () => {
        const { user } = useAuth();
        const { t, language } = useLanguage();
        const { toast } = useToast();
    
        const {
            dreams,
            isLoadingDreams,
            error,
            selectedDreamInterpretation,
            fetchDreams,
            handleDeleteDream,
            handleShowInterpretation,
            setSelectedDreamInterpretation,
            setDreams 
        } = useDreamManagement();
    
        const {
            searchTerm,
            setSearchTerm,
            filterStatus,
            setFilterStatus,
            sortOrder,
            setSortOrder,
            filteredDreams
        } = useDreamFilters(dreams);
        
        const newUpdates = useDreamRealtimeUpdates(user?.id, setDreams, toast, t);
    
        const {
            currentPage,
            setCurrentPage,
            isDialogOpen,
            setIsDialogOpen,
            selectedDreamForDialog,
            setSelectedDreamForDialog
        } = useDreamListState();
    
        useDreamListEffects(user?.id, fetchDreams);
    
        const handleViewInterpretationInDialog = (dream) => {
            setSelectedDreamForDialog(dream);
            setIsDialogOpen(true);
        };
    
        const handleCloseDialog = () => {
            setIsDialogOpen(false);
            setSelectedDreamForDialog(null);
        };
    
        const paginatedDreams = filteredDreams.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    
        const totalPages = Math.ceil(filteredDreams.length / ITEMS_PER_PAGE);
    
        return (
            <DreamListDisplay
                dreams={dreams}
                paginatedDreams={paginatedDreams}
                loading={isLoadingDreams}
                error={error}
                selectedDreamInterpretation={selectedDreamInterpretation}
                isDialogOpen={isDialogOpen}
                selectedDreamForDialog={selectedDreamForDialog}
                handleViewInterpretation={handleViewInterpretationInDialog}
                handleDeleteDream={handleDeleteDream}
                handleCloseDialog={handleCloseDialog}
                fetchDreams={fetchDreams}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                newUpdates={newUpdates}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                t={t}
                language={language}
                itemsPerPage={ITEMS_PER_PAGE}
            />
        );
    };
    
    export default DreamListContainer;
  