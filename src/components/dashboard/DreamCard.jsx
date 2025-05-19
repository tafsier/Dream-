
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { motion, AnimatePresence } from 'framer-motion';
    import { format, parseISO } from 'date-fns';
    import { arSA } from 'date-fns/locale';
    import { Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";

    function DreamCard({ dream, onToggleInterpretation, onDeleteDream }) {
      const [showInterpretation, setShowInterpretation] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);
      const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

      const formattedDate = dream.created_at ? format(parseISO(dream.created_at), 'd MMMM yyyy, hh:mm a', { locale: arSA }) : 'غير متوفر';

      const handleToggle = () => {
        setShowInterpretation(!showInterpretation);
        if (onToggleInterpretation) onToggleInterpretation(dream.id, !showInterpretation);
      };
      
      const handleDelete = async () => {
        setIsDeleting(true);
        await onDeleteDream(dream.id);
        setShowDeleteConfirm(false);
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                <p className={`text-sm font-semibold capitalize px-2 py-0.5 rounded-full inline-block mt-1 ${
                  dream.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300' :
                  dream.status === 'interpreted' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
                }`}>
                  {dream.status === 'pending' ? 'قيد التفسير' : dream.status === 'interpreted' ? 'تم التفسير' : dream.status}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting} aria-label="حذف الرؤيا">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />}
              </Button>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">رؤيا بتاريخ: {dream.created_at ? format(parseISO(dream.created_at), 'd MMMM', { locale: arSA }) : ''}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{dream.dream_text}</p>

            {dream.status === 'interpreted' && dream.interpretation_text && (
              <Button onClick={handleToggle} variant="outline" size="sm" className="mb-3 text-primary border-primary hover:bg-primary/10">
                {showInterpretation ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showInterpretation ? 'إخفاء التفسير' : 'عرض التفسير'}
              </Button>
            )}
            
            <AnimatePresence>
            {showInterpretation && dream.interpretation_text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700"
              >
                <h5 className="text-md font-semibold text-primary mb-1">التفسير:</h5>
                <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{dream.interpretation_text}</p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
           <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                <AlertDialogDescription>
                  لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذه الرؤيا بشكل دائم من سجلاتك.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      );
    }

    export default DreamCard;
  