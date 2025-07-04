import React, { useState } from 'react';
import Button from '../../components/Button';
import '../../styles/pages/enthusiast/AstroHub.scss';

interface AstronomicalEvent {
  id: number;
  name: string;
  description: string;
  visibility: string;
  bestTime: string;
  image: string;
  date: string;
  duration: string;
}

interface SpaceNews {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  source: string;
  readTime: string;
  likes: number;
  comments: number;
  fullContent?: string;
  discussions?: NewsDiscussion[];
}

interface NewsDiscussion {
  id: number;
  userName: string;
  userAvatar?: string;
  comment: string;
  postedTime: string;
  likes: number;
  isLiked: boolean;
  replies?: NewsReply[];
}

interface NewsReply {
  id: number;
  userName: string;
  userAvatar?: string;
  comment: string;
  postedTime: string;
  likes: number;
  isLiked: boolean;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
  isSticky?: boolean;
  content?: string;
  discussions?: DiscussionComment[];
}

interface DiscussionComment {
  id: number;
  userName: string;
  userAvatar?: string;
  comment: string;
  postedTime: string;
  likes: number;
  isLiked: boolean;
  replies?: DiscussionReply[];
}

interface DiscussionReply {
  id: number;
  userName: string;
  userAvatar?: string;
  comment: string;
  postedTime: string;
  likes: number;
  isLiked: boolean;
}

interface GroupChat {
  id: number;
  name: string;
  description: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  isActive: boolean;
}

const astronomicalEvents: AstronomicalEvent[] = [
  {
    id: 1,
    name: "Perseid Meteor Shower",
    description: "One of the most spectacular meteor showers of the year, with up to 60 meteors per hour at peak. The Perseids are known for their bright, fast meteors and occasional fireballs.",
    visibility: "Northern Hemisphere",
    bestTime: "2:00 AM - 5:00 AM",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
    date: "July 17 - August 24, 2025",
    duration: "5 weeks"
  },
  {
    id: 2,
    name: "Total Lunar Eclipse",
    description: "A complete lunar eclipse where the Moon passes through Earth's shadow, creating a stunning red 'Blood Moon' effect visible to the naked eye.",
    visibility: "Asia, Australia, Pacific",
    bestTime: "10:30 PM - 2:30 AM",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    date: "September 7, 2025",
    duration: "4 hours"
  },
  {
    id: 3,
    name: "Jupiter Opposition",
    description: "Jupiter reaches its closest approach to Earth, appearing brightest and largest in the night sky. Perfect time for telescope observations of the Great Red Spot and moons.",
    visibility: "Worldwide",
    bestTime: "9:00 PM - 6:00 AM",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
    date: "November 3, 2025",
    duration: "1 night"
  },
  {
    id: 4,
    name: "Geminids Meteor Shower",
    description: "The year's most reliable meteor shower, producing bright, colorful meteors. Unlike most meteor showers, the Geminids originate from an asteroid rather than a comet.",
    visibility: "Worldwide",
    bestTime: "10:00 PM - 4:00 AM",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=250&fit=crop",
    date: "December 4 - 20, 2025",
    duration: "2 weeks"
  }
];

