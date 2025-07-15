import React, { useState, useRef, useEffect } from "react";
import "../../styles/pages/mentor/LearnPath.scss";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  BeakerIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RocketLaunchIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  EyeIcon,
  FilmIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  LightBulbIcon,
  CogIcon
} from "@heroicons/react/24/outline";
import { 
  CheckCircleIcon as CheckCircleSolid, 
  StarIcon as StarSolid,
  TrophyIcon as TrophySolid 
} from "@heroicons/react/24/solid";
import menteeImg from '../../assets/signup.jpg';

interface LearningResource {
  id: number;
  type: "video" | "article" | "quiz" | "exercise" | "project" | "observation";
  title: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  description: string;
  url?: string;
}

interface LearningModule {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  totalResources: number;
  completedResources: number;
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  resources: LearningResource[];
  isExpanded: boolean;
  isLocked: boolean;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  completedModules: number;
  estimatedDuration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  modules: LearningModule[];
  mentee: {
    name: string;
    img: string;
    level: string;
    joinDate: string;
  };
}

const mockLearningPath: LearningPath = {
  id: 1,
  title: "Stellar Astronomy & Astrophysics",
  description: "A comprehensive journey through the cosmos, from basic stargazing to advanced astrophysical concepts",
  totalModules: 6,
  completedModules: 2,
  estimatedDuration: "12 weeks",
  difficulty: "intermediate",
  category: "Astronomy",
  mentee: {
    name: "Luna Skywatcher",
    img: menteeImg,
    level: "Intermediate Astronomer",
    joinDate: "Sep 2024"
  },
  modules: [
    {
      id: 1,
      title: "Introduction to Stellar Observation",
      description: "Learn the basics of stargazing, constellation identification, and using telescopes",
      icon: <EyeIcon width={32} />,
      progress: 100,
      totalResources: 8,
      completedResources: 8,
      estimatedTime: "2 weeks",
      difficulty: "beginner",
      prerequisites: [],
      isExpanded: false,
      isLocked: false,
      resources: [
        {
          id: 1,
          type: "video",
          title: "Setting Up Your First Telescope",
          duration: "15 min",
          difficulty: "beginner",
          completed: true,
          description: "Learn how to properly set up and calibrate your telescope for optimal viewing"
        },
        {
          id: 2,
          type: "article",
          title: "Understanding Star Magnitude",
          duration: "10 min",
          difficulty: "beginner",
          completed: true,
          description: "Explore how astronomers measure star brightness and what magnitude means"
        },
        {
          id: 3,
          type: "observation",
          title: "Identify 10 Major Constellations",
          duration: "2 hours",
          difficulty: "beginner",
          completed: true,
          description: "Practice identifying key constellations visible in your hemisphere"
        }
      ]
    },
    {
      id: 2,
      title: "Solar System Exploration",
      description: "Deep dive into our solar system's planets, moons, and celestial mechanics",
      icon: <SunIcon width={32} />,
      progress: 100,
      totalResources: 12,
      completedResources: 12,
      estimatedTime: "3 weeks",
      difficulty: "beginner",
      prerequisites: ["Introduction to Stellar Observation"],
      isExpanded: false,
      isLocked: false,
      resources: [
        {
          id: 4,
          type: "video",
          title: "The Formation of Our Solar System",
          duration: "25 min",
          difficulty: "intermediate",
          completed: true,
          description: "Understand how our solar system formed from a stellar nebula"
        },
        {
          id: 5,
          type: "project",
          title: "Build a Scale Model of the Solar System",
          duration: "4 hours",
          difficulty: "intermediate",
          completed: true,
          description: "Create an accurate scale model showing planetary distances and sizes"
        }
      ]
    },
    {
      id: 3,
      title: "Stellar Classification & Life Cycles",
      description: "Understand how stars are born, live, and die across the cosmos",
      icon: <StarIcon width={32} />,
      progress: 65,
      totalResources: 10,
      completedResources: 6,
      estimatedTime: "2.5 weeks",
      difficulty: "intermediate",
      prerequisites: ["Solar System Exploration"],
      isExpanded: true,
      isLocked: false,
      resources: [
        {
          id: 6,
          type: "video",
          title: "The H-R Diagram Explained",
          duration: "18 min",
          difficulty: "intermediate",
          completed: true,
          description: "Learn how astronomers classify stars using the Hertzsprung-Russell diagram"
        },
        {
          id: 7,
          type: "article",
          title: "Main Sequence Stars",
          duration: "12 min",
          difficulty: "intermediate",
          completed: true,
          description: "Explore the properties and characteristics of main sequence stars"
        },
        {
          id: 8,
          type: "quiz",
          title: "Star Classification Quiz",
          duration: "15 min",
          difficulty: "intermediate",
          completed: true,
          description: "Test your knowledge of stellar classification systems"
        },
        {
          id: 9,
          type: "video",
          title: "Supernovae and Stellar Death",
          duration: "22 min",
          difficulty: "advanced",
          completed: false,
          description: "Discover how massive stars end their lives in spectacular explosions"
        },
        {
          id: 10,
          type: "exercise",
          title: "Calculate Stellar Luminosity",
          duration: "30 min",
          difficulty: "advanced",
          completed: false,
          description: "Practice calculating absolute and apparent magnitude of stars"
        }
      ]
    },
    {
      id: 4,
      title: "Galactic Structure & Dark Matter",
      description: "Explore the Milky Way galaxy and the mysterious dark matter that shapes it",
      icon: <SparklesIcon width={32} />,
      progress: 0,
      totalResources: 14,
      completedResources: 0,
      estimatedTime: "3 weeks",
      difficulty: "advanced",
      prerequisites: ["Stellar Classification & Life Cycles"],
      isExpanded: false,
      isLocked: false,
      resources: [
        {
          id: 11,
          type: "video",
          title: "Mapping the Milky Way",
          duration: "20 min",
          difficulty: "advanced",
          completed: false,
          description: "Learn how astronomers map our galaxy's spiral structure"
        },
        {
          id: 12,
          type: "article",
          title: "Evidence for Dark Matter",
          duration: "15 min",
          difficulty: "advanced",
          completed: false,
          description: "Examine the evidence that led to the discovery of dark matter"
        }
      ]
    },
    {
      id: 5,
      title: "Exoplanet Discovery & Astrobiology",
      description: "Search for worlds beyond our solar system and the possibility of life",
      icon: <GlobeAltIcon width={32} />,
      progress: 0,
      totalResources: 11,
      completedResources: 0,
      estimatedTime: "2 weeks",
      difficulty: "advanced",
      prerequisites: ["Galactic Structure & Dark Matter"],
      isExpanded: false,
      isLocked: true,
      resources: [
        {
          id: 13,
          type: "video",
          title: "Exoplanet Detection Methods",
          duration: "25 min",
          difficulty: "advanced",
          completed: false,
          description: "Learn about transit photometry, radial velocity, and direct imaging"
        }
      ]
    },
    {
      id: 6,
      title: "Cosmology & The Big Bang",
      description: "Understand the origin and evolution of the universe itself",
      icon: <RocketLaunchIcon width={32} />,
      progress: 0,
      totalResources: 9,
      completedResources: 0,
      estimatedTime: "2.5 weeks",
      difficulty: "advanced",
      prerequisites: ["Exoplanet Discovery & Astrobiology"],
      isExpanded: false,
      isLocked: true,
      resources: [
        {
          id: 14,
          type: "video",
          title: "The Cosmic Microwave Background",
          duration: "28 min",
          difficulty: "advanced",
          completed: false,
          description: "Explore the afterglow of the Big Bang and what it tells us"
        }
      ]
    }
  ]
};

