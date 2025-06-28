import './../../styles/components/Team.scss';
import mem1 from '../../assets/home/nimna.png';
import mem2 from '../../assets/home/vidusha.png';
import mem3 from '../../assets/home/irumi.png';    
import mem4 from '../../assets/home/janith.png';
import mem5 from '../../assets/home/sasanka.png';
import mem6 from '../../assets/home/senesh.png';

const Team = () => {
    const teamMembers = [
        { id: 1, name: 'Nimna', role: 'Position', image: mem1 },
        { id: 2, name: 'Vidusha', role: 'Position', image: mem2 },
        { id: 3, name: 'Irumi', role: 'Position', image: mem3 },
        { id: 4, name: 'Janith', role: 'Position', image: mem4 },
        { id: 5, name: 'Sasanka', role: 'Position', image: mem5 },
        { id: 6, name: 'Senesh', role: 'Position', image: mem6 },
    ];

    return (
        <section className="team-section">
            <div className="team-container">
                <h2 className="team-title">Our Team</h2>
                <div className="team-grid">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="team-member">
                            <div className="member-image-wrapper">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="member-image"
                                />
                                <div className="member-overlay">
                                    <h3 className="member-name">{member.name}</h3>
                                    <p className="member-role">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