const spaceNews: SpaceNews[] = [
  {
    id: 1,
    title: "James Webb Telescope Discovers Ancient Galaxies",
    summary: "New observations reveal galaxies that formed just 400 million years after the Big Bang, pushing back the timeline of cosmic evolution.",
    fullContent: "The James Webb Space Telescope has made groundbreaking discoveries, identifying galaxies that formed merely 400 million years after the Big Bang. These ancient cosmic structures challenge our understanding of early universe formation and provide unprecedented insights into the earliest epochs of cosmic history. The telescope's infrared capabilities have allowed astronomers to peer deeper into space and further back in time than ever before, revealing these primordial galaxies in stunning detail. This discovery suggests that galaxy formation began much earlier than previously thought, fundamentally altering our timeline of cosmic evolution.",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=200&fit=crop",
    date: "June 28, 2025",
    source: "NASA",
    readTime: "3 min",
    likes: 50,
    comments: 10,
    discussions: [
      {
        id: 1,
        userName: "CosmicExplorer_LK",
        comment: "This is absolutely mind-blowing! The James Webb telescope keeps exceeding expectations. Can't wait to see what other secrets of the early universe it will unveil.",
        postedTime: "2 hours ago",
        likes: 15,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "StarGazer92",
            comment: "I agree! The fact that galaxies formed so early completely changes our understanding of the universe's timeline.",
            postedTime: "1 hour ago",
            likes: 8,
            isLiked: true
          }
        ]
      },
      {
        id: 2,
        userName: "AstroPhysicist_SL",
        comment: "The implications for dark matter research are huge. These early galaxies could provide clues about how dark matter influenced structure formation.",
        postedTime: "4 hours ago",
        likes: 23,
        isLiked: false,
        replies: []
      },
      {
        id: 3,
        userName: "SpaceEnthusiast",
        comment: "Does this mean we need to revise our models of the Big Bang and early cosmic inflation?",
        postedTime: "6 hours ago",
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "CosmologyStudent",
            comment: "Not necessarily revise the Big Bang model, but definitely refine our understanding of when and how the first structures formed.",
            postedTime: "5 hours ago",
            likes: 6,
            isLiked: false
          },
          {
            id: 2,
            userName: "UniverseWatcher",
            comment: "It's more about adjusting our timeline of galaxy formation rather than fundamental cosmological principles.",
            postedTime: "3 hours ago",
            likes: 4,
            isLiked: true
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Mars Sample Return Mission Update",
    summary: "ESA and NASA provide latest updates on the ambitious mission to bring Martian soil samples back to Earth for detailed analysis.",
    fullContent: "The Mars Sample Return mission, a collaborative effort between NASA and ESA, has reached critical milestones in its ambitious goal to bring Martian soil and rock samples back to Earth. The mission involves multiple phases: sample collection by the Perseverance rover, sample retrieval by a future Mars mission, and eventual return to Earth for comprehensive laboratory analysis. Recent updates indicate successful sample caching operations and advanced planning for the retrieval phase. This unprecedented mission will provide scientists with pristine Martian materials for detailed study, potentially answering fundamental questions about past life on Mars and the planet's geological history.",
    image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=400&h=200&fit=crop",
    date: "June 25, 2025",
    source: "ESA",
    readTime: "5 min",
    likes: 50,
    comments: 10,
    discussions: [
      {
        id: 1,
        userName: "MarsExplorer",
        comment: "This mission is going to be a game-changer for astrobiology! Finally, we'll have actual Martian samples to study in Earth labs.",
        postedTime: "3 hours ago",
        likes: 18,
        isLiked: true,
        replies: []
      },
      {
        id: 2,
        userName: "PlanetaryScientist",
        comment: "The engineering challenges of this mission are incredible. Landing, collecting, launching from Mars, and then returning to Earth - it's like science fiction becoming reality.",
        postedTime: "5 hours ago",
        likes: 14,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "RocketEngineer",
            comment: "The Mars Ascent Vehicle is particularly fascinating - launching a rocket from another planet is no small feat!",
            postedTime: "4 hours ago",
            likes: 9,
            isLiked: false
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Breakthrough in Exoplanet Atmosphere Analysis",
    summary: "Scientists detect water vapor and clouds in the atmosphere of a potentially habitable exoplanet 100 light-years away.",
    fullContent: "Astronomers have achieved a remarkable breakthrough in exoplanet research by successfully detecting water vapor and cloud formations in the atmosphere of K2-18b, a potentially habitable exoplanet located 100 light-years from Earth. Using advanced spectroscopic techniques with the James Webb Space Telescope, researchers analyzed the planet's atmospheric composition as it transited in front of its host star. The presence of water vapor, combined with the planet's location in the habitable zone where liquid water could exist, makes K2-18b one of the most promising candidates for potentially harboring life. This discovery represents a significant step forward in our ability to characterize exoplanet atmospheres and search for biosignatures.",
    image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=400&h=200&fit=crop",
    date: "June 22, 2025",
    source: "ESO",
    readTime: "4 min",
    likes: 50,
    comments: 10,
    discussions: [
      {
        id: 1,
        userName: "ExoplanetHunter",
        comment: "K2-18b is becoming one of my favorite exoplanets! The possibility of clouds and water vapor is so exciting for astrobiology.",
        postedTime: "1 hour ago",
        likes: 21,
        isLiked: false,
        replies: []
      },
      {
        id: 2,
        userName: "LifeSearcher",
        comment: "This is exactly the kind of discovery that gets me excited about the search for extraterrestrial life. We're getting so close to finding biosignatures!",
        postedTime: "7 hours ago",
        likes: 16,
        isLiked: true,
        replies: [
          {
            id: 1,
            userName: "SkepticalScientist",
            comment: "While exciting, we should be cautious about jumping to conclusions. Water vapor doesn't necessarily mean habitability.",
            postedTime: "6 hours ago",
            likes: 7,
            isLiked: false
          },
          {
            id: 2,
            userName: "AstrobiologyFan",
            comment: "True, but it's definitely a step in the right direction! Can't wait for more detailed atmospheric analysis.",
            postedTime: "5 hours ago",
            likes: 11,
            isLiked: true
          }
        ]
      }
    ]
  }
];

const discussions: Discussion[] = [
  {
    id: 1,
    title: "Best Telescopes for Beginners in 2025",
    author: "SkyWatcher_LK",
    replies: 23,
    lastActivity: "2 hours ago",
    category: "Equipment",
    isSticky: true,
    content: "Hi everyone! I'm looking to get my first telescope and would love some recommendations. My budget is around $300-500 and I'm mainly interested in viewing planets and the moon. I live in Colombo so there's some light pollution to consider. What would you recommend for a complete beginner?",
    discussions: [
      {
        id: 1,
        userName: "TelescopeGuru",
        comment: "For your budget and location, I'd highly recommend the Celestron NexStar 4SE. It's computerized so it helps with finding objects, and the 4-inch aperture is great for planets and moon viewing despite city light pollution.",
        postedTime: "1 hour ago",
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "SkyWatcher_LK",
            comment: "Thanks! I've been looking at that one. Is it easy to set up for a complete beginner?",
            postedTime: "45 minutes ago",
            likes: 3,
            isLiked: false
          },
          {
            id: 2,
            userName: "TelescopeGuru",
            comment: "Yes, very user-friendly! The SkyAlign feature makes initial setup quite simple. Just make sure to get a good eyepiece kit too.",
            postedTime: "30 minutes ago",
            likes: 8,
            isLiked: true
          }
        ]
      },
      {
        id: 2,
        userName: "ColomboStargazer",
        comment: "I second the NexStar recommendation, but also consider the Orion XT6 Dobsonian if you don't mind manual tracking. Better value for light gathering and great for planets.",
        postedTime: "2 hours ago",
        likes: 15,
        isLiked: false,
        replies: []
      },
      {
        id: 3,
        userName: "AmateurAstronomer",
        comment: "Don't forget about portability! If you plan to take it to darker skies outside Colombo, weight becomes important. The NexStar is more portable than most Dobsonians.",
        postedTime: "3 hours ago",
        likes: 7,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "SkyWatcher_LK",
            comment: "Great point! I do want to take it to places like Horton Plains occasionally.",
            postedTime: "2 hours ago",
            likes: 4,
            isLiked: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Astrophotography Settings for Sri Lankan Skies",
    author: "AstroPhotoColombo",
    replies: 45,
    lastActivity: "5 hours ago",
    category: "Photography",
    content: "I've been experimenting with astrophotography in Sri Lanka for the past year. Here are some camera settings that work well for our tropical skies and light pollution levels. Feel free to share your own experiences and tips!",
    discussions: [
      {
        id: 1,
        userName: "NightSkyPhotoLK",
        comment: "Great timing! I just got my first DSLR. What ISO settings do you recommend for Milky Way shots from places like Ella or Nuwara Eliya?",
        postedTime: "4 hours ago",
        likes: 18,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "AstroPhotoColombo",
            comment: "For those darker locations, I typically use ISO 3200-6400. Start with 15-20 second exposures at f/2.8. The key is finding the sweet spot for your camera's noise performance.",
            postedTime: "3 hours ago",
            likes: 22,
            isLiked: true
          }
        ]
      },
      {
        id: 2,
        userName: "DigitalDarkSky",
        comment: "Has anyone tried shooting from Sigiriya area? I'm planning a trip there next month and wondering about the light pollution levels.",
        postedTime: "6 hours ago",
        likes: 9,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 3,
    title: "Light Pollution Map of Colombo Metro Area",
    author: "DarkSkyAdvocate",
    replies: 18,
    lastActivity: "1 day ago",
    category: "Observation",
    content: "I've been working on mapping light pollution levels around Colombo using a Sky Quality Meter. Here are my findings and some recommendations for the best stargazing spots within driving distance of the city.",
    discussions: [
      {
        id: 1,
        userName: "SuburbanStargazer",
        comment: "This is incredibly useful! I live in Nugegoda and was wondering if there are any decent spots closer than Horton Plains.",
        postedTime: "18 hours ago",
        likes: 11,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "DarkSkyAdvocate",
            comment: "Try the areas around Avissawella or even parts of Kotte Marsh. Not perfect, but much better than central Colombo for basic observations.",
            postedTime: "12 hours ago",
            likes: 14,
            isLiked: false
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Planning a Stargazing Trip to Horton Plains",
    author: "MountainStargazer",
    replies: 31,
    lastActivity: "2 days ago",
    category: "Travel",
    content: "Planning my first serious stargazing trip to Horton Plains National Park. Looking for advice on best viewing spots, permits needed, and what to expect from the skies there. Any experienced stargazers been there recently?",
    discussions: [
      {
        id: 1,
        userName: "HighlandObserver",
        comment: "Horton Plains has incredible dark skies! Make sure to get there early to set up before sunset. The Milky Way visibility is outstanding on clear nights.",
        postedTime: "1 day ago",
        likes: 25,
        isLiked: true,
        replies: []
      },
      {
        id: 2,
        userName: "ParkRanger_HP",
        comment: "Remember you need to coordinate with park authorities for night access. Also bring warm clothes - it gets surprisingly cold at night even in our tropical climate!",
        postedTime: "2 days ago",
        likes: 19,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "MountainStargazer",
            comment: "Thanks for the tip! I didn't realize about the night access requirements. Do you know who I should contact?",
            postedTime: "1 day ago",
            likes: 7,
            isLiked: false
          }
        ]
      }
    ]
  }
];

// My Discussions (discussions created by current user)
const myDiscussions: Discussion[] = [
  {
    id: 101,
    title: "Observing Jupiter's Moons from Colombo",
    author: "CurrentUser",
    replies: 12,
    lastActivity: "3 hours ago",
    category: "Observation",
    content: "Last night I managed to observe all four Galilean moons of Jupiter using my 6-inch telescope from my backyard in Colombo. Despite the city's light pollution, they were clearly visible! Here's what I observed and the equipment I used.",
    discussions: [
      {
        id: 1,
        userName: "JupiterFan",
        comment: "That's awesome! Which telescope did you use? I've been trying to see them from Mount Lavinia but only managed to spot two clearly.",
        postedTime: "2 hours ago",
        likes: 8,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "CurrentUser",
            comment: "I used a Celestron NexStar 6SE with a 25mm eyepiece. The key is waiting for Jupiter to be high in the sky to minimize atmospheric distortion.",
            postedTime: "1 hour ago",
            likes: 12,
            isLiked: false
          }
        ]
      },
      {
        id: 2,
        userName: "CityAstronomer",
        comment: "Great observation! Did you notice any color differences between the moons? I sometimes see Io looking slightly yellowish.",
        postedTime: "3 hours ago",
        likes: 6,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: 102,
    title: "DIY Telescope Mount Modifications",
    author: "CurrentUser",
    replies: 8,
    lastActivity: "1 day ago",
    category: "Equipment",
    content: "I've been working on some modifications to improve the stability of my telescope mount for astrophotography. Sharing my DIY solutions and would love to hear about your own modifications!",
    discussions: [
      {
        id: 1,
        userName: "DIYAstronomer",
        comment: "This is exactly what I needed! The vibration dampening solution looks brilliant. What materials did you use for the counterweight system?",
        postedTime: "18 hours ago",
        likes: 15,
        isLiked: true,
        replies: [
          {
            id: 1,
            userName: "CurrentUser",
            comment: "I used lead fishing weights encased in PVC pipe. Much cheaper than commercial counterweights and just as effective!",
            postedTime: "12 hours ago",
            likes: 9,
            isLiked: false
          }
        ]
      }
    ]
  },
  {
    id: 103,
    title: "Saturn Observation Session - July 2025",
    author: "CurrentUser",
    replies: 5,
    lastActivity: "2 days ago",
    category: "Observation",
    content: "Had an amazing Saturn observation session last weekend. The rings were incredibly detailed and I could see the Cassini Division clearly. Sharing my observation notes and sketches.",
    discussions: [
      {
        id: 1,
        userName: "PlanetWatcher",
        comment: "Beautiful sketches! Saturn has been particularly stunning this month. Did you manage to spot any of its moons?",
        postedTime: "1 day ago",
        likes: 11,
        isLiked: false,
        replies: [
          {
            id: 1,
            userName: "CurrentUser",
            comment: "Yes! I could clearly see Titan and suspected Rhea, though it was at the limit of my telescope's capability.",
            postedTime: "1 day ago",
            likes: 7,
            isLiked: false
          }
        ]
      }
    ]
  }
];

const groupChats: GroupChat[] = [
  {
    id: 1,
    name: "Sri Lanka Astronomers",
    description: "Main discussion group for astronomy enthusiasts in Sri Lanka",
    members: 1247,
    lastMessage: "Anyone observing the ISS pass tonight?",
    lastMessageTime: "15 min ago",
    isActive: true
  },
  {
    id: 2,
    name: "Astrophotography Sri Lanka",
    description: "Share your astrophotography work and techniques",
    members: 432,
    lastMessage: "Amazing Milky Way shot from Ella!",
    lastMessageTime: "1 hour ago",
    isActive: true
  },
  {
    id: 3,
    name: "Telescope Buyers & Sellers",
    description: "Buy, sell, and trade astronomical equipment",
    members: 289,
    lastMessage: "Selling Celestron NexStar 6SE in excellent condition",
    lastMessageTime: "3 hours ago",
    isActive: false
  },
  {
    id: 4,
    name: "Meteor Shower Alerts",
    description: "Real-time alerts and observations for meteor showers",
    members: 156,
    lastMessage: "Perseids peak activity confirmed for tonight!",
    lastMessageTime: "45 min ago",
    isActive: true
  }
];

const AstroHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'news' | 'discussions' | 'my-discussions' | 'chats'>('events');
  const [selectedNews, setSelectedNews] = useState<SpaceNews | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newReply, setNewReply] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editingReply, setEditingReply] = useState<{ discussionId: number; replyId: number } | null>(null);
  const [editText, setEditText] = useState('');
  const [newsLiked, setNewsLiked] = useState(false);
  
  // New discussion form states
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [newDiscussionCategory, setNewDiscussionCategory] = useState('General');
  
  // Navigation context to track where the user came from
  const [discussionContext, setDiscussionContext] = useState<'community' | 'my-discussions'>('community');

  const handleViewNewsDetails = (article: SpaceNews) => {
    setSelectedNews(article);
  };

  const handleBackToNews = () => {
    setSelectedNews(null);
    setNewComment('');
    setReplyingTo(null);
    setNewReply('');
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedNews) {
      const newDiscussion: NewsDiscussion = {
        id: (selectedNews.discussions?.length || 0) + 1,
        userName: "CurrentUser", // In a real app, this would come from auth context
        comment: newComment.trim(),
        postedTime: "Just now",
        likes: 0,
        isLiked: false,
        replies: []
      };
      
      const updatedNews = {
        ...selectedNews,
        discussions: [...(selectedNews.discussions || []), newDiscussion],
        comments: selectedNews.comments + 1
      };
      
      setSelectedNews(updatedNews);
      setNewComment('');
      
      // Update the original data (in a real app, this would be an API call)
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleAddReply = (discussionId: number) => {
    if (newReply.trim() && selectedNews) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          const newReplyObj: NewsReply = {
            id: (discussion.replies?.length || 0) + 1,
            userName: "CurrentUser",
            comment: newReply.trim(),
            postedTime: "Just now",
            likes: 0,
            isLiked: false
          };
          return {
            ...discussion,
            replies: [...(discussion.replies || []), newReplyObj]
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      setNewReply('');
      setReplyingTo(null);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleToggleNewsLike = () => {
    if (selectedNews) {
      const updatedNews = {
        ...selectedNews,
        likes: newsLiked ? selectedNews.likes - 1 : selectedNews.likes + 1
      };
      setSelectedNews(updatedNews);
      setNewsLiked(!newsLiked);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleToggleCommentLike = (discussionId: number) => {
    if (selectedNews) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1,
            isLiked: !discussion.isLiked
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleToggleReplyLike = (discussionId: number, replyId: number) => {
    if (selectedNews) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          const updatedReplies = discussion.replies?.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked
              };
            }
            return reply;
          });
          return {
            ...discussion,
            replies: updatedReplies
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleEditComment = (discussionId: number, currentText: string) => {
    setEditingComment(discussionId);
    setEditText(currentText);
  };

  const handleSaveCommentEdit = (discussionId: number) => {
    if (selectedNews && editText.trim()) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            comment: editText.trim()
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      setEditingComment(null);
      setEditText('');
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleDeleteComment = (discussionId: number) => {
    if (selectedNews) {
      const updatedDiscussions = selectedNews.discussions?.filter(discussion => discussion.id !== discussionId);

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions,
        comments: selectedNews.comments - 1
      };

      setSelectedNews(updatedNews);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleEditReply = (discussionId: number, replyId: number, currentText: string) => {
    setEditingReply({ discussionId, replyId });
    setEditText(currentText);
  };

  const handleSaveReplyEdit = (discussionId: number, replyId: number) => {
    if (selectedNews && editText.trim()) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          const updatedReplies = discussion.replies?.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                comment: editText.trim()
              };
            }
            return reply;
          });
          return {
            ...discussion,
            replies: updatedReplies
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      setEditingReply(null);
      setEditText('');
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  const handleDeleteReply = (discussionId: number, replyId: number) => {
    if (selectedNews) {
      const updatedDiscussions = selectedNews.discussions?.map(discussion => {
        if (discussion.id === discussionId) {
          const updatedReplies = discussion.replies?.filter(reply => reply.id !== replyId);
          return {
            ...discussion,
            replies: updatedReplies
          };
        }
        return discussion;
      });

      const updatedNews = {
        ...selectedNews,
        discussions: updatedDiscussions
      };

      setSelectedNews(updatedNews);
      
      // Update the original data
      const newsIndex = spaceNews.findIndex(news => news.id === selectedNews.id);
      if (newsIndex !== -1) {
        spaceNews[newsIndex] = updatedNews;
      }
    }
  };

  // Discussion navigation handlers
  const handleJoinDiscussionFromCommunity = (discussion: Discussion) => {
    setDiscussionContext('community');
    setSelectedDiscussion(discussion);
  };

  const handleJoinDiscussionFromMyDiscussions = (discussion: Discussion) => {
    setDiscussionContext('my-discussions');
    setSelectedDiscussion(discussion);
  };

  const handleBackToDiscussions = () => {
    setSelectedDiscussion(null);
    setNewComment('');
    setReplyingTo(null);
    setNewReply('');
    
    // Navigate back to the appropriate context
    if (discussionContext === 'my-discussions') {
      setActiveTab('my-discussions');
    } else {
      setActiveTab('discussions');
    }
  };

  const handleStartNewDiscussion = () => {
    setShowCreateDiscussion(true);
  };

  const handleBackToDiscussionsList = () => {
    setShowCreateDiscussion(false);
    setNewDiscussionTitle('');
    setNewDiscussionContent('');
    setNewDiscussionCategory('General');
  };

  const handleCreateDiscussion = () => {
    if (newDiscussionTitle.trim() && newDiscussionContent.trim()) {
      const newDiscussion: Discussion = {
        id: discussions.length + 1,
        title: newDiscussionTitle.trim(),
        author: "CurrentUser",
        replies: 0,
        lastActivity: "Just now",
        category: newDiscussionCategory,
        isSticky: false
      };
      
      // Add to discussions array (in a real app, this would be an API call)
      discussions.unshift(newDiscussion);
      
      // Reset form and go back to discussions list
      setShowCreateDiscussion(false);
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
      setNewDiscussionCategory('General');
    }
  };

  const renderNewsDetails = (article: SpaceNews) => {
    return (
      <div className="news-details">
        <div className="news-details__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToNews}
            className="back-button"
          >
            ← Back to News
          </Button>
        </div>
        
        <div className="news-details__content">
          <div className="news-details__image">
            <img src={article.image} alt={article.title} />
            <div className="news-details__source">{article.source}</div>
          </div>
          
          <div className="news-details__info">
            <div className="news-details__meta">
              <span className="news-details__date">{article.date}</span>
              <span className="news-details__read-time">{article.readTime} read</span>
            </div>
            
            <h1 className="news-details__title">{article.title}</h1>
            
            <div className="news-details__stats">
              <button 
                className={`news-like-button ${newsLiked ? 'liked' : ''}`}
                onClick={handleToggleNewsLike}
              >
                <span className="like-icon">❤️</span>
                <span className="like-count">{article.likes} likes</span>
              </button>
              <span className="news-details__comments">{article.comments} comments</span>
            </div>
            
            <div className="news-details__body">
              <p className="news-details__full-content">{article.fullContent}</p>
            </div>
          </div>
        </div>

        <div className="news-discussions">
          <div className="news-discussions__header">
            <h2>Discussions ({article.discussions?.length || 0})</h2>
          </div>

          <div className="news-discussions__add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this news..."
              className="comment-textarea"
              rows={3}
            />
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </div>

          <div className="news-discussions__list">
            {article.discussions?.map((discussion) => (
              <div key={discussion.id} className="discussion-thread">
                <div className="discussion-comment">
                  <div className="discussion-comment__header">
                    <div className="discussion-comment__avatar">
                      {discussion.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="discussion-comment__info">
                      <span className="discussion-comment__username">{discussion.userName}</span>
                      <span className="discussion-comment__time">{discussion.postedTime}</span>
                    </div>
                  </div>
                  {editingComment === discussion.id ? (
                    <div className="edit-form">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-textarea"
                        rows={3}
                      />
                      <div className="edit-actions">
                        <Button 
                          variant="primary" 
                          size="small" 
                          onClick={() => handleSaveCommentEdit(discussion.id)}
                          disabled={!editText.trim()}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="small" 
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="discussion-comment__text">{discussion.comment}</p>
                  )}
                  <div className="discussion-comment__footer">
                    <button 
                      className={`comment-like-button ${discussion.isLiked ? 'liked' : ''}`}
                      onClick={() => handleToggleCommentLike(discussion.id)}
                    >
                      <span className="like-icon">❤️</span>
                      <span className="like-count">{discussion.likes}</span>
                    </button>
                    <div className="discussion-comment__actions">
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)}
                      >
                        {replyingTo === discussion.id ? 'Cancel' : 'Reply'}
                      </Button>
                      {discussion.userName === "CurrentUser" && (
                        <>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => handleEditComment(discussion.id, discussion.comment)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="small"
                            onClick={() => handleDeleteComment(discussion.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {discussion.replies && discussion.replies.length > 0 && (
                  <div className="discussion-replies">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="discussion-reply">
                        <div className="discussion-comment__header">
                          <div className="discussion-comment__avatar">
                            {reply.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="discussion-comment__info">
                            <span className="discussion-comment__username">{reply.userName}</span>
                            <span className="discussion-comment__time">{reply.postedTime}</span>
                          </div>
                        </div>
                        {editingReply?.discussionId === discussion.id && editingReply?.replyId === reply.id ? (
                          <div className="edit-form">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="comment-textarea"
                              rows={2}
                            />
                            <div className="edit-actions">
                              <Button 
                                variant="primary" 
                                size="small" 
                                onClick={() => handleSaveReplyEdit(discussion.id, reply.id)}
                                disabled={!editText.trim()}
                              >
                                Save
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="small" 
                                onClick={() => {
                                  setEditingReply(null);
                                  setEditText('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="discussion-comment__text">{reply.comment}</p>
                        )}
                        <div className="discussion-comment__footer">
                          <button 
                            className={`reply-like-button ${reply.isLiked ? 'liked' : ''}`}
                            onClick={() => handleToggleReplyLike(discussion.id, reply.id)}
                          >
                            <span className="like-icon">❤️</span>
                            <span className="like-count">{reply.likes}</span>
                          </button>
                          {reply.userName === "CurrentUser" && (
                            <div className="discussion-comment__actions">
                              <Button 
                                variant="secondary" 
                                size="small"
                                onClick={() => handleEditReply(discussion.id, reply.id, reply.comment)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="small"
                                onClick={() => handleDeleteReply(discussion.id, reply.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === discussion.id && (
                  <div className="discussion-reply-form">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                      className="reply-textarea"
                      rows={2}
                    />
                    <div className="reply-actions">
                      <Button 
                        variant="primary" 
                        size="small" 
                        onClick={() => handleAddReply(discussion.id)}
                        disabled={!newReply.trim()}
                      >
                        Post Reply
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={() => {
                          setReplyingTo(null);
                          setNewReply('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDiscussionDetails = (discussion: Discussion) => {
    return (
      <div className="discussion-details">
        <div className="discussion-details__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToDiscussions}
            className="back-button"
          >
            ← Back to {discussionContext === 'my-discussions' ? 'My Discussions' : 'Discussions'}
          </Button>
        </div>
        
        <div className="discussion-details__content">
          <div className="discussion-details__info">
            <div className="discussion-details__meta">
              <span className="category-badge">{discussion.category}</span>
              {discussion.isSticky && <span className="sticky-badge">📌 Pinned</span>}
              <span className="discussion-details__activity">Last activity: {discussion.lastActivity}</span>
            </div>
            
            <h1 className="discussion-details__title">{discussion.title}</h1>
            
            <div className="discussion-details__author-info">
              <div className="discussion-details__avatar">
                {discussion.author.charAt(0).toUpperCase()}
              </div>
              <div className="author-details">
                <span className="discussion-details__author">Started by {discussion.author}</span>
                <span className="discussion-details__replies">{discussion.replies} replies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="discussion-conversation">
          <div className="discussion-conversation__header">
            <h2>Discussion Thread</h2>
          </div>

          <div className="discussion-conversation__add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts in this discussion..."
              className="comment-textarea"
              rows={3}
            />
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Post Reply
            </Button>
          </div>

          <div className="discussion-conversation__placeholder">
            {/* Original discussion post */}
            <div className="original-discussion-post">
              <div className="discussion-comment">
                <div className="discussion-comment__header">
                  <div className="discussion-comment__avatar">
                    {discussion.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="discussion-comment__info">
                    <span className="discussion-comment__username">{discussion.author}</span>
                    <span className="discussion-comment__time">Started this discussion</span>
                  </div>
                </div>
                <p className="discussion-comment__text">{discussion.content || "No content available for this discussion."}</p>
              </div>
            </div>

            {/* Discussion replies */}
            {discussion.discussions && discussion.discussions.length > 0 ? (
              <div className="discussion-thread-list">
                {discussion.discussions.map((comment) => (
                  <div key={comment.id} className="discussion-thread">
                    <div className="discussion-comment">
                      <div className="discussion-comment__header">
                        <div className="discussion-comment__avatar">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="discussion-comment__info">
                          <span className="discussion-comment__username">{comment.userName}</span>
                          <span className="discussion-comment__time">{comment.postedTime}</span>
                        </div>
                      </div>
                      <p className="discussion-comment__text">{comment.comment}</p>
                      <div className="discussion-comment__footer">
                        <button 
                          className={`comment-like-button ${comment.isLiked ? 'liked' : ''}`}
                          onClick={() => {/* Add like functionality for discussion comments */}}
                        >
                          <span className="like-icon">❤️</span>
                          <span className="like-count">{comment.likes}</span>
                        </button>
                      </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="discussion-replies">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="discussion-reply">
                            <div className="discussion-comment__header">
                              <div className="discussion-comment__avatar">
                                {reply.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="discussion-comment__info">
                                <span className="discussion-comment__username">{reply.userName}</span>
                                <span className="discussion-comment__time">{reply.postedTime}</span>
                              </div>
                            </div>
                            <p className="discussion-comment__text">{reply.comment}</p>
                            <div className="discussion-comment__footer">
                              <button 
                                className={`reply-like-button ${reply.isLiked ? 'liked' : ''}`}
                                onClick={() => {/* Add like functionality for replies */}}
                              >
                                <span className="like-icon">❤️</span>
                                <span className="like-count">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments">
                <p>No replies yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCreateDiscussion = () => {
    return (
      <div className="create-discussion">
        <div className="create-discussion__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToDiscussionsList}
            className="back-button"
          >
            ← Back to Discussions
          </Button>
        </div>
        
        <div className="create-discussion__content">
          <h1 className="create-discussion__title">Start New Discussion</h1>
          
          <form className="create-discussion__form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="discussion-title" className="form-label">Discussion Title</label>
              <input
                id="discussion-title"
                type="text"
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
                placeholder="Enter a descriptive title for your discussion..."
                className="form-input"
                maxLength={150}
              />
            </div>

            <div className="form-group">
              <label htmlFor="discussion-category" className="form-label">Category</label>
              <select
                id="discussion-category"
                value={newDiscussionCategory}
                onChange={(e) => setNewDiscussionCategory(e.target.value)}
                className="form-select"
              >
                <option value="General">General</option>
                <option value="Equipment">Equipment</option>
                <option value="Photography">Photography</option>
                <option value="Observation">Observation</option>
                <option value="Travel">Travel</option>
                <option value="Events">Events</option>
                <option value="Science">Science</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discussion-content" className="form-label">Discussion Content</label>
              <textarea
                id="discussion-content"
                value={newDiscussionContent}
                onChange={(e) => setNewDiscussionContent(e.target.value)}
                placeholder="Brief description of your discussion topic..."
                className="form-textarea"
                rows={3}
                maxLength={500}
              />
              <div className="character-count">
                {newDiscussionContent.length}/500 characters
              </div>
            </div>

            <div className="form-actions">
              <Button 
                variant="primary" 
                size="medium"
                onClick={handleCreateDiscussion}
                disabled={!newDiscussionTitle.trim() || !newDiscussionContent.trim()}
              >
                Create Discussion
              </Button>
              <Button 
                variant="secondary" 
                size="medium"
                onClick={handleBackToDiscussionsList}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="events-section">
            <div className="section-header">
              <h2>Upcoming Astronomical Events</h2>
            </div>
            <div className="events-grid">
              {astronomicalEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card__image">
                    <img src={event.image} alt={event.name} />
                    <div className="event-card__date-badge">
                      {event.date}
                    </div>
                  </div>
                  <div className="event-card__content">
                    <h3 className="event-card__title">{event.name}</h3>
                    <p className="event-card__description">{event.description}</p>
                    <div className="event-card__details">
                      <div className="event-detail">
                        <span className="event-detail__label">Visibility:</span>
                        <span className="event-detail__value">{event.visibility}</span>
                      </div>
                      <div className="event-detail">
                        <span className="event-detail__label">Best Time:</span>
                        <span className="event-detail__value">{event.bestTime}</span>
                      </div>
                      <div className="event-detail">
                        <span className="event-detail__label">Duration:</span>
                        <span className="event-detail__value">{event.duration}</span>
                      </div>
                    </div>
                    <div className="event-card__actions">
                      <Button variant="primary" size="small">
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        // If a news article is selected, show detailed view
        if (selectedNews) {
          return renderNewsDetails(selectedNews);
        }
        
        // Otherwise show the news list
        return (
          <div className="news-section">
            <div className="section-header">
              <h2>Latest Space News</h2>
            </div>
            <div className="news-grid">
              {spaceNews.map((article) => (
                <div key={article.id} className="news-card">
                  <div className="news-card__image">
                    <img src={article.image} alt={article.title} />
                    <div className="news-card__source">{article.source}</div>
                  </div>
                  <div className="news-card__content">
                    <div className="news-card__meta">
                      <span className="news-card__date">{article.date}</span>
                      <span className="news-card__read-time">{article.readTime} read</span>
                    </div>
                    <h3 className="news-card__title">{article.title}</h3>
                    <p className="news-card__summary">{article.summary}</p>
                    <div className="news-card__stats">
                      <span className="news-card__likes">{article.likes} likes</span>
                      <span className="news-card__comments">{article.comments} comments</span>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      className="news-card__read-more"
                      onClick={() => handleViewNewsDetails(article)}
                    >
                      View More Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'discussions':
        // If showing create discussion form
        if (showCreateDiscussion) {
          return renderCreateDiscussion();
        }
        
        // If a discussion is selected, show detailed view
        if (selectedDiscussion) {
          return renderDiscussionDetails(selectedDiscussion);
        }
        
        // Otherwise show the discussions list
        return (
          <div className="discussions-section">
            <div className="section-header">
              <h2>Community Discussions</h2>
              <div className="section-header-buttons">
                <Button 
                  variant="secondary" 
                  className="my-discussions-btn"
                  onClick={() => setActiveTab('my-discussions')}
                >
                  My Discussions
                </Button>
                <Button 
                  variant="primary" 
                  className="start-discussion-btn"
                  onClick={handleStartNewDiscussion}
                >
                  Start New Discussion
                </Button>
              </div>
            </div>
            <div className="discussions-list">
              {discussions.map((discussion) => (
                <div key={discussion.id} className={`discussion-item ${discussion.isSticky ? 'sticky' : ''}`}>
                  <div className="discussion-item__main">
                    <div className="discussion-item__header">
                      {discussion.isSticky && <span className="sticky-badge">📌 Pinned</span>}
                      <span className="category-badge">{discussion.category}</span>
                    </div>
                    <h3 className="discussion-item__title">{discussion.title}</h3>
                    <div className="discussion-item__meta">
                      <span className="discussion-item__author">by {discussion.author}</span>
                      <span className="discussion-item__replies">{discussion.replies} replies</span>
                      <span className="discussion-item__activity">Last activity: {discussion.lastActivity}</span>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleJoinDiscussionFromCommunity(discussion)}
                  >
                    Join Discussion
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'my-discussions':
        // If showing create discussion form
        if (showCreateDiscussion) {
          return renderCreateDiscussion();
        }
        
        // If a discussion is selected, show detailed view
        if (selectedDiscussion) {
          return renderDiscussionDetails(selectedDiscussion);
        }
        
        // Otherwise show the my discussions list
        return (
          <div className="discussions-section">
            <div className="section-header">
              <h2>My Discussions</h2>
              <Button 
                variant="primary" 
                className="start-discussion-btn"
                onClick={handleStartNewDiscussion}
              >
                Start New Discussion
              </Button>
            </div>
            <div className="discussions-list">
              {myDiscussions.map((discussion) => (
                <div key={discussion.id} className={`discussion-item ${discussion.isSticky ? 'sticky' : ''}`}>
                  <div className="discussion-item__main">
                    <div className="discussion-item__header">
                      {discussion.isSticky && <span className="sticky-badge">📌 Pinned</span>}
                      <span className="category-badge">{discussion.category}</span>
                    </div>
                    <h3 className="discussion-item__title">{discussion.title}</h3>
                    <div className="discussion-item__meta">
                      <span className="discussion-item__author">by {discussion.author}</span>
                      <span className="discussion-item__replies">{discussion.replies} replies</span>
                      <span className="discussion-item__activity">Last activity: {discussion.lastActivity}</span>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleJoinDiscussionFromMyDiscussions(discussion)}
                  >
                    View Discussion
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chats':
        return (
          <div className="chats-section">
            <div className="section-header">
              <h2>Group Chats</h2>
              <Button variant="primary" className="create-chat-btn">
                Create New Group
              </Button>
            </div>
            <div className="chats-grid">
              {groupChats.map((chat) => (
                <div key={chat.id} className={`chat-card ${chat.isActive ? 'active' : ''}`}>
                  <div className="chat-card__header">
                    <div className="chat-card__title-section">
                      <h3 className="chat-card__title">{chat.name}</h3>
                      <div className="chat-card__status">
                        <span className={`status-indicator ${chat.isActive ? 'online' : 'offline'}`}></span>
                        <span className="member-count">{chat.members} members</span>
                      </div>
                    </div>
                  </div>
                  <p className="chat-card__description">{chat.description}</p>
                  <div className="chat-card__last-message">
                    <div className="last-message-content">
                      <span className="last-message-text">"{chat.lastMessage}"</span>
                      <span className="last-message-time">{chat.lastMessageTime}</span>
                    </div>
                  </div>
                  <div className="chat-card__actions">
                    <Button variant="primary" size="small">
                      Join Chat
                    </Button>
                    <Button variant="secondary" size="small">
                      View Info
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="astro-hub">
      <div className="astro-hub__header">
        <div className="astro-hub__header-content">
          <h1 className="astro-hub__title">Astro Hub</h1>
          <p className="astro-hub__subtitle">
            Your central hub for astronomical events, space news, and community discussions
          </p>
        </div>
      </div>

      <div className="astro-hub__navigation">
        <div className="tab-buttons">
          <Button 
            variant={activeTab === 'events' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('events')}
          >
            Astronomical Events
          </Button>
          <Button 
            variant={activeTab === 'news' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('news')}
          >
            Space News
          </Button>
          <Button 
            variant={activeTab === 'discussions' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('discussions')}
          >
            Discussions
          </Button>
          <Button 
            variant={activeTab === 'chats' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('chats')}
          >
            Group Chats
          </Button>
        </div>
      </div>

      <div className="astro-hub__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AstroHub;
