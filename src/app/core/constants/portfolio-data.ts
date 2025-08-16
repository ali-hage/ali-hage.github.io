import { PortfolioData } from '../models';

export const PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    name: 'Ali Hage Hassan',
    title: 'Maritime Engineer',
    description: 'Bridging maritime expertise with modern innovation through comprehensive vessel operations, advanced offshore systems, and strategic port coordination across diverse international waters.',
    location: 'Constanta, Romania',
    linkedIn: 'https://linkedin.com/in/ali-hage-hassan-609554232'
  },
  coreValues: [
    {
      title: 'Precision & Excellence',
      description: 'Commitment to operational accuracy and safety standards in all maritime activities.',
      icon: 'precision'
    },
    {
      title: 'Innovation Through Tradition',
      description: 'Bridging time-tested maritime practices with cutting-edge technology solutions.',
      icon: 'innovation'
    },
    {
      title: 'Environmental Stewardship',
      description: 'Dedicated to sustainable maritime practices and marine environment protection.',
      icon: 'environment'
    },
    {
      title: 'Collaborative Leadership',
      description: 'Fostering teamwork and effective communication across multicultural maritime teams.',
      icon: 'leadership'
    }
  ],
  experience: [
    {
      title: 'Maritime Agent',
      company: 'Lion Shipping and Chartering',
      period: '2022 - Present',
      description: 'Coordinating comprehensive vessel operations, managing port authority relationships, and providing full-service ship agency solutions in Constanta Port. Supervising crew changes, cargo operations, and regulatory compliance.',
      skills: ['Ship Operations', 'Port Coordination', 'Documentation', 'Crew Management', 'Regulatory Compliance'],
      current: true
    },
    {
      title: 'Training Program',
      company: 'Romanian Agency for Saving Human Life at Sea',
      period: 'May 2022',
      description: 'Intensive specialized training in marine pollution control systems, advanced tug operations, and search and rescue coordination procedures. Gained hands-on experience in emergency response protocols.',
      skills: ['SAR Operations', 'Pollution Control', 'Tug Operations', 'Emergency Response', 'Maritime Safety']
    },
    {
      title: 'Deck Cadet Officer',
      company: 'Spania Trading Ltd',
      period: '2020',
      description: 'Comprehensive hands-on experience in vessel operations, advanced navigation systems, and cargo handling procedures. Worked directly with senior officers on bridge operations and ship management.',
      skills: ['ECDIS', 'RADAR', 'Navigation', 'Cargo Operations', 'Bridge Operations']
    },
    {
      title: 'Deck Cadet Officer',
      company: 'Spania Trading Ltd',
      period: '2019',
      description:  'hands-on experience on board a general cargo vessel.',
      skills: ['Cargo operation supervisor', 'Tank sounding', 'Draft readings']
    }

    
  ],
  education: [
    {
      degree: 'Master\'s Degree in Offshore Oil and Gas Technology and Management',
      institution: 'Maritime University Of Constanţa, Romania',
      coursework: [
        'Knowledge in operation of DP system',
        'Maintainance of DP Systems',
        'Removing the marine and offshore structures',
        'Risk analysis and risk management',
        'Safety and environmental aspects',
        'Offshore field development',
        'Operation of Specialized Ships (tanks and bulk carriers)',
        'Evaluate and optimize the performance of organization and management methods from offshore oil and gas industry'
      ]
    },
    {
      degree: 'Master\'s Degree in Engineering and Management in Maritime and Multimodal Transport',
      institution: 'Maritime University Of Constanţa, Constanța, Romania',
      coursework: [
        'Integrated transport management systems',
        'Advanced concepts of naval architecture',
        'European law and Schengen legislation',
        'Ship management and administration',
        'Logistics in multimodal transport',
        'Survey and audit of cargo and means of transport',
        'Operation of Specialized Ships (tanks and bulk carriers)',
        'Maritime Insurance / Maritime Trade'
      ]
    },
    {
      degree: 'Bachelor of Engineering Degree in Navigation and Waterborne Transport',
      institution: 'Maritime University Of Constanţa, Constanța, Romania',
      coursework: [
        'Navigation and Cart Team Management',
        'Control of Trim, Stability and Tension in the hull',
        'Coastal, astronomical and electronic navigation, ECDIS, RADAR',
        'Marine training',
        'Marine meteorology',
        'Naval accident research, Protection of the marine environment',
        'Maritime insurance, Inspections and audits on board the ship'
      ]
    }
  ],
  skills: [
    {
      label: 'Maritime Operations',
      skills: ['Ship Agency Services', 'Port Coordination', 'Vessel Operations', 'Crew Management', 'Documentation', 'Regulatory Compliance'],
      icon: 'ship'
    },
    {
      label: 'Navigation & Safety',
      skills: ['ECDIS Systems', 'RADAR Operations', 'Emergency Response', 'SAR Operations', 'Pollution Control', 'Maritime Safety'],
      icon: 'navigation'
    },
    {
      label: 'Offshore Technology',
      skills: ['Dynamic Positioning', 'Offshore Operations', 'Risk Assessment', 'Environmental Compliance', 'Oil & Gas Systems'],
      icon: 'offshore'
    },
    {
      label: 'Languages',
      skills: ['Arabic (Native)', 'English (Fluent)', 'Romanian (Fluent)', 'French (B2)'],
      icon: 'language'
    }
  ],
  certifications: [
    {
      category: 'Maritime Basic Training',
      certifications: [
        'Personal survival techniques',
        'Personal safety and social responsibilities in board ships',
        'Basic fire fighting',
        'Elementary first aid'
      ]
    },
    {
      category: 'Maritime Security & Specialized Training',
      certifications: [
        'Certificate of Proficiency in security awareness training and security training for seafarers with designated security duties',
        'Basic training for oil and chemical tanker cargo operation',
        'Basic training for liquefied gas tanker cargo operation'
      ]
    },
    {
      category: 'Python Programming Certifications',
      certifications: [
        'Python 3 Programming',
        'Python Basics',
        'Python Project: pillow, tesseract, and opencv',
        'Python Classes and Inheritance',
        'Python Functions, Files, and Dictionaries',
        'Data Collection and Processing with Python'
      ]
    },
    {
      category: 'Google IT Automation with Python Certification',
      certifications: [
        'Introduction to Git and GitHub',
        'Crash Course on Python',
        'Using Python to Interact with the Operating System',
        'Configuration Management and the Cloud',
        'Automating Real-World Tasks with Python',
        'Troubleshooting and Debugging Techniques'
      ]
    },
    {
      category: 'Diverse Certifications',
      certifications: [
        'Negotiation Fundamentals',
        'Introduction to Data Science in Python',
        'Machine Learning for All',
        'Applied Machine Learning in Python',
        'Applied Plotting, Charting & Data Representation in Python'
      ]
    }
  ],
  socialLinks: [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/ali-hage-hassan-609554232',
      icon: 'linkedin'
    }
  ],
  navigation: [
    {
      label: 'Home',
      route: '/',
      icon: 'home'
    },
    {
      label: 'About',
      route: '/about',
      icon: 'person'
    },
    {
      label: 'Certifications',
      route: '/certifications',
      icon: 'certificate'
    }
  ]
};