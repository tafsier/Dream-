
    import React from 'react';
    import {
      AlertDialog,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogCancel,
    } from '@/components/ui/alert-dialog';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { format } from 'date-fns';
    import { arSA, enUS } from 'date-fns/locale';
    import { Copy, Share2, X } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    
    const InterpretationDialog = ({ isOpen, onClose, dream, t, language }) => {
      const { toast } = useToast();
    
      if (!dream) return null;
    
      const formatDate = (dateString) => {
        if (!dateString) return t('dashboard.notAvailable', { ns: 'dashboard' });
        try {
          return format(new Date(dateString), 'PPPp', { locale: language === 'ar' ? arSA : enUS });
        } catch (e) {
          return t('dashboard.invalidDate', { ns: 'dashboard' });
        }
      };
    
      const handleCopyToClipboard = async () => {
        if (!dream?.interpretation) {
          toast({
            title: t('dashboard.copyErrorTitle', { ns: 'dashboard' }),
            description: t('dashboard.interpretationNotAvailableYet', { ns: 'dashboard' }),
            variant: 'destructive',
          });
          return;
        }
        
        const textToCopy = `${t('dashboard.shareDreamTitle', { ns: 'dashboard' })}\n${dream.dream_text}\n\n${t('dashboard.shareInterpretationTitle', { ns: 'dashboard' })}\n${dream.interpretation}${dream.interpretation_source ? `\n\n${t('dashboard.shareSourceTitle', { ns: 'dashboard' })}\n${dream.interpretation_source}` : ''}\n\n${t('dashboard.shareSitePrompt', { ns: 'dashboard' })} ${window.location.origin}`;
    
        try {
          await navigator.clipboard.writeText(textToCopy);
          toast({
            title: t('dashboard.copySuccessTitle', { ns: 'dashboard' }),
            description: t('dashboard.copySuccessDesc', { ns: 'dashboard' }),
            variant: 'success',
          });
        } catch (err) {
          console.error('Failed to copy text: ', err);
          toast({
            title: t('dashboard.copyErrorTitle', { ns: 'dashboard' }),
            description: t('dashboard.copyErrorDesc', { ns: 'dashboard' }),
            variant: 'destructive',
          });
        }
      };
    
      const handleShare = async () => {
        if (!dream?.interpretation) {
          toast({
            title: t('dashboard.shareErrorTitle', { ns: 'dashboard' }),
            description: t('dashboard.interpretationNotAvailableYet', { ns: 'dashboard' }),
            variant: 'destructive',
          });
          return;
        }
    
        const shareData = {
          title: t('dashboard.shareDialogTitle', { ns: 'dashboard' }),
          text: `${t('dashboard.shareDreamTitle', { ns: 'dashboard' })}\n${dream.dream_text}\n\n${t('dashboard.shareInterpretationTitle', { ns: 'dashboard' })}\n${dream.interpretation}${dream.interpretation_source ? `\n\n${t('dashboard.shareSourceTitle', { ns: 'dashboard' })}\n${dream.interpretation_source}` : ''}\n\n${t('dashboard.shareSitePrompt', { ns: 'dashboard' })} ${window.location.origin}`,
          url: window.location.origin, 
        };
    
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            toast({
              title: t('dashboard.shareSuccessTitle', { ns: 'dashboard' }),
              description: t('dashboard.shareSuccessDesc', { ns: 'dashboard' }),
              variant: 'success',
            });
          } catch (err) {
            console.error('Error sharing: ', err);
            if (err.name !== 'AbortError') {
              toast({
                title: t('dashboard.shareErrorTitle', { ns: 'dashboard' }),
                description: `${t('dashboard.shareErrorDesc', { ns: 'dashboard' })}`,
                variant: 'destructive',
              });
            }
          }
        } else {
          
          handleCopyToClipboard();
        }
      };
    
      return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
          <AlertDialogContent className="sm:max-w-2xl bg-white dark:bg-slate-800 shadow-xl rounded-lg">
            <AlertDialogHeader className="pb-4 border-b dark:border-slate-700">
              <AlertDialogTitle className="text-2xl font-semibold text-primary dark:text-green-400">{t('dashboard.interpretationDialogTitle', { ns: 'dashboard' })}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.dreamSubmittedOn', { ns: 'dashboard' })} {formatDate(dream.created_at)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <ScrollArea className="max-h-[60vh] my-4 pr-3 rtl:pr-0 rtl:pl-3">
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t('dashboard.dreamDetailsTitle', { ns: 'dashboard' })}</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-slate-700/50 p-3 rounded-md">
                    {dream.dream_text}
                  </p>
                </div>
    
                {dream.interpretation ? (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t('dashboard.interpretationTitle', { ns: 'dashboard' })}</h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-slate-700/50 p-3 rounded-md">
                      {dream.interpretation}
                    </p>
                    {dream.interpreted_by && (
                       <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                         {t('dashboard.interpretedByLabel', { ns: 'dashboard' })} {dream.interpreted_by}
                       </p>
                    )}
                     {dream.interpretation_source && (
                       <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                         {t('dashboard.interpretationSourceLabel', { ns: 'dashboard' })} {dream.interpretation_source}
                       </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.interpretationPending', { ns: 'dashboard' })}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t dark:border-slate-700/50">
                    <p><strong className="text-gray-600 dark:text-gray-300">{t('submitDream.fullNameLabel', { ns: 'submitDream' })}:</strong> {dream.full_name || t('dashboard.notProvided', { ns: 'dashboard' })}</p>
                    <p><strong className="text-gray-600 dark:text-gray-300">{t('submitDream.ageLabel', { ns: 'submitDream' })}:</strong> {dream.age || t('dashboard.notProvided', { ns: 'dashboard' })}</p>
                    <p><strong className="text-gray-600 dark:text-gray-300">{t('submitDream.genderLabel', { ns: 'submitDream' })}:</strong> {dream.gender ? t(`submitDream.genderOptions.${dream.gender}`, { ns: 'submitDream' }) : t('dashboard.notProvided', { ns: 'dashboard' })}</p>
                    <p><strong className="text-gray-600 dark:text-gray-300">{t('submitDream.maritalStatusLabel', { ns: 'submitDream' })}:</strong> {dream.marital_status ? t(`submitDream.maritalStatusOptions.${dream.marital_status}`, { ns: 'submitDream' }) : t('dashboard.notProvided', { ns: 'dashboard' })}</p>
                </div>
    
              </div>
            </ScrollArea>
            
            <AlertDialogFooter className="pt-4 border-t dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex space-x-2 rtl:space-x-reverse mb-2 sm:mb-0">
                {dream?.interpretation && (
                  <>
                    <Button variant="outline" onClick={handleCopyToClipboard} className="dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700">
                      <Copy className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {t('dashboard.copyInterpretationButton', { ns: 'dashboard' })}
                    </Button>
                    {navigator.share && (
                      <Button variant="outline" onClick={handleShare} className="dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700">
                        <Share2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {t('dashboard.shareButton', { ns: 'dashboard' })}
                      </Button>
                    )}
                  </>
                )}
              </div>
              <AlertDialogCancel asChild>
                <Button variant="default" className="bg-primary hover:bg-primary/90 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white">
                  <X className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4"/> {t('dashboard.closeButton', { ns: 'dashboard' })}
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };
    
    export default InterpretationDialog;
  