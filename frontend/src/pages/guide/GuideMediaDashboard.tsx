import React from 'react';
import { listTours, deleteTour, updateTour } from '../../services/apiTours';
import type { TourRecord, MediaUpload } from '../../services/apiTours';

interface SliderState { index: number; }

const GuideMediaDashboard: React.FC = () => {
  const [tours, setTours] = React.useState<TourRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState({ tour_name: '', description: '', location: '', tags: '' });
  const [msg, setMsg] = React.useState<{type:'success'|'error'; text:string}|null>(null);
  const [viewer, setViewer] = React.useState<{tourId:number; media:MediaUpload[]; start:number}|null>(null);
  const [sliderPositions, setSliderPositions] = React.useState<Record<number, SliderState>>({});

  React.useEffect(()=>{ (async()=>{ try{ const data = await listTours(); const list:TourRecord[] = data.tours||[]; setTours(list); const init:Record<number,SliderState>={}; list.forEach(t=>init[t.tour_id]={index:0}); setSliderPositions(init);} catch(e){ setError(e instanceof Error? e.message:'Failed to load'); } finally { setLoading(false);} })(); },[]);

  const beginEdit = (t:TourRecord)=>{ setEditingId(t.tour_id); setEditForm({ tour_name:t.tour_name, description:t.description, location:t.location, tags:t.tags||'' }); };
  const cancel = ()=> setEditingId(null);
  const save = async(id:number)=>{ try{ await updateTour(id, editForm); setTours(p=>p.map(t=>t.tour_id===id?{...t,...editForm}:t)); setMsg({type:'success',text:'Updated'}); setEditingId(null);}catch(e){ setMsg({type:'error',text: e instanceof Error? e.message:'Update failed'});} finally { setTimeout(()=>setMsg(null),2500);} };
  const remove = async(id:number)=>{ if(!confirm('Delete tour?')) return; try{ await deleteTour(id); setTours(p=>p.filter(t=>t.tour_id!==id)); setMsg({type:'success',text:'Deleted'});}catch(e){ setMsg({type:'error',text: e instanceof Error? e.message:'Delete failed'});} finally { setTimeout(()=>setMsg(null),2500);} };
  const openViewer = (tourId:number, media:MediaUpload[], start:number)=> setViewer({tourId, media, start});
  const closeViewer = ()=> setViewer(null);
  const nextSlide = (tourId:number, len:number)=> setSliderPositions(p=>{ const cur = p[tourId]?.index||0; return {...p, [tourId]:{index:(cur+1)%len}}});
  const prevSlide = (tourId:number, len:number)=> setSliderPositions(p=>{ const cur = p[tourId]?.index||0; return {...p, [tourId]:{index:(cur-1+len)%len}}});

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading tours...</div>;
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tours Feed</h2>
        {msg && <span className={`text-sm ${msg.type==='success'?'text-green-500':'text-red-500'}`}>{msg.text}</span>}
      </div>
      {tours.length===0 && <p className="text-sm text-gray-400">No tours yet.</p>}
      <div className="space-y-10">
        {tours.map(t=> {
          const sliderIndex = sliderPositions[t.tour_id]?.index||0;
          const media = t.media||[];
          return (
          <article key={t.tour_id} className="relative border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm shadow-md">
            <div className="p-5 flex flex-col gap-4">
              {editingId===t.tour_id ? (
                <div className="space-y-2">
                  <input aria-label="Tour name" placeholder="Tour name" className="w-full border rounded px-3 py-2 bg-white/10" value={editForm.tour_name} onChange={e=>setEditForm(f=>({...f,tour_name:e.target.value}))} />
                  <textarea aria-label="Description" placeholder="Description" className="w-full border rounded px-3 py-2 bg-white/10 text-sm" value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} />
                  <div className="grid grid-cols-2 gap-2">
                    <input aria-label="Location" placeholder="Location" className="border rounded px-3 py-2 bg-white/10" value={editForm.location} onChange={e=>setEditForm(f=>({...f,location:e.target.value}))} />
                    <input className="border rounded px-3 py-2 bg-white/10" value={editForm.tags} onChange={e=>setEditForm(f=>({...f,tags:e.target.value}))} placeholder="tags" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={()=>save(t.tour_id)} className="px-4 py-1.5 text-xs rounded bg-green-600 hover:bg-green-500 text-white">Save</button>
                    <button onClick={cancel} className="px-4 py-1.5 text-xs rounded bg-gray-600 hover:bg-gray-500 text-white">Cancel</button>
                  </div>
                </div>
              ) : (
                <header className="space-y-1">
                  <h3 className="text-lg font-semibold leading-tight">{t.tour_name}</h3>
                  <p className="text-xs uppercase tracking-wide text-indigo-300">{t.location}</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{t.description}</p>
                  {t.tags && <p className="text-[10px] text-indigo-200/70">{t.tags.split(',').map(s=>s.trim()).filter(Boolean).map(tag=> <span key={tag} className="inline-block mr-1 px-2 py-0.5 bg-indigo-600/30 rounded-full">#{tag}</span>)}</p>}
                </header>
              )}
              {media.length>0 && (
                <div className="relative group">
                  <div className="overflow-hidden rounded-md aspect-[4/3] bg-black/30">
                    {media.map((m,i)=> (
                      <img key={m.id} src={m.file_path} alt={m.file_name} onClick={()=>openViewer(t.tour_id, media, i)} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i===sliderIndex? 'opacity-100':'opacity-0'}`} />
                    ))}
                  </div>
                  {media.length>1 && (
                    <>
                      <button onClick={()=>prevSlide(t.tour_id, media.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">‹</button>
                      <button onClick={()=>nextSlide(t.tour_id, media.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">›</button>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {media.map((_,i)=>(<span key={i} onClick={()=>setSliderPositions(p=>({...p,[t.tour_id]:{index:i}}))} className={`w-2 h-2 rounded-full cursor-pointer ${i===sliderIndex?'bg-white':'bg-white/40'}`}></span>))}
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                {editingId===t.tour_id ? null : <button onClick={()=>beginEdit(t)} className="px-4 py-1.5 text-xs rounded bg-indigo-600 hover:bg-indigo-500 text-white">Edit Details</button>}
                <button onClick={()=>remove(t.tour_id)} className="px-4 py-1.5 text-xs rounded bg-red-600 hover:bg-red-500 text-white">Delete</button>
                {media.length>0 && <button onClick={()=>openViewer(t.tour_id, media, sliderIndex)} className="ml-auto px-4 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 text-white">Open</button>}
              </div>
            </div>
          </article>);
        })}
      </div>

      {viewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
          <div className="relative w-full max-w-4xl">
            <button onClick={closeViewer} className="absolute -top-10 right-0 text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded">Close</button>
            <div className="relative aspect-[16/9] bg-black/60 rounded overflow-hidden">
              {viewer.media.map((m,i)=>(
                <img key={m.id} src={m.file_path} alt={m.file_name} className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${i===viewer.start? 'opacity-100':'opacity-0'}`} />
              ))}
              {viewer.media.length>1 && (
                <>
                  <button onClick={()=>setViewer(v=> v? ({...v,start:(v.start-1+v.media.length)%v.media.length}):v)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full">‹</button>
                  <button onClick={()=>setViewer(v=> v? ({...v,start:(v.start+1)%v.media.length}):v)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full">›</button>
                </>
              )}
            </div>
            <div className="flex justify-center gap-1 mt-3">
              {viewer.media.map((m,i)=>(<button aria-label={`Go to image ${i+1}`} key={m.id} onClick={()=>setViewer(v=> v? ({...v,start:i}):v)} className={`w-3 h-3 rounded-full ${i===viewer.start?'bg-white':'bg-white/30'}`} />))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideMediaDashboard;