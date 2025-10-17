// ...existing code...
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n';
// ...existing code...
import Button from '../../components/Button';
import '../../styles/pages/admin/MentorProfiles.scss';

// Extend MentorType for performance fields if needed
export type MentorProfileType = {
    id: string;
    name?: string;
    email?: string;
    phone_number?: string;
    country?: string;
    max_mentees?: number;
    // Example performance fields
    sessions_completed?: number;
    rating?: number;
    mentees_count?: number;
};

const mentors: MentorProfileType[] = [
    {
        id: '1',
        name: 'Dr. Stella Orion',
        email: 'stella.orion@example.com',
        phone_number: '+1-555-1234',
        country: 'USA',
        max_mentees: 10,
        sessions_completed: 120,
        rating: 4.9,
        mentees_count: 8,
    },
    {
        id: '2',
        name: 'Prof. Leo Vega',
        email: 'leo.vega@example.com',
        phone_number: '+44-20-1234',
        country: 'UK',
        max_mentees: 7,
        sessions_completed: 85,
        rating: 4.7,
        mentees_count: 6,
    },
    {
        id: '3',
        name: 'Ms. Mira Solis',
        email: 'mira.solis@example.com',
        phone_number: '+91-98765-43210',
        country: 'India',
        max_mentees: 5,
        sessions_completed: 60,
        rating: 4.8,
        mentees_count: 5,
    },
];

const MentorProfiles = () => {
    const { t } = useI18n();
    const navigate = useNavigate();

    return (
        <div className='mentor-profiles-bg'>
            <div className='mentor-profiles-container'>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className='mentor-profiles-title'>{t('mentorManagement.profilesTitle', 'Mentor Profiles')}</h2>
                        <p className='mentor-profiles-desc'>{t('mentorManagement.profilesDesc', 'Review all mentor profiles and their performance.')}</p>
                    </div>
                    <Button
                        variant="primary"
                        
                        onClick={() => navigate('/dashboard/mentor-application')}
                    >
                        {t('mentorManagement.addMentor', 'Add Mentor')}
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className='mentor-table'>
                        <thead>
                            <tr>
                                <th>{t('common.name', 'Name')}</th>
                                <th>{t('common.email', 'Email')}</th>
                                <th>{t('mentorManagement.phoneNumber', 'Phone Number')}</th>
                                <th>{t('mentorManagement.country', 'Country')}</th>
                                <th>{t('mentorManagement.maxMentees', 'Max Mentees')}</th>
                                <th>{t('mentorManagement.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mentors.map((mentor) => (
                                <tr key={mentor.id}>
                                    <td>{mentor.name || '-'}</td>
                                    <td>{mentor.email || '-'}</td>
                                    <td>{mentor.phone_number || '-'}</td>
                                    <td>{mentor.country || '-'}</td>
                                    <td>{mentor.max_mentees || '-'}</td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => navigate(`/dashboard/mentor-profile/${mentor.id}`)}
                                        >
                                            {t('mentorManagement.review', 'Review')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MentorProfiles;
