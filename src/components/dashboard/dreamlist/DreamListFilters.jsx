
    import React from 'react';
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Checkbox } from "@/components/ui/checkbox.jsx";
    import { Label } from "@/components/ui/label";
    import { Filter, ListFilter, RotateCcw } from 'lucide-react';
    import { DREAM_STATUS } from '@/lib/constants';
    import { motion } from 'framer-motion';
    
    const statusOptions = [
        { value: DREAM_STATUS.PENDING, labelKey: 'dashboard.filterStatusPending' },
        { value: DREAM_STATUS.INTERPRETED, labelKey: 'dashboard.filterStatusInterpreted' },
        { value: DREAM_STATUS.REJECTED, labelKey: 'dashboard.filterStatusRejected' },
    ];
    
    const DreamListFilters = ({
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        sortOrder,
        setSortOrder,
        t
    }) => {
    
        const handleStatusChange = (statusValue) => {
            setFilterStatus(prev => ({
                ...prev,
                [statusValue]: !prev[statusValue]
            }));
        };
    
        const handleResetFilters = () => {
            setSearchTerm('');
            setFilterStatus({
                [DREAM_STATUS.PENDING]: true,
                [DREAM_STATUS.INTERPRETED]: true,
                [DREAM_STATUS.REJECTED]: true,
            });
            setSortOrder('desc');
        };
    
        return (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 lg:col-span-1">
                        <Label htmlFor="search-dreams" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            {t('dashboard.searchPlaceholder')}
                        </Label>
                        <Input
                            id="search-dreams"
                            type="text"
                            placeholder={t('dashboard.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                        />
                    </div>
    
                    <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            {t('dashboard.filterByStatus')}
                        </Label>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 min-h-[40px]">
                            {statusOptions.map(option => (
                                <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Checkbox
                                        id={`status-${option.value}`}
                                        checked={filterStatus[option.value] || false}
                                        onCheckedChange={() => handleStatusChange(option.value)}
                                        aria-label={t(option.labelKey)}
                                    />
                                    <Label htmlFor={`status-${option.value}`} className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer">
                                        {t(option.labelKey)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="sort-order" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('dashboard.sortByDate')}
                        </Label>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger id="sort-order" className="flex-grow bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700">
                                    <ListFilter className="h-4 w-4 mr-2 rtl:ml-2 opacity-70" />
                                    <SelectValue placeholder={t('dashboard.sortByDate')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">{t('dashboard.sortNewest')}</SelectItem>
                                    <SelectItem value="asc">{t('dashboard.sortOldest')}</SelectItem>
                                </SelectContent>
                            </Select>
                             <Button variant="outline" size="icon" onClick={handleResetFilters} aria-label={t('dashboard.resetFilters')} className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700">
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };
    
    export default DreamListFilters;
  