import React, { useState } from "react";
import ServiceCard from "../../components/Learner/ServiceCard";
import { services } from "./AstronomyServices";
import "../../styles/pages/learner/GuideDetails.scss";

// Mock media data (from GuideMediaDashboard)
const mediaItems = [
	{
		id: 1,
		title: "Saturn Ring Structure Analysis",
		type: "image",
		url: "https://picsum.photos/800/600?random=1",
		thumbnail: "https://picsum.photos/400/300?random=1",
		date: "2025-06-15",
		description:
			"Detailed capture of Saturn's ring system showing the Cassini Division",
	},
	{
		id: 2,
		title: "Jupiter's Great Red Spot",
		type: "video",
		url: "#",
		thumbnail: "https://picsum.photos/400/300?random=2",
		date: "2025-06-10",
		description: "Time-lapse showing the rotation of Jupiter's Great Red Spot",
	},
	// ...add more as needed
];

// Mock reviews (structure similar to AuthorProfilePage)
const reviews = [
	{
		id: 1,
		userName: "Stella Observer",
		rating: 5,
		reviewText: "Amazing guide! Learned so much about the night sky.",
		date: "2025-06-18",
	},
	{
		id: 2,
		userName: "Cosmo Reader",
		rating: 4,
		reviewText: "Very informative and engaging.",
		date: "2025-06-12",
	},
];

const GuideDetails: React.FC = () => {
	const [tab, setTab] = useState<"services" | "media" | "reviews">("services");

	// For demo, pick the first guide from services
	const guide = services[0];
	const guideServices = services.filter(
		(s) => s.guideName === guide.guideName
	);

	const renderStars = (rating: number) => (
		<span>
			{Array.from({ length: 5 }, (_, i) => (
				<span
					key={i}
					style={{
						color: i < rating ? "#fbbf24" : "#a1a1aa",
					}}
				>
					★
				</span>
			))}
		</span>
	);

	return (
		<div className="guide-details-page">
			<div className="guide-header">
				<img
					src={guide.guideImage}
					alt={guide.guideName}
					className="guide-avatar-lg"
				/>
				<div className="guide-header-info">
					<h2>{guide.guideName}</h2>
					<div className="guide-role">Astronomy Guide</div>
					<div className="guide-rating">
						{renderStars(4.8)}{" "}
						<span style={{ marginLeft: 8 }}>4.8</span>
					</div>
				</div>
			</div>
			<div className="guide-tabs">
				<button
					className={tab === "services" ? "active" : ""}
					onClick={() => setTab("services")}
				>
					Services
				</button>
				<button
					className={tab === "media" ? "active" : ""}
					onClick={() => setTab("media")}
				>
					Media
				</button>
				<button
					className={tab === "reviews" ? "active" : ""}
					onClick={() => setTab("reviews")}
				>
					Reviews
				</button>
			</div>
			<div className="guide-tab-content">
				{tab === "services" && (
					<div className="guide-services-grid">
						{guideServices.length > 0 ? (
							guideServices.map((service) => (
								<ServiceCard key={service.id} {...service} />
							))
						) : (
							<div>No services found for this guide.</div>
						)}
					</div>
				)}
				{tab === "media" && (
					<div className="guide-media-grid">
						{mediaItems.length > 0 ? (
							mediaItems.map((media) => (
								<div key={media.id} className="media-card">
									<img
										src={media.thumbnail}
										alt={media.title}
										className="media-thumb"
									/>
									<div className="media-info">
										<div className="media-title">{media.title}</div>
										<div className="media-date">{media.date}</div>
										<div className="media-desc">
											{media.description}
										</div>
									</div>
								</div>
							))
						) : (
							<div>No media uploaded yet.</div>
						)}
					</div>
				)}
				{tab === "reviews" && (
					<div className="guide-reviews-list">
						{reviews.length > 0 ? (
							reviews.map((review) => (
								<div key={review.id} className="review-item">
									<div className="review-header">
										<span className="review-user">{review.userName}</span>
										<span className="review-rating">
											{renderStars(review.rating)}
										</span>
										<span className="review-date">{review.date}</span>
									</div>
									<div className="review-text">{review.reviewText}</div>
								</div>
							))
						) : (
							<div>No reviews yet.</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GuideDetails;