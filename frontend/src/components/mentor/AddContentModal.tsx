import React, { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
  onAddVideo: (url: string) => void;
  onAddDocument: (file: File) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AddContentModal: React.FC<AddContentModalProps> = ({ open, onClose, onAddVideo, onAddDocument }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  const [tabIdx, setTabIdx] = useState(0);

  const handleSave = () => {
    if (tabIdx === 0 && videoUrl) {
      onAddVideo(videoUrl);
      setVideoUrl('');
      onClose();
    } else if (tabIdx === 1 && docFile) {
      onAddDocument(docFile);
      setDocFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="content-modal-bg" aria-hidden="true" />
      <div className="relative w-full max-w-md mx-auto">
        <Dialog.Panel className="bg-gray-100 rounded-xl shadow-2xl p-6 text-black">
          <Tab.Group selectedIndex={tabIdx} onChange={setTabIdx}>
            <Tab.List className="flex space-x-2 mb-4">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                    selected
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-200 text-black'
                  )
                }
              >
                Upload Video
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                    selected
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-gray-200 text-black'
                  )
                }
              >
                Upload Document
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <label className="block mb-2 font-medium text-black">YouTube Video URL</label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-white"
                  style={{ background: '#23272f', borderColor: '#23272f' }}
                  placeholder="https://youtube.com/..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  // Custom placeholder color
                  onFocus={e => e.target.style.setProperty('color-scheme', 'dark')}
                />
                <style>{`
                  input[type="url"]::placeholder {
                    color: #fff !important;
                    opacity: 1;
                  }
                `}</style>
              </Tab.Panel>
              <Tab.Panel>
                <label className="block mb-2 font-medium text-black">Upload Document (PDF/DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full mb-4 file-black-outline"
                  onChange={e => setDocFile(e.target.files?.[0] || null)}
                  style={{ color: 'black', background: '#fff', border: '1.5px solid #000' }}
                />
                {docFile && <div className="text-sm text-gray-600">Selected: {docFile.name}</div>}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={classNames(
                'px-4 py-2 rounded text-white',
                tabIdx === 0
                  ? videoUrl
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-300 cursor-not-allowed'
                  : docFile
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-indigo-300 cursor-not-allowed'
              )}
              onClick={handleSave}
              disabled={tabIdx === 0 ? !videoUrl : !docFile}
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddContentModal; 