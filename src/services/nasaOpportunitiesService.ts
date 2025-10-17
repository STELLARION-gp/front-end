import axios from 'axios';

const NASA_API_BASE = 'https://api.nasa.gov';
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

// Types for NASA API responses
export interface NasaImage {
  collection: {
    version: string;
    href: string;
    items: Array<{
      href: string;
      data: Array<{
        nasa_id: string;
        title: string;
        description: string;
        media_type: string;
        date_created: string;
        keywords?: string[];
        photographer?: string;
        location?: string;
      }>;
      links?: Array<{
        href: string;
        rel: string;
        render?: string;
      }>;
    }>;
  };
}

export interface TechPortProject {
  project: {
    id: number;
    title: string;
    description: string;
    status: string;
    startDate?: string;
    endDate?: string;
    responsibleProgram?: string;
    leadOrganization?: {
      organizationName: string;
      location: string;
    };
    primaryTaxonomyNodes?: Array<{
      taxonomyNodeId: number;
      taxonomyRootId: number;
      parentNodeId: number;
      level: number;
      code: string;
      title: string;
      definition: string;
    }>;
  };
}

// Types for NASA opportunities
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'internship' | 'volunteer' | 'citizen-science';
  startDate?: string;
  endDate?: string;
  deadline?: string;
  url: string;
  location: string;
  remote: boolean;
  skills: string[];
  eligibility: string[];
  source: 'NASA' | 'VolunteerMatch' | 'TechPort' | 'NASA-Images';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeCommitment: string;
  image?: string;
}

