
    import { useEffect } from 'react';
    
    const useDreamListEffects = (userId, fetchDreams) => {
        useEffect(() => {
            if (userId) {
                fetchDreams();
            }
        }, [userId, fetchDreams]);
    };
    
    export default useDreamListEffects;
  