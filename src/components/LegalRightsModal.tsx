
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalRightsModal = ({ isOpen, onClose }: LegalRightsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-brand-navy text-xl">Know Your Rights</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-brand-navy/80">
            <p>
              Understanding your legal rights regarding access to facilities and protection from discrimination.
            </p>
            
            <p>
              As a transgender person in the UK, you are protected by the Equality Act 2010 under the characteristic of gender reassignment. This means it is unlawful for someone to treat you unfairly because you are trans, whether you've medically transitioned or not.
            </p>

            <div>
              <p className="font-medium mb-2">You have the right to:</p>
              <div className="pl-4 space-y-1">
                <p>• Use toilets and changing rooms that match your gender identity.</p>
                <p>• Be treated with dignity and respect in public places, including shops, gyms, restaurants, workplaces, and transport hubs.</p>
                <p>• Not be harassed, denied service, or asked for ID to prove your gender.</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">What changed in 2025?</p>
              <p className="mb-2">
                A recent Supreme Court ruling clarified that, in law, the word "sex" in the Equality Act means biological sex assigned at birth. The government has since issued guidance suggesting that venues may restrict trans people from using single-sex spaces. However:
              </p>
              <div className="pl-4 space-y-1">
                <p>1. This guidance is not legally binding, and</p>
                <p>2. Your protection from discrimination as a trans person remains fully in place.</p>
              </div>
              <p className="mt-2">
                Venues may only restrict access where it is strictly necessary and can be shown to be a proportionate way of achieving a legitimate aim (such as privacy or safety). Blanket bans or unnecessary ID checks are very likely to be unlawful.
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">If something happens:</p>
              <p className="mb-2">If you're denied access, harassed, or mistreated:</p>
              <div className="pl-4 space-y-1">
                <p>• You can raise a complaint directly with the venue.</p>
                <p>• You can seek support from organisations like Galop, Stonewall, or TransActual.</p>
                <p>• You may have legal grounds to challenge the behaviour.</p>
              </div>
            </div>

            <div className="bg-trans-blue/10 p-4 rounded-lg border border-trans-blue/30">
              <p className="font-medium text-trans-blue">
                At Rest with Respect, we believe everyone deserves to feel safe and welcome. You belong — and we've got your back.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalRightsModal;