export interface OpportunityFilters {
  type?: string;
  difficulty?: string;
  remote?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface OpportunityResponse {
  success: boolean;
  data: Opportunity[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface OpportunityStats {
  total: number;
  byType: {
    internship: number;
    volunteer: number;
    'citizen-science': number;
  };
  byDifficulty: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
  remote: number;
  onSite: number;
}

class NasaOpportunitiesService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 15000,
    });
  }

  /**
   * Fetch NASA images and convert them to opportunities
   */
  async getNasaImages(query: string = 'internship OR opportunity OR education OR student OR volunteer OR outreach OR citizen science', limit: number = 30): Promise<Opportunity[]> {
    try {
      const response = await this.axiosInstance.get<NasaImage>(`https://images-api.nasa.gov/search`, {
        params: {
          q: query,
          media_type: 'image',
          page_size: limit,
        }
      });

      return response.data.collection.items.map((item) => {
        const data = item.data[0];
        
        // Use NASA logo as fallback for now to ensure images load
        let imageUrl = 'https://www.nasa.gov/wp-content/uploads/2023/04/nasa-logo-web-rgb.png';
        
        if (item.links && item.links.length > 0) {
          // Get the first available image link
          imageUrl = item.links[0].href;
        }
        
        // Debug logging for image URLs
        console.log('NASA Image Data:', {
          nasa_id: data.nasa_id,
          title: data.title,
          imageUrl: imageUrl,
          links: item.links
        });
        
        // Determine opportunity type based on keywords and title
        const keywords = data.keywords?.join(' ').toLowerCase() || '';
        const title = data.title.toLowerCase();
        const description = data.description?.toLowerCase() || '';
        const combinedText = `${title} ${description} ${keywords}`;
        
        let type: 'internship' | 'volunteer' | 'citizen-science' = 'citizen-science';
        let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
        
        // More sophisticated classification
        if (combinedText.includes('internship') || combinedText.includes('student program') || 
            combinedText.includes('education') || combinedText.includes('fellowship') ||
            combinedText.includes('scholar') || combinedText.includes('research opportunity')) {
          type = 'internship';
          difficulty = 'Intermediate';
        } else if (combinedText.includes('volunteer') || combinedText.includes('outreach') || 
                   combinedText.includes('community') || combinedText.includes('public engagement') ||
                   combinedText.includes('ambassador') || combinedText.includes('educator')) {
          type = 'volunteer';
          difficulty = 'Beginner';
        } else if (combinedText.includes('citizen science') || combinedText.includes('public participation') ||
                   combinedText.includes('crowdsourcing') || combinedText.includes('classification') ||
                   combinedText.includes('observation') || combinedText.includes('data collection')) {
          type = 'citizen-science';
          difficulty = 'Beginner';
        }

        // Extract skills from keywords with expanded list
        const skillKeywords = data.keywords || [];
        const skillMapping: Record<string, string> = {
          'research': 'Research',
          'engineering': 'Engineering', 
          'science': 'Science',
          'technology': 'Technology',
          'astronomy': 'Astronomy',
          'physics': 'Physics',
          'mathematics': 'Mathematics',
          'programming': 'Programming',
          'data': 'Data Analysis',
          'observation': 'Observation',
          'photography': 'Photography',
          'communication': 'Communication',
          'education': 'Education',
          'outreach': 'Public Outreach'
        };

        const skills = skillKeywords
          .filter(keyword => Object.keys(skillMapping).some(skill => keyword.toLowerCase().includes(skill)))
          .map(keyword => {
            const matchedSkill = Object.keys(skillMapping).find(skill => keyword.toLowerCase().includes(skill));
            return matchedSkill ? skillMapping[matchedSkill] : keyword;
          })
          .slice(0, 5);

        // Generate more realistic URLs based on type
        let opportunityUrl = `https://www.nasa.gov/search/?q=${encodeURIComponent(data.title)}`;
        if (type === 'internship') {
          opportunityUrl = 'https://nasa.gov/learning-resources/internship-programs/';
        } else if (type === 'volunteer') {
          opportunityUrl = 'https://www.nasa.gov/get-involved/';
        }

        return {
          id: `nasa-img-${data.nasa_id}`,
          title: data.title,
          description: data.description || 'Explore this fascinating NASA project and contribute to space science research.',
          type,
          startDate: new Date().toISOString().split('T')[0],
          url: opportunityUrl,
          location: data.location || (type === 'citizen-science' ? 'Worldwide' : 'NASA Centers'),
          remote: type === 'citizen-science' || Math.random() > 0.6,
          skills: skills.length > 0 ? skills : this.getDefaultSkills(type),
          eligibility: this.getEligibilityRequirements(type),
          source: 'NASA-Images' as const,
          difficulty,
          timeCommitment: this.getTimeCommitment(type)
          // Removed image field - no images will be displayed
        };
      });
    } catch (error) {
      console.error('Error fetching NASA images:', error);
      throw new Error('Failed to fetch NASA image opportunities');
    }
  }

  /**
   * Get default skills based on opportunity type
   */
  private getDefaultSkills(type: 'internship' | 'volunteer' | 'citizen-science'): string[] {
    switch (type) {
      case 'internship':
        return ['Research', 'Engineering', 'Data Analysis', 'Problem Solving'];
      case 'volunteer':
        return ['Communication', 'Public Outreach', 'Education', 'Community Engagement'];
      case 'citizen-science':
        return ['Observation', 'Data Collection', 'Photography', 'Analysis'];
      default:
        return ['Research', 'Observation', 'Analysis'];
    }
  }

  /**
   * Get eligibility requirements based on opportunity type
   */
  private getEligibilityRequirements(type: 'internship' | 'volunteer' | 'citizen-science'): string[] {
    switch (type) {
      case 'internship':
        return ['Students (undergraduate/graduate)', 'US Citizens or Permanent Residents', 'GPA 3.0+'];
      case 'volunteer':
        return ['All ages welcome', 'Passion for space science', 'Communication skills'];
      case 'citizen-science':
        return ['All ages welcome', 'Interest in astronomy', 'Basic observation skills'];
      default:
        return ['All ages welcome', 'Interest in space science'];
    }
  }

  /**
   * Get time commitment based on opportunity type
   */
  private getTimeCommitment(type: 'internship' | 'volunteer' | 'citizen-science'): string {
    switch (type) {
      case 'internship':
        return '20-40 hours/week';
      case 'volunteer':
        return '5-10 hours/week';
      case 'citizen-science':
        return '1-5 hours/week';
      default:
        return '2-5 hours/week';
    }
  }

  /**
   * Fetch NASA TechPort projects and convert to opportunities
   */
  async getTechPortProjects(limit: number = 10): Promise<Opportunity[]> {
    try {
      // First get the list of projects
      const projectsResponse = await this.axiosInstance.get(`${NASA_API_BASE}/techport/api/projects`, {
        params: {
          api_key: NASA_API_KEY,
        }
      });

      const projectIds = projectsResponse.data.projects.slice(0, limit);
      const opportunities: Opportunity[] = [];

      // Fetch details for each project
      for (const projectId of projectIds) {
        try {
          const projectResponse = await this.axiosInstance.get<TechPortProject>(`${NASA_API_BASE}/techport/api/projects/${projectId}`, {
            params: {
              api_key: NASA_API_KEY,
            }
          });

          const project = projectResponse.data.project;
          
          // Extract skills from taxonomy
          const skills = project.primaryTaxonomyNodes?.map(node => node.title).slice(0, 5) || 
                        ['Research', 'Technology Development', 'Innovation'];

          opportunities.push({
            id: `techport-${project.id}`,
            title: project.title,
            description: project.description || 'Contribute to cutting-edge NASA research and technology development.',
            type: 'internship',
            startDate: project.startDate,
            endDate: project.endDate,
            url: `https://techport.nasa.gov/view/${project.id}`,
            location: project.leadOrganization?.location || 'NASA Centers',
            remote: false,
            skills,
            eligibility: ['Graduate students', 'Recent graduates', 'US Citizens'],
            source: 'TechPort',
            difficulty: 'Advanced',
            timeCommitment: '40 hours/week'
            // Removed image field
          });
        } catch (projectError) {
          console.warn(`Failed to fetch project ${projectId}:`, projectError);
        }
      }

      return opportunities;
    } catch (error) {
      console.error('Error fetching TechPort projects:', error);
      throw new Error('Failed to fetch TechPort opportunities');
    }
  }

  /**
   * Fetch NASA APOD (Astronomy Picture of the Day) for citizen science opportunities
   */
  async getApodOpportunities(count: number = 8): Promise<Opportunity[]> {
    try {
      const opportunities: Opportunity[] = [];
      const today = new Date();

      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        try {
          const response = await this.axiosInstance.get(`${NASA_API_BASE}/planetary/apod`, {
            params: {
              api_key: NASA_API_KEY,
              date: dateString,
            }
          });

          const apod = response.data;
          
          opportunities.push({
            id: `apod-${dateString}`,
            title: `Citizen Science: ${apod.title}`,
            description: `${apod.explanation} Join citizen scientists in observing and analyzing similar celestial phenomena.`,
            type: 'citizen-science',
            startDate: dateString,
            url: apod.hdurl || apod.url,
            location: 'Worldwide',
            remote: true,
            skills: ['Astronomy', 'Observation', 'Photography', 'Data Analysis'],
            eligibility: ['All ages', 'Basic astronomy interest', 'Camera or telescope helpful'],
            source: 'NASA',
            difficulty: 'Beginner',
            timeCommitment: '1-3 hours/week'
            // Removed image field
          });
        } catch (apodError) {
          console.warn(`Failed to fetch APOD for ${dateString}:`, apodError);
        }
      }

      return opportunities;
    } catch (error) {
      console.error('Error fetching APOD opportunities:', error);
      throw new Error('Failed to fetch APOD citizen science opportunities');
    }
  }

  /**
   * Get additional NASA citizen science projects from various programs
   */
  async getNasaCitizenScienceProjects(): Promise<Opportunity[]> {
    const projects: Opportunity[] = [
      {
        id: 'globe-observer',
        title: 'GLOBE Observer - Cloud & Earth Observations',
        description: 'Help NASA scientists validate satellite data by taking photos of clouds, land cover, and mosquito habitats using the GLOBE Observer app.',
        type: 'citizen-science',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://observer.globe.gov/',
        location: 'Worldwide',
        remote: true,
        skills: ['Observation', 'Photography', 'Environmental Science', 'Mobile Apps'],
        eligibility: ['All ages', 'Smartphone required', 'Interest in environmental science'],
        source: 'NASA',
        difficulty: 'Beginner',
        timeCommitment: '15-30 minutes/day'
        // Removed image field
      },
      {
        id: 'planet-hunters',
        title: 'Planet Hunters TESS',
        description: 'Search for exoplanets in data from NASA\'s Transiting Exoplanet Survey Satellite (TESS). Help discover new worlds beyond our solar system.',
        type: 'citizen-science',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://www.planethunters.org/',
        location: 'Worldwide',
        remote: true,
        skills: ['Data Analysis', 'Pattern Recognition', 'Astronomy', 'Computer Skills'],
        eligibility: ['All ages', 'Internet access', 'Basic computer skills'],
        source: 'NASA',
        difficulty: 'Intermediate',
        timeCommitment: '2-5 hours/week'
        // Removed image field
      },
      {
        id: 'galaxy-zoo',
        title: 'Galaxy Zoo - Classify Galaxies',
        description: 'Help astronomers classify galaxies captured by NASA\'s space telescopes. Contribute to our understanding of galaxy formation and evolution.',
        type: 'citizen-science',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://www.galaxyzoo.org/',
        location: 'Worldwide',
        remote: true,
        skills: ['Pattern Recognition', 'Astronomy', 'Visual Analysis', 'Classification'],
        eligibility: ['All ages', 'Interest in astronomy', 'Good visual perception'],
        source: 'NASA',
        difficulty: 'Beginner',
        timeCommitment: '1-3 hours/week'
        // Removed image field
      },
      {
        id: 'asteroid-hunters',
        title: 'Asteroid Hunters - Planetary Defense',
        description: 'Join the global effort to discover and track near-Earth asteroids. Use NASA data to identify potential threats to our planet.',
        type: 'citizen-science',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://www.asteroidhunters.org/',
        location: 'Worldwide',
        remote: true,
        skills: ['Astronomy', 'Data Analysis', 'Image Processing', 'Pattern Recognition'],
        eligibility: ['All ages', 'Basic astronomy knowledge', 'Computer access'],
        source: 'NASA',
        difficulty: 'Intermediate',
        timeCommitment: '3-6 hours/week'
        // Removed image field
      }
    ];

    return projects;
  }

  /**
   * Get NASA volunteer and outreach opportunities
   */
  async getNasaVolunteerPrograms(): Promise<Opportunity[]> {
    const programs: Opportunity[] = [
      {
        id: 'nasa-ambassador',
        title: 'NASA/JPL Solar System Ambassador Program',
        description: 'Become a NASA Solar System Ambassador and share the excitement of space exploration with your community through presentations and events.',
        type: 'volunteer',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://solarsystem.nasa.gov/solar-system-ambassadors/',
        location: 'Nationwide (US)',
        remote: true,
        skills: ['Public Speaking', 'Education', 'Communication', 'Space Science Knowledge'],
        eligibility: ['18+ years old', 'US residents', 'Public speaking experience preferred'],
        source: 'NASA',
        difficulty: 'Intermediate',
        timeCommitment: '10-15 hours/month'
        // Removed image field
      },
      {
        id: 'nasa-educator',
        title: 'NASA Educator Professional Development',
        description: 'Participate in NASA educator workshops and help bring authentic NASA content to classrooms and educational settings.',
        type: 'volunteer',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://www.nasa.gov/audience/foreducators/',
        location: 'NASA Centers & Virtual',
        remote: true,
        skills: ['Education', 'Curriculum Development', 'Workshop Facilitation', 'STEM Teaching'],
        eligibility: ['Current educators', 'Education background', 'Passion for STEM'],
        source: 'NASA',
        difficulty: 'Intermediate',
        timeCommitment: '5-10 hours/week'
        // Removed image field
      },
      {
        id: 'nasa-museum-alliance',
        title: 'NASA Museum Alliance Volunteer',
        description: 'Support NASA\'s Museum Alliance by helping with exhibits, events, and educational programs at participating museums.',
        type: 'volunteer',
        startDate: new Date().toISOString().split('T')[0],
        url: 'https://informal.jpl.nasa.gov/museum/',
        location: 'Alliance Museums Nationwide',
        remote: false,
        skills: ['Museum Education', 'Public Engagement', 'Event Support', 'Communication'],
        eligibility: ['All ages', 'Museum volunteer experience helpful', 'Flexible schedule'],
        source: 'NASA',
        difficulty: 'Beginner',
        timeCommitment: '4-8 hours/week'
        // Removed image field
      }
    ];

    return programs;
  }

  /**
   * Get comprehensive NASA internship programs
   */
  async getNasaInternshipPrograms(): Promise<Opportunity[]> {
    const programs: Opportunity[] = [
      {
        id: 'nasa-usrp',
        title: 'NASA Undergraduate Student Research Program (USRP)',
        description: 'Work alongside NASA scientists and engineers on cutting-edge research projects during summer internships at NASA centers.',
        type: 'internship',
        startDate: '2025-06-01',
        endDate: '2025-08-15',
        deadline: '2025-03-01',
        url: 'https://nasa.gov/learning-resources/internship-programs/',
        location: 'NASA Centers Nationwide',
        remote: false,
        skills: ['Research', 'Engineering', 'Data Analysis', 'Problem Solving', 'Scientific Writing'],
        eligibility: ['Undergraduate students', 'US Citizens', 'GPA 3.0+', 'STEM majors'],
        source: 'NASA',
        difficulty: 'Intermediate',
        timeCommitment: '40 hours/week'
        // Removed image field
      },
      {
        id: 'nasa-pathways',
        title: 'NASA Pathways Intern Program',
        description: 'Multi-year internship program offering career development opportunities with potential for full-time employment after graduation.',
        type: 'internship',
        startDate: '2025-05-15',
        endDate: '2025-12-15',
        deadline: '2025-02-15',
        url: 'https://nasa.gov/learning-resources/pathways-intern-program/',
        location: 'NASA Centers Nationwide',
        remote: false,
        skills: ['Engineering', 'Computer Science', 'Project Management', 'Research', 'Technical Communication'],
        eligibility: ['Current students', 'Recent graduates', 'US Citizens', 'Security clearance eligible'],
        source: 'NASA',
        difficulty: 'Advanced',
        timeCommitment: '40 hours/week'
        // Removed image field
      },
      {
        id: 'nasa-ossi',
        title: 'One Stop Shopping Initiative (OSSI) Internships',
        description: 'Research internships across all NASA mission directorates, providing hands-on experience in space science and technology.',
        type: 'internship',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        deadline: '2025-03-15',
        url: 'https://nasa.gov/learning-resources/ossi/',
        location: 'NASA Centers & Universities',
        remote: false,
        skills: ['Research Methods', 'Data Analysis', 'Scientific Computing', 'Technical Writing', 'Collaboration'],
        eligibility: ['Graduate students', 'Advanced undergraduates', 'US Citizens', 'Research experience preferred'],
        source: 'NASA',
        difficulty: 'Advanced',
        timeCommitment: '40 hours/week'
        // Removed image field
      }
    ];

    return programs;
  }

  /**
   * Fetch all NASA opportunities with optional filtering
   */
  async getOpportunities(filters: OpportunityFilters = {}): Promise<OpportunityResponse> {
    try {
      const limit = filters.limit || 50;
      
      // Fetch from multiple NASA APIs and program sources in parallel
      const [
        nasaImages, 
        techPortProjects, 
        apodOpportunities, 
        citizenScienceProjects,
        volunteerPrograms,
        internshipPrograms
      ] = await Promise.allSettled([
        this.getNasaImages('student OR internship OR education OR opportunity OR program OR volunteer OR citizen science OR outreach', Math.floor(limit * 0.25)),
        this.getTechPortProjects(Math.floor(limit * 0.15)),
        this.getApodOpportunities(Math.floor(limit * 0.15)),
        this.getNasaCitizenScienceProjects(),
        this.getNasaVolunteerPrograms(),
        this.getNasaInternshipPrograms()
      ]);

      let allOpportunities: Opportunity[] = [];

      // Combine results from all sources
      if (nasaImages.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...nasaImages.value];
      }
      if (techPortProjects.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...techPortProjects.value];
      }
      if (apodOpportunities.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...apodOpportunities.value];
      }
      if (citizenScienceProjects.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...citizenScienceProjects.value];
      }
      if (volunteerPrograms.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...volunteerPrograms.value];
      }
      if (internshipPrograms.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...internshipPrograms.value];
      }

      // Remove duplicates based on ID
      const uniqueOpportunities = allOpportunities.filter((opportunity, index, self) =>
        index === self.findIndex(o => o.id === opportunity.id)
      );

      // Apply filters
      let filteredOpportunities = uniqueOpportunities;

      if (filters.type && filters.type !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.type === filters.type);
      }

      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.difficulty === filters.difficulty);
      }

      if (filters.remote) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.remote);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOpportunities = filteredOpportunities.filter(opp =>
          opp.title.toLowerCase().includes(searchTerm) ||
          opp.description.toLowerCase().includes(searchTerm) ||
          opp.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
          opp.location.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by type priority (internships first, then volunteer, then citizen science)
      const typePriority = { 'internship': 1, 'volunteer': 2, 'citizen-science': 3 };
      filteredOpportunities.sort((a, b) => {
        const priorityDiff = typePriority[a.type] - typePriority[b.type];
        if (priorityDiff !== 0) return priorityDiff;
        return a.title.localeCompare(b.title);
      });

      return {
        success: true,
        data: filteredOpportunities,
        meta: {
          total: filteredOpportunities.length,
          limit: limit,
          offset: filters.offset || 0,
          hasMore: false
        }
      };
    } catch (error) {
      console.error('Error fetching NASA opportunities:', error);
      throw error;
    }
  }

  /**
   * Get opportunity statistics
   */
  async getOpportunityStats(): Promise<{ success: boolean; data: OpportunityStats }> {
    try {
      const opportunities = await this.getOpportunities({ limit: 100 });
      const data = opportunities.data;

      return {
        success: true,
        data: {
          total: data.length,
          byType: {
            internship: data.filter(o => o.type === 'internship').length,
            volunteer: data.filter(o => o.type === 'volunteer').length,
            'citizen-science': data.filter(o => o.type === 'citizen-science').length,
          },
          byDifficulty: {
            Beginner: data.filter(o => o.difficulty === 'Beginner').length,
            Intermediate: data.filter(o => o.difficulty === 'Intermediate').length,
            Advanced: data.filter(o => o.difficulty === 'Advanced').length,
          },
          remote: data.filter(o => o.remote).length,
          onSite: data.filter(o => !o.remote).length,
        }
      };
    } catch (error) {
      console.error('Error fetching opportunity stats:', error);
      throw error;
    }
  }

  /**
   * Get NASA TechPort projects (legacy method for compatibility)
   */
  async getTechPortProjectsLegacy(): Promise<any> {
    try {
      const projects = await this.getTechPortProjects(10);
      return {
        success: true,
        data: { projects }
      };
    } catch (error) {
      console.error('Error fetching TechPort projects:', error);
      throw error;
    }
  }

  /**
   * Get citizen science projects (legacy method for compatibility)
   */
  async getCitizenScienceProjects(): Promise<{ success: boolean; data: Opportunity[] }> {
    try {
      const [apodOpportunities, citizenScienceProjects] = await Promise.allSettled([
        this.getApodOpportunities(5),
        this.getNasaCitizenScienceProjects()
      ]);

      let allOpportunities: Opportunity[] = [];
      
      if (apodOpportunities.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...apodOpportunities.value];
      }
      if (citizenScienceProjects.status === 'fulfilled') {
        allOpportunities = [...allOpportunities, ...citizenScienceProjects.value];
      }

      return {
        success: true,
        data: allOpportunities
      };
    } catch (error) {
      console.error('Error fetching citizen science projects:', error);
      throw error;
    }
  }
}

export const nasaOpportunitiesService = new NasaOpportunitiesService();