const resourceTypeIcons = {
  video: <FilmIcon width={20} />,
  article: <DocumentTextIcon width={20} />,
  quiz: <QuestionMarkCircleIcon width={20} />,
  exercise: <BeakerIcon width={20} />,
  project: <LightBulbIcon width={20} />,
  observation: <EyeIcon width={20} />
};

const difficultyColors = {
  beginner: "#4ade80",
  intermediate: "#f59e0b",
  advanced: "#ef4444"
};

const LearnPath: React.FC = () => {
  const [learningPath, setLearningPath] = useState<LearningPath>(mockLearningPath);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModule, setShowAddModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showModuleOptions, setShowModuleOptions] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "modules" | "progress" | "resources">("modules");

  // Toggle module expansion
  const toggleModule = (moduleId: number) => {
    setLearningPath(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module
      )
    }));
  };

  // Mark resource as completed
  const markResourceCompleted = (moduleId: number, resourceId: number) => {
    setLearningPath(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          const updatedResources = module.resources.map(resource =>
            resource.id === resourceId
              ? { ...resource, completed: !resource.completed }
              : resource
          );
          const completedCount = updatedResources.filter(r => r.completed).length;
          const progress = Math.round((completedCount / updatedResources.length) * 100);
          
          return {
            ...module,
            resources: updatedResources,
            completedResources: completedCount,
            progress
          };
        }
        return module;
      })
    }));
  };

  // Filter modules based on search
  const filteredModules = learningPath.modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall progress
  const overallProgress = Math.round(
    (learningPath.modules.reduce((sum, module) => sum + module.progress, 0) / learningPath.modules.length)
  );

  // Get next module to work on
  const nextModule = learningPath.modules.find(module => module.progress < 100 && !module.isLocked);

  const renderResource = (resource: LearningResource, moduleId: number) => (
    <div key={resource.id} className="learning-resource">
      <div className="resource-content">
        <div className="resource-header">
          <div className="resource-type">
            {resourceTypeIcons[resource.type]}
          </div>
          <div className="resource-info">
            <h4 className="resource-title">{resource.title}</h4>
            <p className="resource-description">{resource.description}</p>
            <div className="resource-meta">
              <span className="resource-duration">{resource.duration}</span>
              <span 
                className="resource-difficulty"
                style={{ color: difficultyColors[resource.difficulty] }}
              >
                {resource.difficulty}
              </span>
            </div>
          </div>
        </div>
        <div className="resource-actions">
          <button
            className={`complete-btn ${resource.completed ? 'completed' : ''}`}
            onClick={() => markResourceCompleted(moduleId, resource.id)}
          >
            {resource.completed ? (
              <CheckCircleSolid width={24} className="completed-icon" />
            ) : (
              <CheckCircleIcon width={24} />
            )}
          </button>
          <button className="play-btn">
            <PlayIcon width={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderModule = (module: LearningModule) => (
    <div key={module.id} className={`learning-module ${module.isLocked ? 'locked' : ''}`}>
      <div className="module-header" onClick={() => !module.isLocked && toggleModule(module.id)}>
        <div className="module-info">
          <div className="module-icon">{module.icon}</div>
          <div className="module-details">
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div className="module-meta">
              <span className="module-duration">{module.estimatedTime}</span>
              <span 
                className="module-difficulty"
                style={{ color: difficultyColors[module.difficulty] }}
              >
                {module.difficulty}
              </span>
              <span className="module-resources">
                {module.completedResources}/{module.totalResources} resources
              </span>
            </div>
          </div>
        </div>
        <div className="module-progress-section">
          <div className="progress-circle">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#b57aff"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - module.progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
              />
              <text
                x="30"
                y="35"
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="600"
              >
                {module.progress}%
              </text>
            </svg>
          </div>
          <div className="module-actions">
            <button
              className="expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleModule(module.id);
              }}
            >
              {module.isExpanded ? (
                <ChevronUpIcon width={24} />
              ) : (
                <ChevronDownIcon width={24} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {module.isExpanded && !module.isLocked && (
        <div className="module-content">
          <div className="prerequisites">
            {module.prerequisites.length > 0 && (
              <div className="prerequisites-list">
                <strong>Prerequisites:</strong>
                <ul>
                  {module.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="module-resources">
            <h4>Resources</h4>
            {module.resources.map(resource => renderResource(resource, module.id))}
          </div>
        </div>
      )}
      
      {module.isLocked && (
        <div className="locked-overlay">
          <div className="lock-message">
            <RocketLaunchIcon width={32} />
            <p>Complete previous modules to unlock</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="learn-path-page">
      <div className="learn-path__main">
        {/* Header */}
        <div className="learn-path__header">
          <div className="header-left">
            <div className="mentee-info">
              <img src={learningPath.mentee.img} alt={learningPath.mentee.name} className="mentee-avatar" />
              <div className="mentee-details">
                <h2 className="mentee-name">{learningPath.mentee.name}</h2>
                <p className="mentee-level">{learningPath.mentee.level}</p>
                <p className="mentee-join-date">Joined {learningPath.mentee.joinDate}</p>
              </div>
            </div>
            <div className="path-info">
              <h1 className="path-title">{learningPath.title}</h1>
              <p className="path-description">{learningPath.description}</p>
              <div className="path-meta">
                <span className="path-duration">{learningPath.estimatedDuration}</span>
                <span 
                  className="path-difficulty"
                  style={{ color: difficultyColors[learningPath.difficulty] }}
                >
                  {learningPath.difficulty}
                </span>
                <span className="path-category">{learningPath.category}</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="overall-progress">
              <div className="progress-stats">
                <div className="stat">
                  <TrophySolid width={24} className="stat-icon" />
                  <span className="stat-value">{overallProgress}%</span>
                  <span className="stat-label">Complete</span>
                </div>
                <div className="stat">
                  <CheckCircleSolid width={24} className="stat-icon" />
                  <span className="stat-value">{learningPath.completedModules}/{learningPath.totalModules}</span>
                  <span className="stat-label">Modules</span>
                </div>
              </div>
              <div className="overall-progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            
            <div className="header-actions">
              <button className="action-btn">
                <ChartBarIcon width={24} />
                Analytics
              </button>
              <button className="action-btn">
                <CalendarIcon width={24} />
                Schedule
              </button>
              <button className="action-btn" onClick={() => setShowSettings(true)}>
                <CogIcon width={24} />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="learn-path__nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <AcademicCapIcon width={20} />
              Overview
            </button>
            <button
              className={`nav-tab ${activeView === 'modules' ? 'active' : ''}`}
              onClick={() => setActiveView('modules')}
            >
              <BookOpenIcon width={20} />
              Modules
            </button>
            <button
              className={`nav-tab ${activeView === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveView('progress')}
            >
              <ChartBarIcon width={20} />
              Progress
            </button>
            <button
              className={`nav-tab ${activeView === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveView('resources')}
            >
              <DocumentTextIcon width={20} />
              Resources
            </button>
          </div>
          
          <div className="nav-actions">
            <div className="search-container">
              <MagnifyingGlassIcon width={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-btn" onClick={() => setShowAddModule(true)}>
              <PlusIcon width={20} />
              Add Module
            </button>
          </div>
        </div>

        {/* Next Module Suggestion */}
        {nextModule && activeView === 'modules' && (
          <div className="next-module-suggestion">
            <div className="suggestion-content">
              <RocketLaunchIcon width={32} className="suggestion-icon" />
              <div className="suggestion-text">
                <h3>Continue Learning</h3>
                <p>Next up: <strong>{nextModule.title}</strong></p>
                <span className="suggestion-meta">
                  {nextModule.estimatedTime} • {nextModule.difficulty}
                </span>
              </div>
            </div>
            <button
              className="continue-btn"
              onClick={() => toggleModule(nextModule.id)}
            >
              Continue
              <ArrowRightIcon width={20} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="learn-path__content">
          {activeView === 'modules' && (
            <div className="modules-container">
              {filteredModules.map(renderModule)}
            </div>
          )}
          
          {activeView === 'overview' && (
            <div className="overview-container">
              <div className="overview-stats">
                <div className="stat-card">
                  <TrophyIcon width={32} className="stat-icon" />
                  <div className="stat-info">
                    <h3>{overallProgress}%</h3>
                    <p>Overall Progress</p>
                  </div>
                </div>
                <div className="stat-card">
                  <ClockIcon width={32} className="stat-icon" />
                  <div className="stat-info">
                    <h3>{learningPath.estimatedDuration}</h3>
                    <p>Estimated Duration</p>
                  </div>
                </div>
                <div className="stat-card">
                  <BookOpenIcon width={32} className="stat-icon" />
                  <div className="stat-info">
                    <h3>{learningPath.totalModules}</h3>
                    <p>Total Modules</p>
                  </div>
                </div>
                <div className="stat-card">
                  <StarIcon width={32} className="stat-icon" />
                  <div className="stat-info">
                    <h3>{learningPath.difficulty}</h3>
                    <p>Difficulty Level</p>
                  </div>
                </div>
              </div>
              
              <div className="overview-description">
                <h3>About This Learning Path</h3>
                <p>{learningPath.description}</p>
                <p>
                  This comprehensive astronomy program takes you from basic stargazing to advanced 
                  astrophysical concepts. You'll explore stellar evolution, galactic structure, 
                  exoplanet discovery, and cosmology through hands-on observations, interactive 
                  simulations, and theoretical study.
                </p>
              </div>
            </div>
          )}
          
          {activeView === 'progress' && (
            <div className="progress-container">
              <div className="progress-chart">
                <h3>Learning Progress</h3>
                <div className="module-progress-list">
                  {learningPath.modules.map(module => (
                    <div key={module.id} className="module-progress-item">
                      <div className="module-progress-info">
                        <span className="module-name">{module.title}</span>
                        <span className="module-percentage">{module.progress}%</span>
                      </div>
                      <div className="module-progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'resources' && (
            <div className="resources-container">
              <h3>All Resources</h3>
              <div className="resources-grid">
                {learningPath.modules.flatMap(module => 
                  module.resources.map(resource => (
                    <div key={`${module.id}-${resource.id}`} className="resource-card">
                      <div className="resource-type-badge">
                        {resourceTypeIcons[resource.type]}
                        {resource.type}
                      </div>
                      <h4>{resource.title}</h4>
                      <p>{resource.description}</p>
                      <div className="resource-meta">
                        <span>{resource.duration}</span>
                        <span style={{ color: difficultyColors[resource.difficulty] }}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <div className="resource-actions">
                        <button className="play-btn">
                          <PlayIcon width={16} />
                          Start
                        </button>
                        <button 
                          className={`complete-btn ${resource.completed ? 'completed' : ''}`}
                          onClick={() => markResourceCompleted(module.id, resource.id)}
                        >
                          {resource.completed ? (
                            <CheckCircleSolid width={16} />
                          ) : (
                            <CheckCircleIcon width={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPath;