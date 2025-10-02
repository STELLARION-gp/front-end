import { auth } from '../firebase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function getAuthHeader(force?: boolean) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken(!!force);
  return { Authorization: `Bearer ${token}` };
}

// Frontend payload (camelCase)
export interface EventPayload {
  eventName: string;
  societyName: string;
  description: string;
  visibility: 'public'|'private'|'members-only';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  eventCategory: string;
  neededVolunteers?: number | '';
  organizedBy: string;
  maxParticipants?: number | '';
  eventStatus: 'draft'|'organized'|'finalized';
  images?: File[];
  imageUrls?: string[]; // for future editing
  priority?: 'low'|'medium'|'high'|'critical';
}

// Backend record (snake_case fields)
export interface EventRecord {
  id: number;
  event_name: string;
  society_name: string;
  description: string;
  visibility: string;
  date: string;
  time: string;
  location: string;
  event_category: string;
  needed_volunteers_count?: number;
  organized_by: string;
  max_participants?: number;
  event_status: string;
  image_urls?: string[];
  created_at?: string;
  status?: 'pending'|'approved'|'rejected';
  created_by?: number;
  moderated_by?: number|null;
}

export interface PlatformEventMapped {
  id: string;
  eventName: string;
  societyName: string;
  date: string;
  time: string;
  location: string;
  eventCategory: string;
  neededVolunteers: number;
  description: string;
  organizedBy: string;
  imageUrls: string[];
  maxParticipants: number;
  eventStatus: string;
  created_at: string;
  status: 'pending'|'approved'|'rejected';
  created_by?: number;
  moderated_by?: number|null;
  priority: 'low'|'medium'|'high'|'critical';
  reportCount: number;
}

function buildFormData(data: Partial<EventPayload>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k,v]) => {
    if (v === undefined || v === null || v === '') return;
    if (k === 'images' && Array.isArray(v)) {
      v.forEach(f => fd.append('images', f));
    } else if (k === 'imageUrls' && Array.isArray(v)) {
      v.forEach(url => fd.append('imageUrls', url));
    } else {
      fd.append(k, String(v));
    }
  });
  return fd;
}

function mapEvent(e: EventRecord): PlatformEventMapped {
  return {
    id: e.id.toString(),
    eventName: e.event_name,
    societyName: e.society_name,
    date: e.date,
    time: e.time,
    location: e.location,
    eventCategory: e.event_category,
    neededVolunteers: e.needed_volunteers_count || 0,
    description: e.description,
    organizedBy: e.organized_by,
    imageUrls: e.image_urls || [],
    maxParticipants: e.max_participants || 0,
    eventStatus: e.event_status,
    created_at: e.created_at || '',
    status: e.status || 'pending',
    created_by: e.created_by,
    moderated_by: e.moderated_by ?? null,
    priority: 'medium',
    reportCount: 0
  };
}

export async function createEvent(payload: EventPayload): Promise<PlatformEventMapped> {
  const authHeader = await getAuthHeader();
  const hasFiles = !!(payload.images && payload.images.length);
  let res: Response;
  try {
    if (hasFiles) {
      const body = buildFormData(payload);
      if (import.meta.env.DEV) console.debug('[createEvent] multipart fields:', Array.from(body.keys()));
      res = await fetch(`${API_BASE}/events`, { method:'POST', headers: authHeader, body });
    } else {
      const rest: Partial<EventPayload> = { ...payload };
      delete rest.images;
      delete rest.imageUrls;
      if (!rest.priority) rest.priority = 'medium';
      if (import.meta.env.DEV) console.debug('[createEvent] json payload:', rest);
      res = await fetch(`${API_BASE}/events`, { method:'POST', headers: { ...authHeader, 'Content-Type':'application/json' }, body: JSON.stringify(rest) });
    }
  } catch {
    throw new Error('Network error creating event');
  }

  let json: unknown = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { json = await res.json(); } catch {/* ignore */}
  } else {
    const text = await res.text();
    json = { success:false, message:text };
  }

  interface JsonShape { success?: boolean; message?: string; error?: string; event?: EventRecord }
  const j = json as JsonShape;
  if(!res.ok || j.success === false) {
    const msg = j.message || j.error || `Failed to create event (status ${res.status})`;
    throw new Error(msg);
  }
  if(!j.event) throw new Error('Malformed response: missing event');
  return mapEvent(j.event);
}

export async function listEvents() {
  const res = await fetch(`${API_BASE}/events`);
  return res.json(); // caller maps each item
}

export async function getEvent(id: number) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  return res.json();
}

export async function updateEvent(id: number, data: Partial<EventPayload>) {
  const headers = await getAuthHeader();
  const body = buildFormData(data);
  const res = await fetch(`${API_BASE}/events/${id}`, { method:'PUT', headers, body });
  const json = await res.json();
  if(!res.ok || json.success === false) throw new Error(json.message || 'Failed to update event');
  return json;
}

export async function deleteEvent(id: number) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/events/${id}`, { method:'DELETE', headers });
  const json = await res.json();
  if(!res.ok || json.success === false) throw new Error(json.message || 'Failed to delete event');
  return json;
}

export async function moderateEvent(id: number, action: 'approve'|'reject') {
  const headers = { ...(await getAuthHeader()), 'Content-Type':'application/json' };
  const res = await fetch(`${API_BASE}/events/${id}/status`, { method:'PUT', headers, body: JSON.stringify({ action }) });
  const json = await res.json();
  if(!res.ok || json.success === false) throw new Error(json.message || 'Failed to moderate event');
  return json;
}

export function mapBackendEvent(e: unknown) {
  const obj = e as Record<string, unknown>;
  const pick = <T>(k: string) => obj[k] as T;
  return {
    id: String(pick('id')),
    eventName: pick<string>('event_name'),
    societyName: pick<string>('society_name'),
    date: (pick<string>('date')||'').split('T')[0],
    time: pick<string>('time'),
    location: pick<string>('location'),
    eventCategory: pick<string>('event_category'),
    neededVolunteers: pick<number>('needed_volunteers_count') || 0,
    description: pick<string>('description'),
    organizedBy: pick<string>('organized_by'),
    imageUrls: pick<string[]>('image_urls') || [],
    maxParticipants: pick<number>('max_participants') || 0,
    eventStatus: pick<string>('event_status'),
    created_at: pick<string>('created_at'),
    status: (pick<'pending'|'approved'|'rejected'>('status')) || 'pending',
    priority: 'medium',
    reportCount: 0,
    created_by: pick<number>('created_by'),
    moderated_by: pick<number>('moderated_by')
  } as PlatformEventMapped;
}
