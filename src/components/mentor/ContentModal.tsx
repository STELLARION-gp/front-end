import React from 'react';
import { Dialog } from '@headlessui/react';

interface ContentModalProps {
  open: boolean;
  onClose: () => void;
  youtubeId: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ open, onClose, youtubeId }) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" aria-hidden="true" />
      <div className="relative bg-transparent flex items-center justify-center w-full h-full">
        <Dialog.Panel className="bg-transparent p-0 rounded-lg shadow-xl flex flex-col items-center">
          <iframe
            width="1000"
            height="750"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title="YouTube video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg shadow-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
            aria-label="Close"
          >
            ×
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ContentModal; 