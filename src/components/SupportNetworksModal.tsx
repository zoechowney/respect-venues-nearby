
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
                  <p className="font-medium">
                    <a href="https://mermaidsuk.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      Mermaids
                    </a>:
                  </p>
                  <p>Support for trans youth (under 25) and their families / Helpline: 0808 801 0400.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://genderedintelligence.co.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      Gendered Intelligence
                    </a>:
                  </p>
                  <p>Trans-led charity offering youth support and workshops.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://lgbt.foundation" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      LGBT Foundation
                    </a>:
                  </p>
                  <p>Broad LGBT+ support including a trans programme and helpline: 0345 3 30 30 30.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://cliniq.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      CliniQ
                    </a>:
                  </p>
                  <p>Trans-inclusive sexual health & wellbeing clinic.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://transbareall.co.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      TransBareAll
                    </a>:
                  </p>
                  <p>Body positivity and mental health workshops & retreats.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://be-north.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      Be - Trans Support and Community
                    </a>:
                  </p>
                  <p>Trans-led peer groups across the UK.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-brand-navy text-lg mb-3">Healthcare Navigation & Advocacy:</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">
                    <a href="https://actionfortranshealth.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      Action for Trans Health
                    </a>:
                  </p>
                  <p>Campaigning for democratic trans healthcare access.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://thekitetrust.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      The Kite Trust (Cambridgeshire & East of England)
                    </a>:
                  </p>
                  <p>Youth trans and LGBT+ support.</p>
                </div>
                <div>
                  <p className="font-medium">
                    <a href="https://spectra-london.org.uk" target="_blank" rel="noopener noreferrer" className="text-trans-blue hover:underline">
                      Spectra London
                    </a>:
                  </p>
                  <p>Trans peer mentoring, counselling, and sexual health support.</p>
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
