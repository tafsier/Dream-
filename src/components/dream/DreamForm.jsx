
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Loader2, Info } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence import

    function isSubmitDisabled(isSubmitting, isOverLimit, canAttemptSubmit, canSubmitOverall) {
      return isSubmitting || isOverLimit || !canAttemptSubmit || !canSubmitOverall;
    }

    function DreamForm({
      formData = {},
      onFormChange,
      onSubmit,
      isSubmitting,
      charLimit,
      currentLength,
      isOverLimit,
      canSubmitOverall, 
      canAttemptSubmit, 
      remainingInterpretations,
      isSubscriptionValid
    }) {

      const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const processedValue = type === 'number'
          ? (value === '' ? '' : (isNaN(parseInt(value, 10)) ? formData[name] : parseInt(value, 10)))
          : value;
        onFormChange(name, processedValue);
      };

      const handleSelectChange = (name, value) => {
        onFormChange(name, value === 'none' ? '' : value);
      };

      const submitButtonDisabled = isSubmitDisabled(isSubmitting, isOverLimit, canAttemptSubmit, canSubmitOverall);

      const fullName = formData?.full_name ?? '';
      const gender = formData?.gender ?? '';
      const age = formData?.age ?? '';
      const maritalStatus = formData?.maritalStatus ?? '';
      const dreamText = formData?.dreamText ?? '';

      const formItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.05,
            type: 'spring',
            stiffness: 100,
          },
        }),
      };

      return (
        <motion.form 
          onSubmit={onSubmit} 
          className="max-w-2xl mx-auto bg-white dark:bg-slate-800/70 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 space-y-6 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
        >
          {isSubscriptionValid && remainingInterpretations !== null && (
            <motion.div 
              custom={0} variants={formItemVariants}
              className="text-center p-4 mb-4 bg-gradient-to-r from-green-100 via-teal-50 to-cyan-100 dark:from-green-800/30 dark:via-teal-800/30 dark:to-cyan-800/30 border border-green-200 dark:border-green-700 rounded-lg shadow-sm"
            >
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                عدد التفسيرات المتبقية لديك: <span className={`font-bold text-xl tracking-wider ${remainingInterpretations === 0 ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-300'}`}>{remainingInterpretations === Infinity ? '∞' : remainingInterpretations}</span>
              </p>
            </motion.div>
          )}

          <motion.div custom={1} variants={formItemVariants}>
            <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block">الاسم الكامل <span className="text-red-500">*</span></Label>
            <Input id="full_name" name="full_name" type="text" value={fullName} onChange={handleInputChange} placeholder="الاسم كما سيظهر للمفسر" className="mt-1 text-base focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white" required disabled={isSubmitting} aria-required="true" />
          </motion.div>

          <motion.div custom={2} variants={formItemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block">الجنس <span className="text-red-500">*</span></Label>
              <Select name="gender" onValueChange={(value) => handleSelectChange("gender", value)} value={gender || 'none'} required disabled={isSubmitting}>
                <SelectTrigger className="w-full mt-1 text-base focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"><SelectValue placeholder="اختر الجنس..." /></SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700"><SelectItem value="male">ذكر</SelectItem><SelectItem value="female">أنثى</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block">العمر <span className="text-red-500">*</span></Label>
              <Input id="age" name="age" type="number" value={age} onChange={handleInputChange} placeholder="العمر بالسنوات" className="mt-1 text-base focus:border-primary focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white" required min="1" disabled={isSubmitting} aria-required="true" />
              {age !== '' && age < 1 && (<p className="text-xs text-red-600 dark:text-red-400 mt-1">يجب أن يكون العمر 1 أو أكبر.</p>)}
            </div>
          </motion.div>
          
          <motion.div custom={3} variants={formItemVariants}>
            <Label htmlFor="maritalStatus" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 block">الحالة الاجتماعية <span className="text-red-500">*</span></Label>
            <Select name="maritalStatus" onValueChange={(value) => handleSelectChange("maritalStatus", value)} value={maritalStatus || 'none'} required disabled={isSubmitting}>
              <SelectTrigger className="w-full mt-1 text-base focus:ring-primary dark:bg-slate-700 dark:border-slate-600 dark:text-white"><SelectValue placeholder="اختر الحالة الاجتماعية..." /></SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-700"><SelectItem value="single">أعزب/عزباء</SelectItem><SelectItem value="married">متزوج/متزوجة</SelectItem><SelectItem value="divorced">مطلق/مطلقة</SelectItem><SelectItem value="widowed">أرمل/أرملة</SelectItem></SelectContent>
            </Select>
          </motion.div>

          <motion.div custom={4} variants={formItemVariants}>
            <Label htmlFor="dreamText" className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 block">نص الرؤيا <span className="text-red-500">*</span></Label>
            <Textarea id="dreamText" name="dreamText" value={dreamText} onChange={handleInputChange} placeholder="اكتب تفاصيل رؤياك هنا بوضوح..." required rows={10} className={`mt-2 text-base resize-y ${isOverLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500 shadow-inner shadow-red-100 dark:shadow-red-900/50' : 'border-gray-300 dark:border-slate-600 focus:border-primary focus:ring-primary focus:ring-1'} dark:bg-slate-700 dark:text-white`} maxLength={charLimit + 100} disabled={isSubmitting} aria-required="true" aria-invalid={isOverLimit} />
            <div className={`text-sm mt-2 flex justify-between items-center ${isOverLimit ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className="transition-opacity duration-300">{isOverLimit ? `تجاوزت الحد الأقصى (${charLimit})!` : ''}</span>
              <span className="font-mono tracking-tight">{currentLength} / {charLimit} حرف</span>
            </div>
          </motion.div>

          <motion.div custom={5} variants={formItemVariants} className="text-center pt-4">
            <Button type="submit" className="w-full text-lg py-3 font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-lg shadow-md hover:shadow-lg" disabled={submitButtonDisabled} aria-disabled={submitButtonDisabled}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />جاري الإرسال...</>) : ('أرسل رؤياك الآن')}
            </Button>
            
            <AnimatePresence>
            {(!canSubmitOverall && isSubscriptionValid && !isSubmitting) && (
              <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-center text-sm text-red-600 dark:text-red-400 mt-4 font-medium flex items-center justify-center">
                <Info className="h-4 w-4 mr-1"/> لقد استنفدت رصيدك من التفسيرات.
              </motion.p>
            )}
            {(!isSubscriptionValid && !isSubmitting) && (
               <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-center text-sm text-red-600 dark:text-red-400 mt-4 font-medium flex items-center justify-center">
                <Info className="h-4 w-4 mr-1"/> اشتراكك غير صالح حالياً.
               </motion.p>
            )}
            {(canSubmitOverall && !canAttemptSubmit && !isOverLimit && !isSubmitting) && (
                <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-center text-sm text-orange-600 dark:text-orange-400 mt-3 flex items-center justify-center">
                    <Info className="h-4 w-4 mr-1"/> يرجى ملء جميع الحقول المطلوبة (*).
                </motion.p>
            )}
            {(isOverLimit && !isSubmitting) && (
               <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-center text-sm text-red-600 dark:text-red-400 mt-3 flex items-center justify-center">
                  <Info className="h-4 w-4 mr-1"/> تجاوزت الحد الأقصى لعدد الأحرف.
               </motion.p>
            )}
            </AnimatePresence>
          </motion.div>
        </motion.form>
      );
    }

    export default DreamForm;
  