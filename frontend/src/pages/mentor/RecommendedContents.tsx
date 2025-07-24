import React, { useState } from 'react';
import ContentModal from '../../components/mentor/ContentModal';
import AddContentModal from '../../components/mentor/AddContentModal';
import { PlusIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import '../../styles/pages/mentor/recommendedContents.scss';

interface VideoContent {
  id: number;
  url: string;
  title: string;
}

interface DocumentContent {
  id: number;
  name: string;
  url: string;
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? match[1] : '';
}

const initialVideos: VideoContent[] = [
  {
    id: 1,
    url: 'https://www.youtube.com/watch?v=0rHUDWjR5gg',
    title: 'Introduction to Astronomy',
  },
  {
    id: 2,
    url: 'https://www.youtube.com/watch?v=L-Wtlev6suc',
    title: 'Observational Techniques in Astronomy',
  },
];

const initialDocs: DocumentContent[] = [
  {
    id: 1,
    name: 'Mentor Handbook.pdf',
    url: '/docs/mentor-handbook.pdf',
  },
  {
    id: 2,
    name: 'Session Checklist.docx',
    url: '/docs/session-checklist.docx',
  },
];

const RecommendedContents: React.FC = () => {
  const [videos, setVideos] = useState<VideoContent[]>(initialVideos);
  const [docs, setDocs] = useState<DocumentContent[]>(initialDocs);
  const [tab, setTab] = useState<'videos' | 'documents'>('videos');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handlePlay = (url: string) => {
    setSelectedVideoId(getYoutubeId(url));
    setModalOpen(true);
  };

  const handleAddVideo = (url: string) => {
    setVideos(vs => [
      ...vs,
      { id: Date.now(), url, title: 'New Video' },
    ]);
  };

  const handleAddDocument = (file: File) => {
    setDocs(ds => [
      ...ds,
      { id: Date.now(), name: file.name, url: URL.createObjectURL(file) },
    ]);
  };

  return (
    <div className="recommended-contents-page">
      <div className="recommended-contents-header">
        <h2>Recommended Contents</h2>
        <button
          className="add-content-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <PlusIcon className="icon" />
          Add Content
        </button>
      </div>
      <div className="recommended-contents-tabs">
        <button
          className={`tab-btn${tab === 'videos' ? ' active' : ''}`}
          onClick={() => setTab('videos')}
        >
          Videos
        </button>
        <button
          className={`tab-btn${tab === 'documents' ? ' active' : ''}`}
          onClick={() => setTab('documents')}
        >
          Documents
        </button>
      </div>
      <div className="recommended-contents-tabpanel">
        {tab === 'videos' ? (
          <div className="video-list">
            {videos.map(video => (
              <div
                key={video.id}
                className="video-thumb"
                onClick={() => handlePlay(video.url)}
              >
                <img
                  src={`https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`}
                  alt={video.title}
                  className="video-img"
                />
                <div className="video-overlay">
                  <PlayIcon className="play-icon" />
                  <span className="video-title">{video.title}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="doc-list">
            {docs.map(doc => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-link"
              >
                <DocumentTextIcon className="doc-icon" />
                <span className="doc-title">{doc.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
      <ContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        youtubeId={selectedVideoId}
      />
      <AddContentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddVideo={handleAddVideo}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
};

export default RecommendedContents; 