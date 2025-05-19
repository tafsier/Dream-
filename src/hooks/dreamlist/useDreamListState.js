
    import { useState } from 'react';
    
    const useDreamListState = () => {
        const [currentPage, setCurrentPage] = useState(1);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [selectedDreamForDialog, setSelectedDreamForDialog] = useState(null);
    
        return {
            currentPage,
            setCurrentPage,
            isDialogOpen,
            setIsDialogOpen,
            selectedDreamForDialog,
            setSelectedDreamForDialog,
        };
    };
    
    export default useDreamListState;
  