import React, { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/useI18n';

const MentorManagement = () => {
    const { t } = useI18n();
    const [mentors, setMentors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        phone_number: '',
        date_of_birth: '',
        country: '',
        profile_bio: '',
        educational_background: '',
        area_of_expertise: [''],
        linkedin_profile: '',
        intro_video_url: '',
        max_mentees: 3,
        availability_schedule: {},
        motivation_statement: '',
        portfolio_attachments: [''],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        setLoading(true);
        try {
            // TODO: Add auth token
            const res = await fetch('/api/mentor-applications');
            const data = await res.json();
            if (data.success) setMentors(data.data);
        } catch (err) {
            setError('Failed to load mentors');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // TODO: Add auth token
            const res = await fetch('/api/mentor-applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.status === 201) {
                setShowForm(false);
                fetchMentors();
            } else {
                setError('Failed to create mentor');
            }
        } catch (err) {
            setError('Error creating mentor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('mentorManagement.title', 'Mentors')}</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>{t('mentorManagement.addMentor', 'Add Mentor')}</button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6">
                    {/* Add form fields for all required fields */}
                    <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder={t('mentorManagement.phoneNumber', 'Phone Number')} className="input" />
                    {/* ...other fields... */}
                    <button type="submit" className="btn btn-primary" disabled={loading}>{t('mentorManagement.submit', 'Submit')}</button>
                    <button type="button" className="btn ml-2" onClick={() => setShowForm(false)}>{t('common.cancel', 'Cancel')}</button>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </form>
            )}
            <ul>
                {mentors.map((mentor) => (
                    <li key={mentor.id} className="border-b py-2">{mentor.profile_bio || mentor.phone_number}</li>
                ))}
            </ul>
            {loading && <div>{t('common.loading', 'Loading...')}</div>}
        </div>
    );
};

export default MentorManagement;
