import React from 'react';
import { listTours, deleteTour, updateTour } from '../../services/apiTours';
import type { TourRecord } from '../../services/apiTours';

const GuideMediaDashboard: React.FC = () => {
  const [tours, setTours] = React.useState<TourRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState({ tour_name: '', description: '', location: '', tags: '' });
  const [msg, setMsg] = React.useState<{type:'success'|'error'; text:string}|null>(null);

  React.useEffect(()=>{ (async()=>{ try{ const data = await listTours(); setTours(data.tours||[]);} catch(e){ setError(e instanceof Error? e.message:'Failed to load'); } finally { setLoading(false);} })(); },[]);

  const beginEdit = (t:TourRecord)=>{ setEditingId(t.tour_id); setEditForm({ tour_name:t.tour_name, description:t.description, location:t.location, tags:t.tags||'' }); };
  const cancel = ()=> setEditingId(null);
  const save = async(id:number)=>{ try{ await updateTour(id, editForm); setTours(p=>p.map(t=>t.tour_id===id?{...t,...editForm}:t)); setMsg({type:'success',text:'Updated'}); setEditingId(null);}catch(e){ setMsg({type:'error',text: e instanceof Error? e.message:'Update failed'});} finally { setTimeout(()=>setMsg(null),2500);} };
  const remove = async(id:number)=>{ if(!confirm('Delete tour?')) return; try{ await deleteTour(id); setTours(p=>p.filter(t=>t.tour_id!==id)); setMsg({type:'success',text:'Deleted'});}catch(e){ setMsg({type:'error',text: e instanceof Error? e.message:'Delete failed'});} finally { setTimeout(()=>setMsg(null),2500);} };

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading tours...</div>;
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tours</h2>
        {msg && <span className={`text-sm ${msg.type==='success'?'text-green-500':'text-red-500'}`}>{msg.text}</span>}
      </div>
      {tours.length===0 && <p className="text-sm text-gray-400">No tours yet.</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tours.map(t=> (
          <div key={t.tour_id} className="bg-white/5 border border-white/10 rounded p-4 flex flex-col gap-3">
            {editingId===t.tour_id ? (
              <>
                <input aria-label="Tour name" placeholder="Tour name" className="border rounded px-2 py-1 bg-white/5" value={editForm.tour_name} onChange={e=>setEditForm(f=>({...f,tour_name:e.target.value}))} />
                <textarea aria-label="Description" placeholder="Description" className="border rounded px-2 py-1 bg-white/5 text-xs" value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} />
                <input aria-label="Location" placeholder="Location" className="border rounded px-2 py-1 bg-white/5" value={editForm.location} onChange={e=>setEditForm(f=>({...f,location:e.target.value}))} />
                <input className="border rounded px-2 py-1 bg-white/5" value={editForm.tags} onChange={e=>setEditForm(f=>({...f,tags:e.target.value}))} placeholder="tags" />
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>save(t.tour_id)} className="px-3 py-1 text-xs rounded bg-green-600 text-white">Save</button>
                  <button onClick={cancel} className="px-3 py-1 text-xs rounded bg-gray-600 text-white">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-medium text-sm">{t.tour_name}</h3>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
                <p className="text-xs whitespace-pre-wrap text-gray-300 line-clamp-5">{t.description}</p>
                {!!t.media?.length && <div className="flex gap-2 flex-wrap">
                  {t.media.slice(0,4).map(m=> <img key={m.id} src={m.file_path} alt={m.file_name} className="w-20 h-16 object-cover rounded" />)}
                </div>}
                <div className="flex gap-2 mt-auto pt-2">
                  <button onClick={()=>beginEdit(t)} className="px-3 py-1 text-xs rounded bg-indigo-600 text-white">Edit</button>
                  <button onClick={()=>remove(t.tour_id)} className="px-3 py-1 text-xs rounded bg-red-600 text-white">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideMediaDashboard;