import './../../styles/components/Stats.scss';

const Stats = () => {
    const statsData = [
        { number: "10K+", label: "Active Users", description: "Explorers across the galaxy" },
        { number: "500+", label: "Missions", description: "Completed stellar journeys" },
        { number: "50+", label: "Systems", description: "Discovered solar systems" },
        { number: "99.9%", label: "Uptime", description: "Reliable cosmic connection" }
    ];

    return (
        <section className="stats-section">
            <div className="stats-container">
                <h2 className="stats-title">Stellar Achievements</h2>
                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div key={index} className="stats-item">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-description">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
