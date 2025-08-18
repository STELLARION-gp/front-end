import axios, { AxiosError } from 'axios';
import { auth } from '../firebase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function getAuthHeader(force?: boolean) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken(!!force);
  return { Authorization: `Bearer ${token}` };
}

export interface TourMeta { tour_name: string; description: string; location: string; tags?: string; }
export interface TourRecord extends TourMeta { tour_id: number; media_ids: number[]; created_at?: string; updated_at?: string; media?: MediaUpload[] }
export interface MediaUpload { id: number; file_name: string; file_path: string; file_type: string; file_size: number; created_at?: string }

function logDebug(label: string, payload: unknown) {
  if (import.meta.env.DEV) {
    console.debug(`[apiTours] ${label}:`, payload);
  }
}

function buildMetaForm(form: FormData, meta: TourMeta) {
  Object.entries(meta).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'tags' && v.trim() === '') return; // don't send empty tags
    form.append(k, String(v));
  });
}

function extractAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
  const ax = err as AxiosError<unknown>;
    const status = ax.response?.status;
    const data = ax.response?.data as unknown;
    let serverMsg = '';
    if (data && typeof data === 'object') {
      const maybeMsg = (data as { message?: string }).message;
      const maybeErr = (data as { error?: string }).error;
      if (maybeMsg || maybeErr) serverMsg = `: ${maybeMsg || maybeErr}`;
    }
    throw new Error(`Upload failed${status ? ` (HTTP ${status})` : ''}${serverMsg}`);
  }
  throw err instanceof Error ? err : new Error('Unknown upload error');
}

export async function uploadSingleTour(file: File, meta: TourMeta) {
  try {
    const form = new FormData();
    buildMetaForm(form, meta);
    form.append('file', file);
    logDebug('uploadSingleTour meta', meta);
    logDebug('uploadSingleTour file', { name: file.name, size: file.size, type: file.type });
    const headers = await getAuthHeader();
    return (await axios.post(`${API_BASE}/tours/upload-single`, form, { headers })).data;
  } catch (e) {
    extractAxiosError(e);
  }
}

export async function uploadAlbumTour(files: File[], meta: TourMeta) {
  try {
    const form = new FormData();
    buildMetaForm(form, meta);
    files.forEach(f => form.append('files', f)); // verify backend expects 'files'
    logDebug('uploadAlbumTour meta', meta);
    logDebug('uploadAlbumTour files', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    const headers = await getAuthHeader();
    return (await axios.post(`${API_BASE}/tours/upload-album`, form, { headers })).data;
  } catch (e) {
    extractAxiosError(e);
  }
}

export async function listTours() {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/tours`, { headers }).then(r => r.data);
}

export async function getTour(id: number) {
  const headers = await getAuthHeader();
  return axios.get(`${API_BASE}/tours/${id}`, { headers }).then(r => r.data);
}

export async function updateTour(id: number, data: Partial<TourMeta>) {
  const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
  return axios.put(`${API_BASE}/tours/${id}`, data, { headers }).then(r => r.data);
}

export async function deleteTour(id: number) {
  const headers = await getAuthHeader();
  return axios.delete(`${API_BASE}/tours/${id}`, { headers }).then(r => r.data);
}
