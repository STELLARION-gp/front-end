import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import '../../styles/pages/enthusiast/AstroHub.scss';
import { chatService, type GroupChat, type ChatMessage, type CreateGroupRequest } from '../../services/chatService';
import SpaceNewsModal from '../../components/SpaceNewsModal';
import { spaceNewsService, type SpaceNews as RealSpaceNews } from '../../services/spaceNewsService';
import { useAuth } from '../../hooks/useAuth';


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

const AstroHub: React.FC = () => {
  const { userProfile } = useAuth();
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
  
  // Group chat states
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupChat | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupType, setNewGroupType] = useState<'public' | 'private'>('public');
  const [newChatMessage, setNewChatMessage] = useState('');

  // Real chat data states
  const [realGroupChats, setRealGroupChats] = useState<GroupChat[]>([]);
  const [userGroups, setUserGroups] = useState<GroupChat[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [membershipRefresh, setMembershipRefresh] = useState(0); // Force UI refresh for membership changes

  // Space News states
  const [realSpaceNews, setRealSpaceNews] = useState<RealSpaceNews[]>([]);
  const [spaceNewsLoading, setSpaceNewsLoading] = useState(false);
  const [spaceNewsError, setSpaceNewsError] = useState<string | null>(null);
  const [showCreateSpaceNews, setShowCreateSpaceNews] = useState(false);

  // Success alert state
  const [successAlert, setSuccessAlert] = useState<{ show: boolean; message: string }>({ 
    show: false, 
    message: '' 
  });

  // Search states for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(astronomicalEvents);
  const [filteredNews, setFilteredNews] = useState(spaceNews);
  const [filteredRealNews, setFilteredRealNews] = useState<RealSpaceNews[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState(discussions);
  const [filteredMyDiscussions, setFilteredMyDiscussions] = useState(myDiscussions);
  const [filteredGroupChats, setFilteredGroupChats] = useState<GroupChat[]>([]);

  // Load group chats data
  useEffect(() => {
    if (activeTab === 'chats') {
      loadGroupChats();
      loadUserGroups(); // Also load user's joined groups
    }
  }, [activeTab]);

  // Load user groups when component mounts (in case user switches tabs quickly)
  useEffect(() => {
    loadUserGroups();
  }, []);

  // Auto-scroll to bottom when new messages are loaded
  useEffect(() => {
    if (showGroupChat && chatMessages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const messagesContainer = document.querySelector('.group-chat__messages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    }
  }, [chatMessages, showGroupChat]);

  // Load space news when news tab is active
  useEffect(() => {
    const loadSpaceNews = async () => {
      try {
        setSpaceNewsLoading(true);
        setSpaceNewsError(null);
        const response = await spaceNewsService.getSpaceNews();
        const news = response.spaceNews;
        setRealSpaceNews(news);
        setFilteredRealNews(news);
      } catch (error) {
        console.error('Failed to load space news:', error);
        setSpaceNewsError('Failed to load space news');
      } finally {
        setSpaceNewsLoading(false);
      }
    };

    if (activeTab === 'news') {
      loadSpaceNews();
    }
  }, [activeTab]);

  // Check user's role for moderator features
  const isModerator = userProfile?.role === 'admin' || userProfile?.role === 'moderator';

  // Filter discussions based on current user
  const currentUserDiscussions = discussions.filter(discussion => 
    discussion.author === 'current_user' // Replace with actual user check
  );

  // Load group chats (only call when needed to avoid overwriting new groups)
  const loadGroupChats = async (forceReload = false) => {
    // If we already have groups and this isn't a forced reload, skip loading
    if (!forceReload && realGroupChats && realGroupChats.length > 0) {
      console.log('Skipping group chat reload - already have', realGroupChats.length, 'groups');
      return;
    }
    
    setChatLoading(true);
    setChatError(null);
    try {
      const response = await chatService.getGroups({
        page: 1,
        limit: 50,
        type: 'all'
      });
      
      console.log('Raw API response:', response);
      
      // Handle both possible response structures: response.groups or response.data.groups
      let apiGroups: any[] = [];
      if ((response as any).data?.groups) {
        // If the response has response.data.groups structure
        apiGroups = (response as any).data.groups;
        console.log('Using response.data.groups:', apiGroups);
      } else if (response.groups) {
        // If the response has response.groups structure (expected)
        apiGroups = response.groups;
        console.log('Using response.groups:', apiGroups);
      } else {
        console.warn('No groups found in response');
        apiGroups = [];
      }
      
      // Filter out any invalid items from the response
      const validGroups = apiGroups.filter((chat: any) => {
        const isValid = chat && chat.id && typeof chat.id === 'number';
        if (!isValid) {
          console.warn('Invalid chat object found:', chat);
        }
        return isValid;
      });
      
      console.log('Valid groups after filtering:', validGroups);
      console.log('Setting realGroupChats and filteredGroupChats to:', validGroups.length, 'groups');
      setRealGroupChats(validGroups);
      setFilteredGroupChats(validGroups);
      
      // Clear search query to show all groups
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to load group chats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load group chats. Please try again.';
      setChatError(errorMessage);
      // Set empty arrays as fallback
      setRealGroupChats([]);
      setFilteredGroupChats([]);
    } finally {
      setChatLoading(false);
    }
  };

  // Load user's joined groups to check membership status
  const loadUserGroups = async () => {
    try {
      console.log('Loading user groups...');
      const response = await chatService.getUserGroups();
      console.log('User groups response:', response);
      
      // Handle both possible response structures
      let apiUserGroups: any[] = [];
      if ((response as any).data?.groups) {
        apiUserGroups = (response as any).data.groups;
      } else if (response.groups) {
        apiUserGroups = response.groups;
      } else {
        console.warn('No user groups found in response');
        apiUserGroups = [];
      }
      
      // Filter out any invalid groups
      const validUserGroups = apiUserGroups.filter((group: any) => {
        const isValid = group && group.id && typeof group.id === 'number';
        if (!isValid) {
          console.warn('Invalid user group object found:', group);
        }
        return isValid;
      });
      
      console.log('Setting user groups to:', validUserGroups.map(g => ({ id: g.id, name: g.name })));
      setUserGroups(validUserGroups);
      
      // Trigger membership refresh to update UI
      setMembershipRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load user groups:', error);
      setUserGroups([]);
    }
  };

  // Show success alert function
  const showSuccessAlert = (message: string) => {
    setSuccessAlert({ show: true, message });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: '' });
    }, 4000);
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    // Filter events
    const newFilteredEvents = astronomicalEvents.filter(event =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.visibility.toLowerCase().includes(lowerQuery)
    );
    setFilteredEvents(newFilteredEvents);

    // Filter news
    const newFilteredRealNews = realSpaceNews.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      article.publisher.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredRealNews(newFilteredRealNews);

    // Filter discussions
    const newFilteredDiscussions = discussions.filter(discussion =>
      discussion.title.toLowerCase().includes(lowerQuery) ||
      discussion.author.toLowerCase().includes(lowerQuery) ||
      discussion.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredDiscussions(newFilteredDiscussions);

    // Filter my discussions
    const newFilteredMyDiscussions = myDiscussions.filter(discussion =>
      discussion.title.toLowerCase().includes(lowerQuery) ||
      discussion.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredMyDiscussions(newFilteredMyDiscussions);

    // Filter group chats
    const newFilteredGroupChats = (realGroupChats || [])
      .filter((chat) => chat && chat.id) // Remove any undefined or invalid items
      .filter((chat: GroupChat) =>
        chat.name.toLowerCase().includes(lowerQuery) ||
        chat.description.toLowerCase().includes(lowerQuery)
      );
    setFilteredGroupChats(newFilteredGroupChats);
  };

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
      showSuccessAlert('Comment added successfully!');
      
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
      showSuccessAlert('Reply added successfully!');
      
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
      showSuccessAlert('Comment updated successfully!');
      
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
      showSuccessAlert('Comment deleted successfully!');
      
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
      showSuccessAlert('Discussion created successfully!');
    }
  };

  // Group chat handlers
  const handleCreateNewGroup = () => {
    setShowCreateGroup(true);
    setSelectedGroupChat(null);
    setShowGroupInfo(false);
    setShowGroupChat(false);
  };

  const handleBackToGroupChats = () => {
    setShowCreateGroup(false);
    setShowGroupInfo(false);
    setShowGroupChat(false);
    setSelectedGroupChat(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupType('public');
    setNewChatMessage('');
    
    // Clear chat messages when leaving a chat
    setChatMessages([]);
    setMessagesError(null);
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() && newGroupDescription.trim()) {
      setChatLoading(true);
      setChatError(null);
      
      try {
        const createGroupRequest: CreateGroupRequest = {
          name: newGroupName.trim(),
          description: newGroupDescription.trim(),
          type: newGroupType
        };
        
        const response = await chatService.createGroup(createGroupRequest);
        console.log('Create group response:', response);
        
        // Add to local state with validation
        if (response.group && response.group.id) {
          const updatedGroups = [response.group, ...(realGroupChats || [])];
          console.log('Updating groups - before:', realGroupChats?.length || 0, 'after:', updatedGroups.length);
          setRealGroupChats(updatedGroups);
          setFilteredGroupChats(updatedGroups);
          
          // Also add to user groups since the creator automatically becomes a member
          const updatedUserGroups = [response.group, ...(userGroups || [])];
          setUserGroups(updatedUserGroups);
          setMembershipRefresh(prev => prev + 1);
          
          // Clear search query to ensure new group is visible
          setSearchQuery('');
        }
        
        // Reset form and go back to group chats list
        handleBackToGroupChats();
        showSuccessAlert('Group created successfully!');
      } catch (error) {
        console.error('Failed to create group:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create group. Please try again.';
        setChatError(errorMessage);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleJoinChat = async (chat: GroupChat) => {
    try {
      setChatLoading(true);
      setChatError(null);
      
      // Try to join the group
      try {
        await chatService.joinGroup(chat.id);
        showSuccessAlert(`Joined ${chat.name} successfully!`);
      } catch (joinError: any) {
        // If already a member, that's okay - continue to open the chat
        if (joinError?.message?.includes('already a member')) {
          console.log('User is already a member, proceeding to open chat');
        } else {
          // If it's a different error, re-throw it
          throw joinError;
        }
      }
      
      // Refresh user groups to ensure membership status is correct
      await loadUserGroups();
      
      // Add to user groups if not already there (backup in case API refresh is slow)
      const isAlreadyInUserGroups = userGroups.some(userGroup => userGroup.id === chat.id);
      if (!isAlreadyInUserGroups) {
        const updatedUserGroups = [chat, ...(userGroups || [])];
        setUserGroups(updatedUserGroups);
        setMembershipRefresh(prev => prev + 1);
      }
      
      // Load the chat messages
      await loadChatMessages(chat.id);
      
      // Set the selected chat and show the chat interface
      setSelectedGroupChat(chat);
      setShowGroupChat(true);
      setShowCreateGroup(false);
      setShowGroupInfo(false);
      
    } catch (error) {
      console.error('Failed to join group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to join group. Please try again.';
      setChatError(errorMessage);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle opening chat for existing members
  const handleOpenChat = async (chat: GroupChat) => {
    try {
      setChatLoading(true);
      setChatError(null);
      
      // Load the chat messages (no need to join since already a member)
      await loadChatMessages(chat.id);
      
      // Set the selected chat and show the chat interface
      setSelectedGroupChat(chat);
      setShowGroupChat(true);
      setShowCreateGroup(false);
      setShowGroupInfo(false);
      
      showSuccessAlert(`Opened ${chat.name} chat!`);
    } catch (error) {
      console.error('Failed to open chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to open chat. Please try again.';
      setChatError(errorMessage);
    } finally {
      setChatLoading(false);
    }
  };

  // Combined handler that determines whether to join or open chat
  const handleChatAction = async (chat: GroupChat) => {
    if (isUserMemberOfGroup(chat)) {
      await handleOpenChat(chat);
    } else {
      await handleJoinChat(chat);
    }
  };

  // Load chat messages for a specific group
  const loadChatMessages = async (groupId: number) => {
    try {
      setMessagesLoading(true);
      setMessagesError(null);
      
      const response = await chatService.getGroupMessages(groupId, {
        page: 1,
        limit: 50
      });
      
      console.log('Loaded messages for group', groupId, ':', response);
      
      // Handle both possible response structures
      let apiMessages: any[] = [];
      if ((response as any).data?.messages) {
        apiMessages = (response as any).data.messages;
      } else if (response.messages) {
        apiMessages = response.messages;
      } else {
        console.warn('No messages found in response');
        apiMessages = [];
      }
      
      // Filter out any invalid messages
      const validMessages = apiMessages.filter((message: any) => {
        const isValid = message && message.id && typeof message.id === 'number';
        if (!isValid) {
          console.warn('Invalid message object found:', message);
        }
        return isValid;
      });
      
      setChatMessages(validMessages);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages. Please try again.';
      setMessagesError(errorMessage);
      setChatMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleViewGroupInfo = (chat: GroupChat) => {
    setSelectedGroupChat(chat);
    setShowGroupInfo(true);
    setShowCreateGroup(false);
    setShowGroupChat(false);
  };

  const handleSendChatMessage = async () => {
    if (newChatMessage.trim() && selectedGroupChat) {
      try {
        setMessagesLoading(true);
        setMessagesError(null);
        
        const response = await chatService.sendMessage(selectedGroupChat.id, {
          content: newChatMessage.trim(),
          message_type: 'text'
        });
        
        console.log('Message sent successfully:', response);
        
        // Clear the input
        setNewChatMessage('');
        
        // Reload messages to show the new message
        await loadChatMessages(selectedGroupChat.id);
        
        showSuccessAlert('Message sent successfully!');
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
        setMessagesError(errorMessage);
      } finally {
        setMessagesLoading(false);
      }
    }
  };

  // Helper functions for chat display
  const getChatMemberCount = (chat: GroupChat): number => {
    if (!chat) {
      console.warn('getChatMemberCount called with undefined chat');
      return 0;
    }
    if (!chat.id) {
      console.warn('getChatMemberCount called with chat missing id:', chat);
      return 0;
    }
    return chat.member_count || chat.members?.length || 0;
  };

  // Format message timestamp - handles ISO format "2025-08-18T10:55:46.837Z"
  const formatMessageTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', timestamp);
        return 'Invalid Date';
      }
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting message time:', error, timestamp);
      return 'Invalid Date';
    }
  };

  // Get current user ID (this should come from auth context in real app)
  const getCurrentUserId = (): number => {
    return 289; // Hardcoded for now - replace with actual auth
  };

  // Get username from message object
  const getMessageUsername = (message: any): string => {
    // First try to use the user object if available
    if (message.user) {
      if (message.user.display_name) return message.user.display_name;
      if (message.user.first_name && message.user.last_name) {
        return `${message.user.first_name} ${message.user.last_name}`;
      }
      if (message.user.first_name) return message.user.first_name;
    }
    
    // Fallback to user ID mapping
    const currentUserId = getCurrentUserId();
    if (message.user_id === currentUserId) {
      return 'You';
    }
    
    return `User ${message.user_id}`;
  };

  // Get user initials from message object
  const getMessageUserInitials = (message: any): string => {
    // First try to use the user object if available
    if (message.user) {
      if (message.user.display_name) {
        const name = message.user.display_name;
        if (name.includes(' ')) {
          const parts = name.split(' ');
          return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
      }
      if (message.user.first_name && message.user.last_name) {
        return message.user.first_name.charAt(0).toUpperCase() + message.user.last_name.charAt(0).toUpperCase();
      }
      if (message.user.first_name) {
        return message.user.first_name.charAt(0).toUpperCase();
      }
    }
    
    // Fallback
    const currentUserId = getCurrentUserId();
    if (message.user_id === currentUserId) {
      return 'Y';
    }
    
    return 'U';
  };

  // Check if current user is a member of the group
  const isUserMemberOfGroup = (chat: GroupChat): boolean => {
    if (!chat || !chat.id) {
      console.log('isUserMemberOfGroup: Invalid chat object', chat);
      return false;
    }
    
    // Include membershipRefresh in the calculation to force re-evaluation
    const currentUserGroups = [...userGroups]; // Create a fresh reference
    const isMember = currentUserGroups.some(userGroup => userGroup && userGroup.id === chat.id);
    
    console.log(`isUserMemberOfGroup: Checking if user is member of group ${chat.id} (${chat.name}):`, isMember, 'refresh:', membershipRefresh);
    console.log('User groups:', currentUserGroups.map(g => ({ id: g?.id, name: g?.name })));
    return isMember;
  };

  const formatLastMessageTime = (time: string | undefined): string => {
    if (!time) return 'No messages yet';
    try {
      const date = new Date(time);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return date.toLocaleDateString();
    } catch {
      return time;
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
              />
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

  const renderCreateGroup = () => {
    return (
      <div className="create-group">
        <div className="create-group__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToGroupChats}
            className="back-button"
          >
            ← Back to Group Chats
          </Button>
        </div>
        
        <div className="create-group__content">
          <h1 className="create-group__title">Create New Group Chat</h1>
          
          <form className="create-group__form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="group-name" className="form-label">Group Name</label>
              <input
                id="group-name"
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter a name for your group chat..."
                className="form-input"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="group-type" className="form-label">Group Type</label>
              <select
                id="group-type"
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value as 'public' | 'private')}
                className="form-select"
              >
                <option value="public">Public (Anyone can join)</option>
                <option value="private">Private (Invite only)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="group-description" className="form-label">Group Description</label>
              <textarea
                id="group-description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Describe the purpose and focus of your group..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <Button 
                variant="primary" 
                size="medium"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || !newGroupDescription.trim()}
              >
                Create Group
              </Button>
              <Button 
                variant="secondary" 
                size="medium"
                onClick={handleBackToGroupChats}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderGroupInfo = (chat: GroupChat) => {
    const memberCount = getChatMemberCount(chat);
    const lastMessageTime = formatLastMessageTime(chat.last_message_time);
    
    return (
      <div className="group-info">
        <div className="group-info__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToGroupChats}
            className="back-button"
          >
            ← Back to Group Chats
          </Button>
        </div>
        
        <div className="group-info__content">
          <div className="group-info__main">
            <div className="group-info__avatar">
              {chat.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="group-info__details">
              <h1 className="group-info__title">{chat.name}</h1>
              <div className="group-info__status">
                <span className={`status-indicator ${chat.is_active ? 'online' : 'offline'}`}></span>
                <span className="status-text">{chat.is_active ? 'Active' : 'Inactive'}</span>
                <span className="member-count">{memberCount} members</span>
              </div>
              <p className="group-info__description">{chat.description}</p>
            </div>
          </div>

          <div className="group-info__stats">
            <div className="stat-card">
              <div className="stat-number">{memberCount}</div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{chat.is_active ? 'Active' : 'Inactive'}</div>
              <div className="stat-label">Status</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{lastMessageTime}</div>
              <div className="stat-label">Last Activity</div>
            </div>
          </div>

          <div className="group-info__last-activity">
            <h3>Recent Activity</h3>
            <div className="recent-message">
              <div className="message-content">
                <span className="message-text">"{chat.last_message || 'No messages yet'}"</span>
                <span className="message-time">{lastMessageTime}</span>
              </div>
            </div>
          </div>

          <div className="group-info__actions">
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => handleChatAction(chat)}
            >
              {isUserMemberOfGroup(chat) ? 'Open Chat' : 'Join This Group'}
            </Button>
            <Button 
              variant="secondary" 
              size="medium"
              onClick={handleBackToGroupChats}
            >
              Back to Groups
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupChat = (chat: GroupChat) => {
    const memberCount = getChatMemberCount(chat);
    
    return (
      <div className="group-chat">
        <div className="group-chat__header">
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleBackToGroupChats}
            className="back-button"
          >
            ← Back to Group Chats
          </Button>
          <div className="group-chat__info">
            <h1 className="group-chat__title">{chat.name}</h1>
            <div className="group-chat__status">
              <span className={`status-indicator ${chat.is_active ? 'online' : 'offline'}`}></span>
              <span className="member-count">{memberCount} members</span>
            </div>
          </div>
        </div>
        
        <div className="group-chat__content">
          {messagesLoading ? (
            <div className="chat-loading-message">
              <p>Loading messages...</p>
            </div>
          ) : messagesError ? (
            <div className="error-message">
              <p>{messagesError}</p>
              <Button variant="secondary" size="small" onClick={() => loadChatMessages(chat.id)}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="group-chat__messages">
              
              {chatMessages && chatMessages.length > 0 ? (
                chatMessages.map((message) => {
                  // console.log('Message object:', message);
                  const currentUserId = getCurrentUserId();
                  const isOwnMessage = message.user_id === currentUserId;
                  const messageTime = formatMessageTime((message as any).updated_at || (message as any).created_at);
                  const userName = getMessageUsername(message);
                  const userInitials = getMessageUserInitials(message);
                  
                  return (
                    <div key={message.id} className={`chat-message ${isOwnMessage ? 'own-message' : ''}`}>
                      <div className="chat-message__avatar">
                        {userInitials}
                      </div>
                      <div className="chat-message__content">
                        <div className="chat-message__header">
                          <span className="chat-message__username">{userName}</span>
                          <span className="chat-message__time">{messageTime}</span>
                        </div>
                        <p className="chat-message__text">{(message as any).message_text || message.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-messages">
                  <p>No messages yet. Be the first to send a message!</p>
                </div>
              )}
            </div>
          )}

          <div className="group-chat__input">
            <div className="chat-input-container">
              <textarea
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
                rows={2}
                disabled={messagesLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
              />
              <Button 
                variant="primary" 
                size="small"
                onClick={handleSendChatMessage}
                disabled={!newChatMessage.trim() || messagesLoading}
                className="send-button"
              >
                {messagesLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
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
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
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
                ))
              ) : (
                <div className="no-results">
                  <p>No astronomical events found matching your search.</p>
                </div>
              )}
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
              {isModerator && (
                <Button
                  onClick={() => setShowCreateSpaceNews(true)}
                  variant="primary"
                  size="small"
                >
                  Create News
                </Button>
              )}
            </div>
            <div className="news-grid">
              {spaceNewsLoading ? (
                <div className="loading-message">Loading space news...</div>
              ) : spaceNewsError ? (
                <div className="error-message">{spaceNewsError}</div>
              ) : filteredRealNews.length > 0 ? (
                filteredRealNews.map((article) => (
                  <div key={article.id} className="news-card">
                    <div className="news-card__image">
                      <img 
                        src={article.image_urls?.[0] || '/default-space-news.jpg'} 
                        alt={article.title} 
                      />
                      <div className="news-card__source">{article.category}</div>
                    </div>
                    <div className="news-card__content">
                      <div className="news-card__meta">
                        <span className="news-card__date">
                          {new Date(article.publish_date).toLocaleDateString()}
                        </span>
                        <span className="news-card__author">
                          By {article.publisher.name}
                        </span>
                      </div>
                      <h3 className="news-card__title">{article.title}</h3>
                      <p className="news-card__summary">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="news-card__stats">
                        <span className="news-card__likes">{article.number_of_likes} likes</span>
                        <span className="news-card__comments">{article.number_of_comments} comments</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="small" 
                        className="news-card__read-more"
                        onClick={() => {
                          // Convert RealSpaceNews to SpaceNews format for existing handler
                          const convertedArticle = {
                            id: article.id,
                            title: article.title,
                            summary: article.content.substring(0, 200),
                            content: article.content,
                            image: article.image_urls?.[0] || '/default-space-news.jpg',
                            date: new Date(article.publish_date).toLocaleDateString(),
                            readTime: '5 min',
                            source: article.category,
                            likes: article.number_of_likes,
                            comments: article.number_of_comments,
                            isLiked: false // Default value
                          };
                          handleViewNewsDetails(convertedArticle);
                        }}
                      >
                        View More Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No space news found matching your search.</p>
                </div>
              )}
            </div>

            {/* Space News Modal */}
            {showCreateSpaceNews && (
              <SpaceNewsModal
                isOpen={showCreateSpaceNews}
                onClose={() => setShowCreateSpaceNews(false)}
                onSuccess={(message: string) => {
                  setSuccessAlert({ show: true, message });
                  setShowCreateSpaceNews(false);
                  // Reload space news after creation
                  if (activeTab === 'news') {
                    const loadSpaceNews = async () => {
                      try {
                        setSpaceNewsLoading(true);
                        const response = await spaceNewsService.getSpaceNews();
                        const news = response.spaceNews;
                        setRealSpaceNews(news);
                        setFilteredRealNews(news);
                      } catch (error) {
                        console.error('Failed to reload space news:', error);
                      } finally {
                        setSpaceNewsLoading(false);
                      }
                    };
                    loadSpaceNews();
                  }
                }}
              />
            )}
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
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map((discussion) => (
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
                ))
              ) : (
                <div className="no-results">
                  <p>No discussions found matching your search.</p>
                </div>
              )}
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
              {filteredMyDiscussions.length > 0 ? (
                filteredMyDiscussions.map((discussion) => (
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
                ))
              ) : (
                <div className="no-results">
                  <p>No discussions found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'chats':
        // If showing create group form
        if (showCreateGroup) {
          return renderCreateGroup();
        }
        
        // If showing group info
        if (showGroupInfo && selectedGroupChat) {
          return renderGroupInfo(selectedGroupChat);
        }
        
        // If showing group chat
        if (showGroupChat && selectedGroupChat) {
          return renderGroupChat(selectedGroupChat);
        }
        
        // Otherwise show the group chats list
        return (
          <div className="chats-section">
            <div className="section-header">
              <h2>Group Chats</h2>
              <Button 
                variant="primary" 
                className="create-chat-btn"
                onClick={handleCreateNewGroup}
                disabled={chatLoading}
              >
                Create New Group
              </Button>
            </div>
            
            {chatError && (
              <div className="error-message">
                <p>{chatError}</p>
                <Button variant="secondary" size="small" onClick={() => loadGroupChats(true)}>
                  Try Again
                </Button>
              </div>
            )}
            
            {chatLoading ? (
              <div className="chat-loading-message">
                <p>Loading group chats...</p>
              </div>
            ) : (
              <div className="chats-grid">
              {(() => {
                console.log('Rendering chats - filteredGroupChats:', filteredGroupChats?.length, 'realGroupChats:', realGroupChats?.length, 'searchQuery:', searchQuery);
                return null;
              })()}
              {(filteredGroupChats && filteredGroupChats.length > 0) ? (
                filteredGroupChats
                  .filter((chat) => chat && chat.id) // Filter out any undefined or invalid items
                  .map((chat) => {
                    if (!chat || !chat.id) return null; // Extra safety check
                    console.log('Rendering chat:', chat);
                    const memberCount = getChatMemberCount(chat);
                    const lastMessageTime = formatLastMessageTime(chat.last_message_time);
                  
                  return (
                    <div key={chat.id} className={`chat-card ${chat.is_active ? 'active' : ''}`}>
                      <div className="chat-card__header">
                        <div className="chat-card__title-section">
                          <h3 className="chat-card__title">{chat.name || 'Unnamed Group'}</h3>
                          <div className="chat-card__status">
                            <span className={`status-indicator ${chat.is_active ? 'online' : 'offline'}`}></span>
                            <span className="member-count">{memberCount} members</span>
                          </div>
                        </div>
                      </div>
                      <p className="chat-card__description">{chat.description || 'No description available'}</p>
                      <div className="chat-card__last-message">
                        <div className="last-message-content">
                          <span className="last-message-text">"{chat.last_message || 'No messages yet'}"</span>
                          <span className="last-message-time">{lastMessageTime}</span>
                        </div>
                      </div>
                      <div className="chat-card__actions">
                        <Button 
                          variant="primary" 
                          size="small"
                          onClick={() => handleChatAction(chat)}
                        >
                          {isUserMemberOfGroup(chat) ? 'Open Chat' : 'Join Chat'}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleViewGroupInfo(chat)}
                        >
                          View Info
                        </Button>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean) // Remove any null values from the map
              ) : (
                <div className="no-results">
                  {searchQuery ? (
                    <p>No group chats found matching "{searchQuery}". Try a different search term.</p>
                  ) : (
                    <div>
                      <p>No group chats available yet.</p>
                      <p>Be the first to create a new group chat!</p>
                    </div>
                  )}
                </div>
              )}
              </div>
            )}
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
            onClick={() => {
              setActiveTab('events');
              handleSearch(''); // Clear search when switching tabs
            }}
          >
            Astronomical Events
          </Button>
          <Button 
            variant={activeTab === 'news' ? 'primary' : 'secondary'}
            onClick={() => {
              setActiveTab('news');
              handleSearch(''); // Clear search when switching tabs
            }}
          >
            Space News
          </Button>
          <Button 
            variant={activeTab === 'discussions' ? 'primary' : 'secondary'}
            onClick={() => {
              setActiveTab('discussions');
              handleSearch(''); // Clear search when switching tabs
            }}
          >
            Discussions
          </Button>
          <Button 
            variant={activeTab === 'chats' ? 'primary' : 'secondary'}
            onClick={() => {
              setActiveTab('chats');
              handleSearch(''); // Clear search when switching tabs
            }}
          >
            Group Chats
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="astro-hub__search">
        <div className="search-container">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'events' ? 'astronomical events' : 
              activeTab === 'news' ? 'space news' : 
              activeTab === 'discussions' ? 'discussions' : 
              activeTab === 'my-discussions' ? 'my discussions' : 'group chats'}...`}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="astro-hub__content">
        {renderTabContent()}
      </div>

      {/* Success Alert */}
      {successAlert.show && (
        <div className={`success-alert ${successAlert.show ? 'show' : ''}`}>
          <svg className="success-alert__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="success-alert__message">{successAlert.message}</span>
          <button 
            className="success-alert__close"
            onClick={() => setSuccessAlert({ show: false, message: '' })}
          >
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AstroHub;
