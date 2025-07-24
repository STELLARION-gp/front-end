import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import Button from '../../components/Button';

type MentorType = {
    id: string;
    name?: string;
    email?: string;
    phone_number?: string;
    country?: string;
    max_mentees?: number;
};

const Mentor = () => {
    const { t } = useI18n();
    const { hasAnyRole } = useRoleAccess();
    const navigate = useNavigate();
    const [mentors, setMentors] = useState<MentorType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!hasAnyRole(['admin', 'moderator'])) return;
        fetchMentors();
        // eslint-disable-next-line
    }, []);

    const fetchMentors = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/mentor-applications');
            const data = await res.json();
            if (data.success) setMentors(data.data);
            else setError(t('mentorManagement.loadError', 'Failed to load mentors'));
        } catch (err) {
            setError(t('mentorManagement.loadError', 'Failed to load mentors'));
        } finally {
            setLoading(false);
        }
    };

    if (!hasAnyRole(['admin', 'moderator'])) {
        return <div className="text-center text-red-500 mt-8">{t('common.unauthorized', 'You are not authorized to view this page.')}</div>;
    }

    return (
        <div className="dashboard-page w-full p-0">
            <div className="flex justify-between items-center mb-6 px-8 pt-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">{t('mentorManagement.title', 'Mentors')}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{t('mentorManagement.listDesc', 'Manage and view all mentors in the system.')}</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/dashboard/mentor-application')}
                >
                    {t('mentorManagement.addMentor', 'Add Mentor')}
                </Button>
            </div>
            {loading && <div className="px-8">{t('common.loading', 'Loading...')}</div>}
            {error && <div className="text-red-500 mb-4 px-8">{error}</div>}
            <div className="overflow-x-auto px-8 pb-8">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">{t('common.name', 'Name')}</th>
                            <th className="px-4 py-2 text-left">{t('common.email', 'Email')}</th>
                            <th className="px-4 py-2 text-left">{t('mentorManagement.phoneNumber', 'Phone Number')}</th>
                            <th className="px-4 py-2 text-left">{t('mentorManagement.country', 'Country')}</th>
                            <th className="px-4 py-2 text-left">{t('mentorManagement.maxMentees', 'Max Mentees')}</th>
                            <th className="px-4 py-2 text-left">{t('mentorManagement.actions', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentors.map((mentor) => (
                            <tr key={mentor.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <td className="px-4 py-2 font-medium">{mentor.name || '-'}</td>
                                <td className="px-4 py-2">{mentor.email || '-'}</td>
                                <td className="px-4 py-2">{mentor.phone_number || '-'}</td>
                                <td className="px-4 py-2">{mentor.country || '-'}</td>
                                <td className="px-4 py-2">{mentor.max_mentees || '-'}</td>
                                <td className="px-4 py-2">
                                    {/* Future: View/Edit/Delete buttons */}
                                </td>
                            </tr>
                        ))}
                        {mentors.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">{t('mentorManagement.noMentors', 'No mentors found.')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Mentor;
