
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BenefitsCard = () => {
  return (
    <Card className="border-trans-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-brand-navy">
          <CheckCircle className="w-5 h-5 text-trans-blue" />
          <span>What You Get</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
          <p className="text-sm text-brand-navy/70">Free high-quality door signs</p>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
          <p className="text-sm text-brand-navy/70">Listing on our platform</p>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-4 h-4 text-trans-blue mt-1 flex-shrink-0" />
          <p className="text-sm text-brand-navy/70">Community of like-minded businesses</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenefitsCard;
