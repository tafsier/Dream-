
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoDreamsMessage = () => (
  <div className="text-center py-10">
    <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
    <p className="text-gray-500 dark:text-gray-400 text-lg">لم تقم بإرسال أي رؤى بعد.</p>
    <Button asChild className="mt-4">
      <Link to="/submit-dream">أرسل رؤياك الأولى</Link>
    </Button>
  </div>
);

export default NoDreamsMessage;
