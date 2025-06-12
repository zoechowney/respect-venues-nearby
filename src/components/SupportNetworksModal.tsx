
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SupportNetworksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportNetworksModal = ({ isOpen, onClose }: SupportNetworksModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-brand-navy text-xl">Support Networks</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-brand-navy/80">
            <p>
              Connect with local and national transgender support organizations and communities.
            </p>
            
            <div>
              <h3 className="font-medium text-brand-navy text-lg mb-3">Peer Support & Community:</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Mermaids:</p>
                  <p>Support for trans youth (under 25) and their families: mermaidsuk.org.uk / Helpline: 0808 801 0400.</p>
                </div>
                <div>
                  <p className="font-medium">Gendered Intelligence:</p>
                  <p>Trans-led charity offering youth support and workshops: genderedintelligence.co.uk.</p>
                </div>
                <div>
                  <p className="font-medium">LGBT Foundation:</p>
                  <p>Broad LGBT+ support including a trans programme and helpline: 0345 3 30 30 30.</p>
                </div>
                <div>
                  <p className="font-medium">CliniQ:</p>
                  <p>Trans-inclusive sexual health & wellbeing clinic: cliniq.org.uk.</p>
                </div>
                <div>
                  <p className="font-medium">TransBareAll:</p>
                  <p>Body positivity and mental health workshops & retreats: transbareall.co.uk.</p>
                </div>
                <div>
                  <p className="font-medium">Be - Trans Support and Community:</p>
                  <p>Trans-led peer groups across the UK: be-north.org.uk.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-brand-navy text-lg mb-3">Healthcare Navigation & Advocacy:</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Action for Trans Health:</p>
                  <p>Campaigning for democratic trans healthcare access: actionfortranshealth.org.uk.</p>
                </div>
                <div>
                  <p className="font-medium">The Kite Trust (Cambridgeshire & East of England):</p>
                  <p>Youth trans and LGBT+ support: thekitetrust.org.uk.</p>
                </div>
                <div>
                  <p className="font-medium">Spectra London:</p>
                  <p>Trans peer mentoring, counselling, and sexual health support: spectra-london.org.uk.</p>
                </div>
              </div>
            </div>

            <div className="bg-trans-pink/10 p-4 rounded-lg border border-trans-pink/30">
              <p className="font-medium text-trans-pink">
                You are not alone. These organizations are here to provide support, community, and advocacy for transgender individuals across the UK.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SupportNetworksModal;
