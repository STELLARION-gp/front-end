import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/pages/learner/BlogPage.scss";
import Button from "../../components/Button";
import { ArrowDownTrayIcon, HeartIcon } from "@heroicons/react/24/outline";
import { blogService, type BlogComment } from "../../services/blogService";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface Blog {
  id?: number;
  title: string;
  author?: string;
  createdAt?: string;
  image?: string;
  content?: string;
}

interface BlogDetailedPageProps {
  blog: Blog;
  comments?: BlogComment[];
}

const BlogDetailedPage: React.FC<BlogDetailedPageProps> = ({ blog, comments: initialComments = [] }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [isFavorite, setIsFavorite] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    try {
  // Build a clean, off-screen container with a predictable layout: Title -> Author -> Image -> Content
  const temp = document.createElement('div');
  // A4 at 72pt (points) maps to ~595x842pt; we use pixels width that gives good quality for html2canvas.
  // 595pt * 96/72 = ~793px. Use 794px which usually maps well for A4 rendering.
  temp.style.width = '794px';
  temp.style.padding = '20px';
  temp.style.boxSizing = 'border-box';
  temp.style.background = '#ffffff';
  temp.style.color = '#000000';
  temp.style.position = 'fixed';
  temp.style.left = '-10000px';
  temp.style.top = '0';
  temp.style.zIndex = '9999';

  // Compose HTML with clear structure and simple inline styles so rendering is stable.
  const safeTitle = blog.title ? String(blog.title) : '';
  const safeAuthor = blog.author ? String(blog.author) : 'Unknown';

  // larger image area for PDF: use a tall container and constrain image to fit while keeping aspect ratio
  const imageHtml = blog.image ? `<div style="text-align:center;margin:18px 0;height:480px;display:flex;align-items:center;justify-content:center;overflow:hidden;"><img src="${String(blog.image)}" class="pdf-image" style="width:100%;height:auto;max-height:480px;object-fit:contain;display:block;margin:0 auto;" /></div>` : '';

  // Keep blog.content as HTML if present. If it's plain text, escape it to preserve formatting.
  const contentHtml = blog.content || '';

      temp.innerHTML = `
        <div style="font-family: Arial, Helvetica, sans-serif; color:#000;">
          <style>
            .pdf-blog-content { font-size:18px; line-height:1.6; color:#111; }
            .pdf-blog-content a { color: #0b5cff; text-decoration: underline; }
            .pdf-image { width:100%; height:auto; max-height:480px; object-fit:contain; }
          </style>
          <h1 style="font-size:34px;margin:0 0 8px 0;line-height:1.05;color:#0b3d91">${safeTitle}</h1>
          <div style="font-size:14px;color:#444;margin-bottom:12px">By <strong>${safeAuthor}</strong> ${blog.createdAt ? `• ${new Date(String(blog.createdAt)).toLocaleDateString()}` : ''}</div>
          ${imageHtml}
          <div class="pdf-blog-content">${contentHtml}</div>
        </div>
      `;

  document.body.appendChild(temp);

  // Render the off-screen container to canvas at higher scale for crisp output.
  const canvas = await html2canvas(temp, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // compute image width in PDF points (leave 40pt margin)
  const pdfImgWidth = pageWidth - 40;

  // Convert the full canvas into one or more PDF pages by slicing vertically.
      const pxFullWidth = canvas.width;
  const pxFullHeight = canvas.height;

  // pixels per PDF point ratio (px / pt)
  const pxPerPt = pxFullWidth / pdfImgWidth;

  let srcY = 0;
  const filename = `${(safeTitle || 'blog').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

  // get bounding rect of temp so we can map anchor positions to the canvas
  const tempRect = temp.getBoundingClientRect();

      let pageIndex = 0;
      while (srcY < pxFullHeight) {
    const pageHeightPx = Math.min(pxFullHeight - srcY, Math.floor(pageHeight * pxPerPt));
    const canvasPage = document.createElement('canvas');
    canvasPage.width = pxFullWidth;
    canvasPage.height = pageHeightPx;

    const ctx = canvasPage.getContext('2d');
    if (ctx) ctx.drawImage(canvas, 0, srcY, canvasPage.width, canvasPage.height, 0, 0, canvasPage.width, canvasPage.height);

  const pageData = canvasPage.toDataURL('image/jpeg', 0.92);
  const imgHeightInPt = (canvasPage.height / pxPerPt);
  const x = 20; // left margin in points
  const y = 40; // top margin in points (leave space for optional header)
  pdf.addImage(pageData, 'JPEG', x, y, pdfImgWidth, imgHeightInPt);

  // Footer: page number centered at bottom
  const footerText = `Page ${pageIndex + 1}`;
  pdf.setFontSize(10);
  pdf.setTextColor(120);
  const footerWidth = (pdf.getStringUnitWidth(footerText) * pdf.getFontSize()) / pdf.internal.scaleFactor;
  const footerX = (pageWidth - footerWidth) / 2;
  const footerY = pageHeight - 20;
  pdf.text(footerText, footerX, footerY);

  // Convert anchors into PDF link annotations for anything visible on this page
    const anchors = Array.from(temp.querySelectorAll('a')) as HTMLAnchorElement[];
    anchors.forEach((a) => {
      try {
    const r = a.getBoundingClientRect();
    // compute position relative to temp
    const relTop = r.top - tempRect.top; // px
    const relLeft = r.left - tempRect.left; // px

    // check if this anchor is inside the current page slice (srcY .. srcY + canvasPage.height)
    if (relTop + r.height < srcY || relTop > srcY + canvasPage.height) return; // not on this slice

    // compute overlap rectangle clipped to this slice
    const clipTop = Math.max(relTop, srcY);
    const clipBottom = Math.min(relTop + r.height, srcY + canvasPage.height);
    const clipHeight = clipBottom - clipTop;

    const xInPt = x + (relLeft / pxPerPt);
    const yInPt = y + ((clipTop - srcY) / pxPerPt);
    const wInPt = (r.width / pxPerPt);
    const hInPt = (clipHeight / pxPerPt);

            if (wInPt > 0 && hInPt > 0) {
      // add clickable link annotation
      // jsPDF.link(x, y, w, h, { url })
              (pdf as any).link(xInPt, yInPt, wInPt, hInPt, { url: a.href });
    }
      } catch (err) {
    // continue on errors for any single anchor
      }
    });

    srcY += canvasPage.height;
    if (srcY < pxFullHeight) pdf.addPage();
  }

  pdf.save(filename);

  // cleanup temp container
  document.body.removeChild(temp);
    } catch (err) {
  console.error('Failed to generate PDF', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog?.id) return;

    try {
      const createReq = { content: comment } as any;
      const resp: any = await blogService.addBlogComment(blog.id, createReq);
      // Try to extract created comment
      const created = resp?.data || resp?.comment || resp;
      setComments(prev => [...prev, created]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setComment("");
      setRating(0);
      setHovered(0);
    } catch (err) {
      console.error('Failed to submit comment', err);
      // fallback: append locally
      setComments(prev => [...prev, {
        id: prev.length + 1,
        blog_id: blog.id as number,
        user_id: 0,
        content: comment,
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_display_name: 'You'
      } as BlogComment]);
      setComment("");
    }
  };

  // compute author avatar with sensible fallbacks
  const authorName = String((blog as any).author || (blog as any).author_display_name || '');
  const authorAvatar =
    (blog as any).author_avatar ||
    (blog as any).author_image ||
    (blog as any).author_profile_image ||
    (blog as any).metadata?.author_avatar ||
    // fallback to ui-avatars service which generates an initials avatar
    (authorName && `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=333&color=fff&rounded=true&size=128`) ||
    'https://www.gravatar.com/avatar/?d=mp';

  return (
    <div className="blog-page">
      <header className="blog-header">
        <Button onClick={() => navigate(-1)}>
          &#8592; Back
        </Button>
        <h1  style={{ marginTop: "1rem" }} className="blog-title">{blog.title}</h1>
        <div className="blog-header-row">
          <div className="blog-meta">
            <span className="blog-author">
              <img
                src={authorAvatar}
                alt="Author profile"
                className="blog-author-avatar"
              />
              <Link
                to={`/dashboard/author/${encodeURIComponent(String(blog.author || ''))}`}
                className="blog-author-link"
              >
                {blog.author || 'Unknown'}
              </Link>
            </span>
            <span className="blog-date">
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="blog-header-actions">
            <button
              className="blog-header-icon"
              onClick={handleDownload}
              title="Download blog"
            >
              <ArrowDownTrayIcon className="icon-svg" />
            </button>
            <button
              className={`blog-header-icon${
                isFavorite ? " favourite" : ""
              }`}
              onClick={() => setIsFavorite((fav) => !fav)}
              title="Add to favourites"
            >
              <HeartIcon className="icon-svg" />
            </button>
          </div>
        </div>
      </header>
      <div className="blog-main">
        <div className="blog-left" ref={contentRef}>
          {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
          <article className="blog-content">{blog.content}</article>
        </div>

        <aside className="blog-right">
          <section className="blog-comments-section">
        <h3>Comments</h3>
        <div className="blog-comments-list">
          {comments.map((c) => (
            <div className="blog-comment" key={c.id}>
              <img
                src={(c as any).avatar || 'https://www.gravatar.com/avatar/?d=mp'}
                alt={(c as any).user_display_name || (c as any).user_name || 'Commenter'}
                className="blog-comment-avatar"
              />
              <div className="blog-comment-body">
                <div className="blog-comment-meta">
                  <span className="blog-comment-author">{(c as any).user_display_name || (c as any).user_name || 'Anonymous'}</span>
                  <span className="blog-comment-date">
                    {new Date((c as any).created_at || (c as any).createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="blog-comment-text">{(c as any).content || (c as any).text}</div>
              </div>
            </div>
          ))}
        </div>
          </section>

          <section style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: 8 }}>Leave a Comment</h3>
            <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            className="comment-textarea"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`blograting-star ${
                  (hovered || rating) >= star ? "selected" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                role="button"
                aria-label={`Rate ${star} star${
                  star > 1 ? "s" : ""
                }`}
                tabIndex={0}
              >
                &#9733;
              </span>
            ))}
            <span
              style={{
                marginLeft: 8,
                color: "#fbbf24",
                fontWeight: 600,
              }}
            >
              {rating > 0 ? rating : null}
            </span>
          </div>
          <Button type="submit">
            {submitted ? "Submitted!" : "Submit"}
          </Button>
        </form>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailedPage;
