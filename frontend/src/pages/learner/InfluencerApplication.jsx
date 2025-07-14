import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import styles from '../../styles/pages/GuideApplication.module.scss';

const InfluencerApplication = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        phone_number: '',
        country: '',
        bio: '',
        specialization_tags: [''],
        social_links: { youtube: '' },
        intro_video_url: '',
        sample_content_links: [''],
        preferred_session_format: '',
        willing_to_host_sessions: false,
        tools_used: [''],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle simple fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    // Handle array fields
    const handleArrayChange = (name, idx, value) => {
        setForm((prev) => {
            const arr = [...(prev[name] || [])];
            arr[idx] = value;
            return { ...prev, [name]: arr };
        });
    };
    const handleAddArrayItem = (name) => {
        setForm((prev) => ({ ...prev, [name]: [...(prev[name] || []), ''] }));
    };
    const handleRemoveArrayItem = (name, idx) => {
        setForm((prev) => {
            const arr = [...(prev[name] || [])];
            arr.splice(idx, 1);
            return { ...prev, [name]: arr };
        });
    };
    // Handle social_links object
    const handleSocialLinkChange = (platform, value) => {
        setForm((prev) => ({ ...prev, social_links: { ...prev.social_links, [platform]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // TODO: Add auth token
            const res = await fetch('/api/influencer-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.status === 201) {
                navigate('/dashboard/profile');
            } else {
                setError('Failed to submit application');
            }
        } catch (err) {
            setError('Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['guide-app-bg']}>
            <div className={styles['guide-app-container']}>
                <h2 className={styles['guide-app-title']}>Influencer Application</h2>
                <p className={styles['guide-app-desc']}>
                    Please fill out this form to apply as an Influencer. Provide accurate and complete information. All fields are required unless marked optional.
                </p>
                <form onSubmit={handleSubmit} className={styles['guide-app-form']}>
                    <InputField
                        label="Phone Number"
                        id="phone_number"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                    <InputField
                        label="Country"
                        id="country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Country"
                    />
                    <div>
                        <label className={styles['guide-label']}>Bio</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Bio"
                            className={styles['guide-textarea']}
                        />
                    </div>
                    <div>
                        <label className={styles['guide-label']}>Specialization Tags</label>
                        {form.specialization_tags.map((tag, idx) => (
                            <div key={idx} className={styles['guide-row']}>
                                <InputField
                                    label=""
                                    id={`specialization_tags_${idx}`}
                                    value={tag}
                                    onChange={e => handleArrayChange('specialization_tags', idx, e.target.value)}
                                    placeholder="Tag"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('specialization_tags', idx)}
                                    className={styles['guide-remove-btn']}
                                    aria-label="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('specialization_tags')} className={styles['guide-btn-link']}>Add Tag</button>
                    </div>
                    <div>
                        <label className={styles['guide-label']}>Social Links (YouTube)</label>
                        <InputField
                            label=""
                            id="youtube"
                            value={form.social_links.youtube}
                            onChange={e => handleSocialLinkChange('youtube', e.target.value)}
                            placeholder="YouTube URL"
                        />
                    </div>
                    <InputField
                        label="Intro Video URL"
                        id="intro_video_url"
                        name="intro_video_url"
                        value={form.intro_video_url}
                        onChange={handleChange}
                        placeholder="Intro Video URL"
                    />
                    <div>
                        <label className={styles['guide-label']}>Sample Content Links</label>
                        {form.sample_content_links.map((link, idx) => (
                            <div key={idx} className={styles['guide-row']}>
                                <InputField
                                    label=""
                                    id={`sample_content_links_${idx}`}
                                    value={link}
                                    onChange={e => handleArrayChange('sample_content_links', idx, e.target.value)}
                                    placeholder="URL"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('sample_content_links', idx)}
                                    className={styles['guide-remove-btn']}
                                    aria-label="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('sample_content_links')} className={styles['guide-btn-link']}>Add Link</button>
                    </div>
                    <div>
                        <label className={styles['guide-label']}>Preferred Session Format</label>
                        <select
                            name="preferred_session_format"
                            value={form.preferred_session_format}
                            onChange={handleChange}
                            className={styles['guide-select']}
                        >
                            <option value="">Select...</option>
                            <option value="Live">Live</option>
                            <option value="Recorded">Recorded</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className={styles['guide-label']}>Willing to Host Sessions</label>
                        <label className={styles['guide-checkbox-label']}>
                            <input
                                type="checkbox"
                                name="willing_to_host_sessions"
                                checked={form.willing_to_host_sessions}
                                onChange={e => setForm(prev => ({ ...prev, willing_to_host_sessions: e.target.checked }))}
                                className={styles['checkbox-input']}
                            />
                            <span>Yes</span>
                        </label>
                    </div>
                    <div>
                        <label className={styles['guide-label']}>Tools Used</label>
                        {form.tools_used.map((tool, idx) => (
                            <div key={idx} className={styles['guide-row']}>
                                <InputField
                                    label=""
                                    id={`tools_used_${idx}`}
                                    value={tool}
                                    onChange={e => handleArrayChange('tools_used', idx, e.target.value)}
                                    placeholder="Tool"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveArrayItem('tools_used', idx)}
                                    className={styles['guide-remove-btn']}
                                    aria-label="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddArrayItem('tools_used')} className={styles['guide-btn-link']}>Add Tool</button>
                    </div>
                    <div className={styles['guide-btn-row']}>
                        <Button type="submit" className={styles['guide-btn']} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button
                            type="button"
                            className={styles['guide-btn-secondary']}
                            variant="secondary"
                            onClick={() => navigate('/dashboard/profile')}
                        >
                            Cancel
                        </Button>
                    </div>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default InfluencerApplication;
