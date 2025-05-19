
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { submitDream } from '@/services/dreamService';

const INITIAL_FORM_STATE = {
  full_name: '',
  age: '',
  gender: '',
  marital_status: '',
  dream_text: ''
};

export default function SubmitDreamForm({ onSuccess }) {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.full_name) {
      setFormData(prev => ({ ...prev, full_name: profile.full_name }));
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'dream_text') {
      setCharCount(value.length);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dreamData = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      await submitDream(dreamData, user.id);

      toast({
        title: "تم إرسال رؤياك بنجاح",
        description: "سيتم تفسير الرؤيا خلال 10 دقائق تقريباً",
        variant: "success"
      });

      setFormData(INITIAL_FORM_STATE);
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error submitting dream:', error);
      toast({
        title: "خطأ في الإرسال",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const charLimit = profile?.char_limit || 1000;
  const isOverLimit = charCount > charLimit;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">الاسم الكامل</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">العمر</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
            />
          </div>

          <div>
            <Label htmlFor="gender">الجنس</Label>
            <Select name="gender" onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="marital_status">الحالة الاجتماعية</Label>
          <Select 
            name="marital_status" 
            onValueChange={(value) => handleSelectChange("marital_status", value)}
            value={formData.marital_status}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة الاجتماعية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">أعزب/عزباء</SelectItem>
              <SelectItem value="married">متزوج/متزوجة</SelectItem>
              <SelectItem value="divorced">مطلق/مطلقة</SelectItem>
              <SelectItem value="widowed">أرمل/أرملة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dream_text">نص الرؤيا</Label>
          <Textarea
            id="dream_text"
            name="dream_text"
            value={formData.dream_text}
            onChange={handleChange}
            required
            rows={6}
            className={isOverLimit ? 'border-red-500' : ''}
          />
          <div className="mt-2 text-sm flex justify-between items-center">
            <span className={isOverLimit ? 'text-red-500' : 'text-gray-500'}>
              {charCount} / {charLimit} حرف
            </span>
            {isOverLimit && (
              <span className="text-red-500">
                تجاوزت الحد الأقصى للأحرف
              </span>
            )}
          </div>
        </div>
      </div>

      {isOverLimit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تنبيه</AlertTitle>
          <AlertDescription>
            لا يمكن إرسال الرؤيا لأنها تتجاوز الحد الأقصى المسموح به من الأحرف ({charLimit} حرف)
          </AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || isOverLimit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          'إرسال الرؤيا'
        )}
      </Button>
    </form>
  );
}
