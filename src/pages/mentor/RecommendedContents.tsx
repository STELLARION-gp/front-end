import React, { useEffect, useMemo, useState } from 'react';
import ContentModal from '../../components/mentor/ContentModal';
import AddContentModal from '../../components/mentor/AddContentModal';
import { PlusIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import '../../styles/pages/mentor/recommendedContents.scss';
import { apiService } from '../../services/api';

type ApiListResponse<T> = { success: boolean; message: string; data: { items: T[]; pagination?: any } };
type ApiItemResponse<T> = { success: boolean; message: string; data: T };

interface ContentItem {
  id: number;
  title: string;
  description?: string | null;
  source_type: 'youtube' | 'pdf';
  url: string;
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? match[1] : '';
}

const initialItems: ContentItem[] = [];

const RecommendedContents: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [tab, setTab] = useState<'videos' | 'documents'>('videos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handlePlay = (url: string) => {
    setSelectedVideoId(getYoutubeId(url));
    setModalOpen(true);
  };

  // fetch items on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = (await apiService.listRecommendedContents()) as unknown as ApiListResponse<ContentItem>;
        const fetched: ContentItem[] = res?.data?.items || [];
        if (mounted) setItems(fetched);
      } catch (e) {
        console.error('Failed to load recommended contents', e);
        const msg = e instanceof Error ? e.message : 'Failed to load recommended contents';
        if (mounted) setError(msg);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const videos = useMemo(() => items.filter(i => i.source_type === 'youtube'), [items]);
  const docs = useMemo(() => items.filter(i => i.source_type === 'pdf'), [items]);

  const handleAddVideo = async (data: { url: string; title: string; description?: string }) => {
    try {
      setActionError(null);
      const res = (await apiService.createRecommendedYouTube({ title: data.title, url: data.url, description: data.description })) as unknown as ApiItemResponse<ContentItem>;
      const created: ContentItem | undefined = res?.data;
      if (created) setItems(prev => [created, ...prev]);
    } catch (e) {
      console.error('Failed to add YouTube content', e);
      setActionError(e instanceof Error ? e.message : 'Failed to add YouTube content');
    }
  };

  const handleAddDocument = async (data: { file: File; title: string; description?: string }) => {
    try {
      setActionError(null);
      const res = (await apiService.uploadRecommendedPdf(data.file, data.title, data.description)) as unknown as ApiItemResponse<ContentItem>;
      const created: ContentItem | undefined = res?.data;
      if (created) setItems(prev => [created, ...prev]);
    } catch (e) {
      console.error('Failed to upload PDF', e);
      setActionError(e instanceof Error ? e.message : 'Failed to upload PDF');
    }
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
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-2 mb-3">
          {error}
        </div>
      )}
      {actionError && (
        <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded p-2 mb-3">
          {actionError}
        </div>
      )}
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
        {loading && (
          <div className="text-gray-400 text-sm mb-2">Loading...</div>
        )}
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
                <span className="doc-title">{doc.title}</span>
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