// Sample author data for use with AuthorProfilePageWrapper
import { blogs } from "./blogData";

export const authors = [
  {
    name: "Dr. Jane Skywalker",
    bio: "Astrophysicist, science communicator, and passionate about star formation and nebulae.",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    blogs: blogs.filter(b => b.author === "Dr. Jane Skywalker"),
    sessions: [
      { id: 1, title: "Star Formation 101", type: "Webinar", schedule: "2025-07-10 18:00 UTC" },
      { id: 2, title: "Nebulae Deep Dive", type: "Workshop", schedule: "2025-08-05 16:00 UTC" }
    ],
    reviews: [
      { id: 1, reviewer: "Stella Observer", rating: 5, comment: "Jane's sessions are always inspiring!" },
      { id: 2, reviewer: "Cosmo Reader", rating: 4, comment: "Very informative and engaging." }
    ],
    social: [
      { platform: "Twitter", url: "https://twitter.com/janesky", icon: undefined },
      { platform: "Website", url: "https://janeskywalker.com", icon: undefined }
    ]
  },
  {
    name: "Prof. John Cosmos",
    bio: "Cosmologist and lecturer, exploring the mysteries of the expanding universe.",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    blogs: blogs.filter(b => b.author === "Prof. John Cosmos"),
    sessions: [
      { id: 3, title: "Redshift and the Expanding Universe", type: "Lecture", schedule: "2025-07-20 19:00 UTC" }
    ],
    reviews: [
      { id: 3, reviewer: "Luna Rivera", rating: 5, comment: "John makes cosmology easy to understand!" }
    ],
    social: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/johncosmos", icon: undefined }
    ]
  },
  {
    name: "Luna Rivera",
    bio: "Solar eclipse chaser and astronomy educator.",
    profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    blogs: blogs.filter(b => b.author === "Luna Rivera"),
    sessions: [
      { id: 4, title: "Solar Eclipses: Science & Wonder", type: "Seminar", schedule: "2025-08-15 15:00 UTC" }
    ],
    reviews: [
      { id: 4, reviewer: "Neil V. Galaxy", rating: 4, comment: "Great at explaining eclipse safety!" }
    ],
    social: [
      { platform: "Instagram", url: "https://instagram.com/lunarivera", icon: undefined }
    ]
  },
  {
    name: "Neil V. Galaxy",
    bio: "Galactic explorer and Milky Way specialist.",
    profilePic: "https://randomuser.me/api/portraits/men/45.jpg",
    blogs: blogs.filter(b => b.author === "Neil V. Galaxy"),
    sessions: [
      { id: 5, title: "The Milky Way Revealed", type: "Talk", schedule: "2025-09-01 17:00 UTC" }
    ],
    reviews: [
      { id: 5, reviewer: "Dr. Jane Skywalker", rating: 5, comment: "Neil's galactic talks are a must!" }
    ],
    social: [
      { platform: "Website", url: "https://neilvgalaxy.com", icon: undefined }
    ]
  }
];
