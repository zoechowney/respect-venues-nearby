
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelfCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelfCareModal = ({ isOpen, onClose }: SelfCareModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-brand-navy text-xl">Self-Care & Wellbeing</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-brand-navy/80">
            <p>
              Tips and resources for maintaining mental health and wellbeing in challenging situations.
            </p>
            
            <p>
              Looking after your mental and emotional wellbeing is not a luxury, it's a necessity. 
              Especially when navigating a world that can sometimes feel unwelcoming or unsafe. 
              Whether you're dealing with discrimination, anxiety, or simply feeling worn down, 
              you deserve rest, care, and support.
            </p>
            
            <div>
              <h3 className="font-medium text-brand-navy text-lg mb-3">Everyday Self-Care Tips:</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Breathe and ground yourself:</p>
                  <p>Simple grounding techniques, like deep breathing, naming five things you can see, or placing your hand over your heart, can calm your nervous system in stressful moments.</p>
                </div>
                <div>
                  <p className="font-medium">Protect your space:</p>
                  <p>It's okay to log off, walk away, or say no. Boundaries are not selfish, they're self-preserving.</p>
                </div>
                <div>
                  <p className="font-medium">Find your people:</p>
                  <p>Whether online or in person, connecting with affirming friends, chosen family, or LGBTQ+ spaces can remind you that you're not alone.</p>
                </div>
                <div>
                  <p className="font-medium">Rest when you need to:</p>
                  <p>Fatigue, emotional or physical, is valid. Honour your limits and give yourself permission to pause.</p>
                </div>
                <div>
                  <p className="font-medium">Celebrate yourself:</p>
                  <p>You are more than your struggles. Affirm your identity, your joy, your strength, and your worth.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-brand-navy text-lg mb-3">When Things Get Tough:</h3>
              <p className="mb-3">
                If you've been challenged for using the toilet, misgendered, or made to feel unsafe, 
                you are not alone, and it is not your fault.
              </p>
              <div className="space-y-2">
                <p>• Talk to someone you trust</p>
                <p>• Write down what happened (it can help you process or take action later)</p>
                <p>• Consider reporting it (we can help with this)</p>
                <p>• Give yourself time to recover emotionally and physically</p>
              </div>
            </div>

            <div className="bg-trans-blue/10 p-4 rounded-lg border border-trans-blue/30">
              <div className="space-y-2 text-brand-navy">
                <p className="font-medium">You are valid. Your identity is real. Your wellbeing matters.</p>
                <p>This space is here to support and honour you.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SelfCareModal;
