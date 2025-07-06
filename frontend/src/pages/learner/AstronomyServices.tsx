import React from "react";
import ServiceCard from "../../components/Learner/ServiceCard";
import "../../styles/components/learner/ServiceCard.scss";

// Custom SVG icons (from ServiceListing)
const CalendarIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect
			x="3"
			y="4"
			width="18"
			height="18"
			rx="2"
			ry="2"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="16"
			y1="2"
			x2="16"
			y2="6"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="8"
			y1="2"
			x2="8"
			y2="6"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="3"
			y1="10"
			x2="21"
			y2="10"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
	</svg>
);
const StarIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"
			stroke="#4f8cff"
			strokeWidth="2"
			fill="none"
		/>
	</svg>
);
const MapIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M9 20l-5.447-2.724A2 2 0 0 1 2 15.382V5.618a2 2 0 0 1 1.553-1.894L9 2m0 18v-18m0 18l6-3m0 0V2m0 15l5.447-2.724A2 2 0 0 0 22 15.382V5.618a2 2 0 0 0-1.553-1.894L15 2"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
	</svg>
);
const CommentsIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
			stroke="#4f8cff"
			strokeWidth="2"
			fill="none"
		/>
	</svg>
);

const services = [
	{
		title: "Event Booking",
        price: 20,
		description:
			"Book your spot for upcoming astronomy events, star parties, and workshops.",
		image:
			"https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
		guideName: "Dr. Stella Orion",
		guideImage:
			"https://randomuser.me/api/portraits/women/44.jpg",
		rating: 4.9,
		location: "Mount Wilson Observatory",
		duration: "3 hours",
		tags: ["Events", "Star Party", "Workshop"],
		icon: <CalendarIcon />,
	},
	{
		title: "Telescope Rental",
        price: 15,
		description:
			"Rent high-quality telescopes and accessories for your stargazing sessions.",
		image:
			"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=200&fit=crop",
		guideName: "Prof. Neil Cosmos",
		guideImage:
			"https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4.7,
		location: "Alpine Astrophotography Center",
		duration: "2 hours",
		tags: ["Telescope", "Rental", "Gear"],
		icon: <StarIcon />,
	},
	{
		title: "Astronomy Guides",
        price: 30,
		description:
			"Connect with experienced guides for personalized astronomy tours and sessions.",
		image:
			"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=200&fit=crop",
		guideName: "Dr. Luna Sky",
		guideImage:
			"https://randomuser.me/api/portraits/women/65.jpg",
		rating: 4.8,
		location: "City Observatory Deck",
		duration: "1.5 hours",
		tags: ["Guided Tour", "Learning", "Night Sky"],
		icon: <MapIcon />,
	},
	{
		title: "Ask an Expert",
        price: 10,
		description:
			"Get your astronomy questions answered by professionals and enthusiasts.",
		image:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
		guideName: "Prof. Neil Cosmos",
		guideImage:
			"https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4.6,
		location: "Online",
		duration: "Flexible",
		tags: ["Q&A", "Expert", "Advice"],
		icon: <CommentsIcon />,
	},
];

const AstronomyServices: React.FC = () => {
	return (
		<div className="astronomy-services-page">
			<h2>Astronomy Services</h2>
			<p>Explore various astronomy-related services.</p>
			<div className="services-grid">
				{services.map((service, idx) => (
					<ServiceCard key={idx} {...service} />
				))}
			</div>
		</div>
	);
};

export default AstronomyServices;
