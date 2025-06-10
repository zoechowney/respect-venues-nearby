
import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignStylesCard = () => {
  return (
    <Card className="border-trans-pink/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-brand-navy">
          <Download className="w-5 h-5 text-trans-pink" />
          <span>Sign Styles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-brand-navy/70 mb-3">Choose from our range of professional sign designs:</p>
        <ul className="text-sm space-y-1 text-brand-navy/70">
          <li>• Classic Blue & White</li>
          <li>• Rainbow Pride</li>
          <li>• Minimalist Black</li>
          <li>• Custom Design Available</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SignStylesCard;
