import React from "react";
import { listTours, deleteTour, updateTour } from "../../services/apiTours";
import type { TourRecord, MediaUpload } from "../../services/apiTours";
import Button from "../../components/Button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SliderState {
  index: number;
}

const GuideMediaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = React.useState<TourRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState({
    tour_name: "",
    description: "",
    location: "",
    tags: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error - msg is set but never read (potential future feature)
  const [msg, setMsg] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [viewer, setViewer] = React.useState<{
    tourId: number;
    media: MediaUpload[];
    start: number;
  } | null>(null);
  const [sliderPositions, setSliderPositions] = React.useState<
    Record<number, SliderState>
  >({});
  // Search & Filters
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<string>("");
  const [locationFilter, setLocationFilter] = React.useState<string>("");
  const [dateFilter, setDateFilter] = React.useState<"all" | "7" | "30">("all");

  React.useEffect(() => {
    (async () => {
      try {
        const data = await listTours();
        const list: TourRecord[] = data.tours || [];
        setTours(list);
        const init: Record<number, SliderState> = {};
        list.forEach((t) => (init[t.tour_id] = { index: 0 }));
        setSliderPositions(init);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const beginEdit = (t: TourRecord) => {
    setEditingId(t.tour_id);
    setEditForm({
      tour_name: t.tour_name,
      description: t.description,
      location: t.location,
      tags: t.tags || "",
    });
  };
  const cancel = () => setEditingId(null);
  const save = async (id: number) => {
    try {
      await updateTour(id, editForm);
      setTours((p) =>
        p.map((t) => (t.tour_id === id ? { ...t, ...editForm } : t))
      );
      setMsg({ type: "success", text: "Updated" });
      setEditingId(null);
    } catch (e) {
      setMsg({
        type: "error",
        text: e instanceof Error ? e.message : "Update failed",
      });
    } finally {
      setTimeout(() => setMsg(null), 2500);
    }
  };
  const remove = async (id: number) => {
    if (!confirm("Delete tour?")) return;
    try {
      await deleteTour(id);
      setTours((p) => p.filter((t) => t.tour_id !== id));
      setMsg({ type: "success", text: "Deleted" });
    } catch (e) {
      setMsg({
        type: "error",
        text: e instanceof Error ? e.message : "Delete failed",
      });
    } finally {
      setTimeout(() => setMsg(null), 2500);
    }
  };
  const openViewer = (tourId: number, media: MediaUpload[], start: number) =>
    setViewer({ tourId, media, start });
  const closeViewer = () => setViewer(null);
  const nextSlide = (tourId: number, len: number) =>
    setSliderPositions((p) => {
      const cur = p[tourId]?.index || 0;
      return { ...p, [tourId]: { index: (cur + 1) % len } };
    });
  const prevSlide = (tourId: number, len: number) =>
    setSliderPositions((p) => {
      const cur = p[tourId]?.index || 0;
      return { ...p, [tourId]: { index: (cur - 1 + len) % len } };
    });

  // Modal keyboard navigation
  React.useEffect(() => {
    if (!viewer) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight")
        setViewer((v) =>
          v ? { ...v, start: (v.start + 1) % v.media.length } : v
        );
      if (e.key === "ArrowLeft")
        setViewer((v) =>
          v
            ? { ...v, start: (v.start - 1 + v.media.length) % v.media.length }
            : v
        );
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewer]);

  // derive unique tags & locations (memoized)
  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    tours.forEach((t) =>
      (t.tags || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => s.add(x))
    );
    return Array.from(s).sort();
  }, [tours]);
  const allLocations = React.useMemo(() => {
    const s = new Set<string>();
    tours.forEach((t) => t.location && s.add(t.location));
    return Array.from(s).sort();
  }, [tours]);

  // debounce search input
  React.useEffect(() => {
    const id = setTimeout(
      () => setDebouncedSearch(search.trim().toLowerCase()),
      250
    );
    return () => clearTimeout(id);
  }, [search]);

  const filteredTours = React.useMemo(() => {
    return tours.filter((t) => {
      // search
      const hay = (t.tour_name + " " + t.description).toLowerCase();
      if (debouncedSearch && !hay.includes(debouncedSearch)) return false;
      // tag filter
      if (tagFilter) {
        const tagsArr = (t.tags || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        if (!tagsArr.includes(tagFilter.toLowerCase())) return false;
      }
      if (locationFilter && t.location !== locationFilter) return false;
      if (dateFilter !== "all" && t.created_at) {
        const days = parseInt(dateFilter, 10);
        const created = new Date(t.created_at).getTime();
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        if (created < cutoff) return false;
      }
      return true;
    });
  }, [tours, debouncedSearch, tagFilter, locationFilter, dateFilter]);

  if (loading)
    return <div className="p-6 text-sm text-gray-400">Loading tours...</div>;
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto flex flex-col gap-10">
      <div className="service-listing__header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Tours Feed</h1>
            <p className="page-subtitle">
              Discover, manage, and showcase every journey with style and
              detail.
            </p>
          </div>
          <div className="header-actions">
            <Button
              variant="secondary"
              size="medium"
              icon={<Upload />}
              iconPosition="left"
              onClick={() => navigate("/dashboard/media/upload")}
            >
              Upload Media
            </Button>
          </div>
        </div>
      </div>
      {/* Search + Filters */}
      <section className="flex flex-col gap-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours..."
              className="w-full rounded-lg bg-slate-900/40 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-300 placeholder:text-slate-400 backdrop-blur"
              aria-label="Search tours"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute top-1/2 -translate-y-1/2 right-2 text-xs text-white/60 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              aria-label="Filter by tag"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-lg bg-slate-900/40 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/60 min-w-[140px]"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-lg bg-slate-900/40 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/60 min-w-[140px]"
            >
              <option value="">All Locations</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value as "all" | "7" | "30")
              }
              className="rounded-lg bg-slate-900/40 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400/60 min-w-[120px]"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7d</option>
              <option value="30">Last 30d</option>
            </select>
            <button
              onClick={() => {
                setTagFilter("");
                setLocationFilter("");
                setDateFilter("all");
              }}
              className="text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-white/40">
          <span>
            {filteredTours.length} / {tours.length} visible
          </span>
          {debouncedSearch && (
            <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-indigo-200">
              search:"{debouncedSearch}"
            </span>
          )}
          {tagFilter && (
            <span className="px-2 py-0.5 bg-fuchsia-500/20 rounded-full text-fuchsia-200">
              #{tagFilter}
            </span>
          )}
          {locationFilter && (
            <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-emerald-200">
              {locationFilter}
            </span>
          )}
          {dateFilter !== "all" && (
            <span className="px-2 py-0.5 bg-sky-500/20 rounded-full text-sky-200">
              ≤ {dateFilter}d
            </span>
          )}
        </div>
      </section>
      {filteredTours.length === 0 && (
        <p className="text-sm text-gray-400">No tours match your filters.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12 auto-rows-fr">
        {filteredTours.map((t) => {
          const sliderIndex = sliderPositions[t.tour_id]?.index || 0;
          const media = t.media || [];
          return (
            <article
              key={t.tour_id}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/70 via-slate-800/40 to-slate-700/30 border border-white/10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] hover:border-indigo-400/40 flex flex-col h-full"
            >
              <div className="p-6 flex flex-col gap-5 flex-1">
                {editingId === t.tour_id ? (
                  <div className="space-y-3 animate-fadeIn">
                    <input
                      aria-label="Tour name"
                      placeholder="Tour name"
                      className="w-full rounded-md px-4 py-2.5 bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm"
                      value={editForm.tour_name}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          tour_name: e.target.value,
                        }))
                      }
                    />
                    <textarea
                      aria-label="Description"
                      placeholder="Description"
                      className="w-full rounded-md px-4 py-2.5 bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm min-h-[120px] resize-y"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        aria-label="Location"
                        placeholder="Location"
                        className="rounded-md px-4 py-2.5 bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            location: e.target.value,
                          }))
                        }
                      />
                      <input
                        className="rounded-md px-4 py-2.5 bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm"
                        value={editForm.tags}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, tags: e.target.value }))
                        }
                        placeholder="tags (comma separated)"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => save(t.tour_id)}
                        className="px-5 py-2 text-xs font-medium rounded-md bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow hover:from-emerald-400 hover:to-green-500 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancel}
                        className="px-5 py-2 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <header className="space-y-2">
                    <h3 className="text-xl font-semibold leading-tight tracking-tight text-white/90">
                      {t.tour_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 tracking-wide font-medium">
                        {t.location}
                      </span>
                      {t.created_at && (
                        <span className="text-[11px] text-white/40">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                      {t.description}
                    </p>
                    {t.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {t.tags
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600/40 to-fuchsia-600/40 text-indigo-100/90 border border-indigo-400/20"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </header>
                )}
                {media.length > 0 && (
                  <div className="relative group rounded-xl overflow-hidden">
                    <div className="overflow-hidden rounded-xl aspect-[16/9] bg-black/40">
                      {media.map((m, i) => (
                        <img
                          loading="lazy"
                          key={m.id}
                          src={m.file_path}
                          alt={m.file_name}
                          onClick={() => openViewer(t.tour_id, media, i)}
                          className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-700 ease-out ${
                            i === sliderIndex
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-105"
                          }`}
                        />
                      ))}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-80" />
                    </div>
                    {media.length > 1 && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() => prevSlide(t.tour_id, media.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() => nextSlide(t.tour_id, media.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-black/40 hover:bg-black/60 text-white px-3 py-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          ›
                        </button>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                          {media.map((_, i) => (
                            <button
                              aria-label={`Go to slide ${i + 1}`}
                              key={i}
                              onClick={() =>
                                setSliderPositions((p) => ({
                                  ...p,
                                  [t.tour_id]: { index: i },
                                }))
                              }
                              className={`w-2.5 h-2.5 rounded-full border border-white/40 transition ${
                                i === sliderIndex
                                  ? "bg-white"
                                  : "bg-white/20 hover:bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto border-t border-white/5">
                  {editingId === t.tour_id ? null : (
                    <button
                      onClick={() => beginEdit(t)}
                      className="group btn-edit px-4 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm transition hover:from-indigo-400 hover:to-violet-500 flex items-center gap-1.5"
                    >
                      {/* pen icon */}
                      <svg
                        className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                        <path d="M14.414 8.414L11.586 5.586 4 13.172V16h2.828l7.586-7.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => remove(t.tour_id)}
                    className="group px-4 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-sm transition hover:from-rose-400 hover:to-red-500 flex items-center gap-1.5"
                  >
                    {/* trash */}
                    <svg
                      className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099A1 1 0 019.228 2h1.543a1 1 0 01.97 1.099L11.5 4H16a1 1 0 010 2h-.278l-.76 9.121A2 2 0 0113.967 17H6.033a2 2 0 01-1.995-1.879L3.278 6H3a1 1 0 110-2h4.5l.757-0.901zM8 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Delete</span>
                  </button>
                  {media.length > 0 && (
                    <button
                      onClick={() => openViewer(t.tour_id, media, sliderIndex)}
                      className="group ml-auto px-4 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5"
                    >
                      {/* eye */}
                      <svg
                        className="w-4 h-4 opacity-80 group-hover:opacity-100"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                      <span>Viewer</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {viewer && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-fadeIn">
          <div
            className="mt-20 fixed inset-0 z-1000 flex items-center justify-center p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button - positioned top right but larger and always visible */}
            <button
              onClick={closeViewer}
              aria-label="Close viewer"
              className="absolute top-0 right-10 z-10 w-14 text-white text-lg p-3 rounded-md bg-red-800/20 hover:bg-red-700/55 backdrop-blur transition-all hover:scale-110 shadow-lg border border-white/10"
            >
              ✕
            </button>

            <div className="relative w-full max-w-6xl mx-auto">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-900/80 to-black/90 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {viewer.media.map((m, i) => (
                  <img
                    loading="lazy"
                    key={m.id}
                    src={m.file_path}
                    alt={m.file_name}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ease-in-out ${
                      i === viewer.start ? "opacity-100" : "opacity-0"
                    } select-none`}
                  />
                ))}

                {viewer.media.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      onClick={() =>
                        setViewer((v) =>
                          v
                            ? {
                                ...v,
                                start:
                                  (v.start - 1 + v.media.length) %
                                  v.media.length,
                              }
                            : v
                        )
                      }
                      className="absolute w-12 h-12 left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 transform group-hover:scale-125 transition-transform"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Previous</span>
                    </button>

                    <button
                      aria-label="Next image"
                      onClick={() =>
                        setViewer((v) =>
                          v
                            ? { ...v, start: (v.start + 1) % v.media.length }
                            : v
                        )
                      }
                      className="absolute w-12 h-12 right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 transform group-hover:scale-125 transition-transform"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Next</span>
                    </button>
                  </>
                )}
              </div>

              {/* Navigation dots - more stylish with animation */}
              <div className="flex justify-center gap-1 mb-3 mt-1">
                {viewer.media.map((m, i) => (
                  <button
                    aria-label={`Go to image ${i + 1}`}
                    key={m.id}
                    onClick={() =>
                      setViewer((v) => (v ? { ...v, start: i } : v))
                    }
                    className={`w-1 h-1 rounded-full ring-1 ring-white/40 transition-all duration-200 ${
                      i === viewer.start
                        ? "bg-white scale-60"
                        : "bg-white/30 hover:bg-white/50 scale-50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideMediaDashboard;
