import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/learner/PollDetailsPopup.scss";
import Button from "../Button";
import pollService, { type PollComment } from "../../services/pollService";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  pollId: number; // Changed from passing comments to passing poll ID
  title: string;
  description: string;
  options: PollOption[];
  author: string;
  authorPic: string;
  createdAt: string;
  conductor: string;
  conductorPic: string;
}

const PollDetailsPopup: React.FC<PollDetailsPopupProps> = ({
  open,
  onClose,
  pollId,
  title,
  description,
  options,
  author,
  authorPic,
  createdAt,
}) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<PollComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Fetch comments when popup opens
  useEffect(() => {
    if (open && pollId) {
      fetchComments();
    }
  }, [open, pollId]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      setCommentError(null);
      const response = await pollService.getPollComments(pollId, {
        page: 1,
        limit: 50,
        sort_order: 'desc'
      });
      setComments(response.data);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setCommentError('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }

    try {
      setPostingComment(true);
      setCommentError(null);
      await pollService.addComment(pollId, commentText.trim());
      setCommentText('');
      
      // Refresh comments after posting
      await fetchComments();
    } catch (err: any) {
      console.error('Error posting comment:', err);
      setCommentError(err.message || 'Failed to post comment. Please make sure you are logged in.');
    } finally {
      setPostingComment(false);
    }
  };

  if (!open) return null;
  return (
    <div className="poll-details-popup-backdrop" onClick={onClose}>
      <div className="poll-details-popup" onClick={e => e.stopPropagation()}>
        <button className="poll-details-close" onClick={onClose}>&times;</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 12 }}>
          <img className="poll-author-avatar" src={authorPic} alt={author} style={{ width: 40, height: 40 }} />
          <div>
            <h2 className="poll-details-title" style={{ margin: 0 }}>{title}</h2>
            <div className="poll-details-meta">
              <span>
                Created by <b style={{ cursor: 'pointer', color: '#60a5fa' }}
                  onClick={() => navigate(`/dashboard/author/${encodeURIComponent(author)}`)}
                >{author}</b> on {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="poll-details-description">{description}</div>
        <div className="poll-details-options">
          {options.map(opt => (
            <div className="poll-details-option" key={opt.id}>
              <span className="poll-details-option-text">{opt.text}</span>
              <span className="poll-details-option-votes">{opt.votes} votes</span>
            </div>
          ))}
        </div>
        {/* <div className="poll-details-organizer">
          <img className="poll-details-conductor-pic" src={conductorPic} alt={conductor} />
          <span className="poll-details-conductor-name">Organizer: {conductor}</span>
        </div> */}
        <div className="poll-details-comments-section">
          <h4>Comments ({comments.length})</h4>
          
          {commentError && (
            <div className="comment-error" style={{ color: '#ef4444', padding: '0.5rem', marginBottom: '0.5rem' }}>
              {commentError}
            </div>
          )}
          
          <div className="poll-details-comments-list">
            {loadingComments ? (
              <div className="poll-details-no-comments">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="poll-details-no-comments">No comments yet. Be the first to comment!</div>
            ) : (
              comments.map(comment => {
                const commentAuthor = comment.commenter.display_name || 
                  `${comment.commenter.first_name || ''} ${comment.commenter.last_name || ''}`.trim() || 
                  'Anonymous';
                
                return (
                  <div className="poll-details-comment" key={comment.id}>
                    <span className="poll-details-comment-author">{commentAuthor}</span>
                    <span className="poll-details-comment-date">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <div className="poll-details-comment-text">{comment.comment}</div>
                  </div>
                );
              })
            )}
          </div>
          
          <form className="poll-details-comment-form" onSubmit={handlePostComment}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="poll-details-comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={postingComment}
            />
            <Button type="submit" disabled={postingComment || !commentText.trim()}>
              {postingComment ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PollDetailsPopup;
