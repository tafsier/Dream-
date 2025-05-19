
    import { useState, useMemo } from 'react';
    import { DREAM_STATUS } from '@/lib/constants.js';
    
    const useDreamFilters = (initialDreams = []) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [filterStatus, setFilterStatus] = useState({
        [DREAM_STATUS.PENDING]: true,
        [DREAM_STATUS.INTERPRETED]: true,
        [DREAM_STATUS.REJECTED]: true,
      });
      const [sortOrder, setSortOrder] = useState('desc');
    
      const filteredAndSortedDreams = useMemo(() => {
        if (!Array.isArray(initialDreams)) {
          console.warn("[useDreamFilters] initialDreams is not an array:", initialDreams);
          return [];
        }
        return initialDreams
          .filter(dream => {
            if (!dream || typeof dream !== 'object') {
                console.warn("[useDreamFilters] Invalid dream object in filter:", dream);
                return false;
            }
            const searchLower = searchTerm.toLowerCase();
            
            const currentDreamStatus = dream.status;
            const statusMatch = filterStatus[currentDreamStatus];
    
            let textMatch = false;
            if (dream.dream_text && typeof dream.dream_text === 'string') {
              textMatch = textMatch || dream.dream_text.toLowerCase().includes(searchLower);
            }
            if (dream.interpretation && typeof dream.interpretation === 'string') {
              textMatch = textMatch || dream.interpretation.toLowerCase().includes(searchLower);
            }
            if (dream.id && typeof dream.id === 'string') {
                textMatch = textMatch || dream.id.toLowerCase().includes(searchLower);
            }
            
            return statusMatch && textMatch;
          })
          .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });
      }, [initialDreams, searchTerm, filterStatus, sortOrder]);
    
      return {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        sortOrder,
        setSortOrder,
        filteredDreams: filteredAndSortedDreams,
      };
    };
    
    export default useDreamFilters;
  