export interface User {
  id: string;
  name: string;
  password: string;
  role: 'employee' | 'hr';
  position: string;
  department: string;
  image: string;
}

export interface Feedback {
  id: number;
  from: string;
  to: string;
  type: 'Peer' | 'Manager' | 'Upward';
  date: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  comments: string;
  isAnonymous: boolean;
}

export interface LeaveApplication {
  id: number;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  contactInfo: string;
  appliedOn: string;
  approvedOn?: string;
  rejectedOn?: string;
  rejectionReason?: string;
  days: number;
}

// Mock user database
export const users: User[] = [
  {
    id: 'EMP001',
    name: 'Rahul Sharma',
    password: 'rahul123',
    role: 'employee',
    position: 'Backend Developer',
    department: 'Engineering',
    image: 'https://randomuser.me/api/portraits/men/40.jpg'
  },
  {
    id: 'EMP002',
    name: 'Emily Johnson',
    password: 'emily123',
    role: 'employee',
    position: 'Marketing Specialist',
    department: 'Marketing',
    image: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    id: 'EMP003',
    name: 'Sneha Patel',
    password: 'sneha123',
    role: 'employee',
    position: 'Product Manager',
    department: 'Product',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 'EMP004',
    name: 'Priya Singh',
    password: 'priya123',
    role: 'employee',
    position: 'UX Designer',
    department: 'Design',
    image: 'https://randomuser.me/api/portraits/women/17.jpg'
  },
  {
    id: 'EMP005',
    name: 'Naveen Joshi',
    password: 'naveen123',
    role: 'employee',
    position: 'Frontend Developer',
    department: 'Engineering',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'HR001',
    name: 'Vikram Rathod',
    password: 'hr123',
    role: 'hr',
    position: 'HR Manager',
    department: 'Human Resources',
    image: 'https://randomuser.me/api/portraits/men/46.jpg'
  }
];

// Mock feedback database
export let feedbacks: Feedback[] = [
  // January Feedback
  {
    id: 1,
    from: 'EMP001',
    to: 'EMP002',
    type: 'Peer',
    date: '2024-01-15',
    rating: 4,
    strengths: ['Team player', 'Communication skills'],
    improvements: ['Time management'],
    comments: 'Emily is a great team player and communicates effectively.',
    isAnonymous: false
  },
  {
    id: 2,
    from: 'EMP002',
    to: 'EMP001',
    type: 'Peer',
    date: '2024-01-16',
    rating: 5,
    strengths: ['Technical skills', 'Problem solving'],
    improvements: ['Documentation'],
    comments: 'Rahul has excellent technical skills and problem-solving abilities.',
    isAnonymous: true
  },
  {
    id: 3,
    from: 'EMP003',
    to: 'EMP005',
    type: 'Peer',
    date: '2024-01-18',
    rating: 4,
    strengths: ['UI expertise', 'Creativity'],
    improvements: ['Meeting deadlines'],
    comments: 'Naveen creates beautiful interfaces but sometimes misses deadlines.',
    isAnonymous: false
  },
  {
    id: 4,
    from: 'HR001',
    to: 'EMP004',
    type: 'Manager',
    date: '2024-01-20',
    rating: 5,
    strengths: ['Design thinking', 'User empathy', 'Team collaboration'],
    improvements: ['Documentation'],
    comments: 'Priya consistently delivers high-quality designs that meet user needs.',
    isAnonymous: false
  },
  {
    id: 5,
    from: 'EMP004',
    to: 'EMP001',
    type: 'Peer',
    date: '2024-01-22',
    rating: 4,
    strengths: ['Problem-solving', 'Technical knowledge', 'Helpfulness'],
    improvements: ['Communication with non-technical team members'],
    comments: 'Rahul is very knowledgeable and always willing to help, but sometimes explains technical concepts in a way that is difficult for non-technical team members to understand.',
    isAnonymous: true
  },
  
  // February Feedback
  {
    id: 6,
    from: 'EMP001',
    to: 'EMP003',
    type: 'Peer',
    date: '2024-02-05',
    rating: 5,
    strengths: ['Product vision', 'Stakeholder management', 'Leadership'],
    improvements: ['Technical depth'],
    comments: 'Sneha is an exceptional product manager with a clear vision and excellent stakeholder management skills.',
    isAnonymous: false
  },
  {
    id: 7,
    from: 'EMP005',
    to: 'EMP001',
    type: 'Peer',
    date: '2024-02-10',
    rating: 5,
    strengths: ['Code quality', 'Architecture design', 'Mentorship'],
    improvements: ['Work-life balance'],
    comments: 'Rahul writes extremely clean and maintainable code. His architectural decisions are always well-thought-out.',
    isAnonymous: false
  },
  {
    id: 8,
    from: 'EMP002',
    to: 'EMP004',
    type: 'Peer',
    date: '2024-02-15',
    rating: 4,
    strengths: ['Visual design', 'User research', 'Creativity'],
    improvements: ['Handoff documentation'],
    comments: 'Priya creates beautiful designs that users love. Her creative process is impressive.',
    isAnonymous: false
  },
  {
    id: 9,
    from: 'HR001',
    to: 'EMP001',
    type: 'Manager',
    date: '2024-02-20',
    rating: 4,
    strengths: ['Technical leadership', 'Mentorship', 'Code quality'],
    improvements: ['Cross-team communication', 'Documentation'],
    comments: 'Rahul consistently delivers high-quality code and is a valuable technical leader. He should focus more on cross-team communication.',
    isAnonymous: false
  },
  {
    id: 10,
    from: 'EMP004',
    to: 'EMP005',
    type: 'Peer',
    date: '2024-02-25',
    rating: 3,
    strengths: ['Frontend skills', 'UI implementation'],
    improvements: ['Communication', 'Design consistency', 'Meeting deadlines'],
    comments: 'Naveen has good frontend skills but needs to improve communication with the design team and meet deadlines more consistently.',
    isAnonymous: true
  },
  
  // March Feedback
  {
    id: 11,
    from: 'EMP003',
    to: 'EMP001',
    type: 'Peer',
    date: '2024-03-03',
    rating: 5,
    strengths: ['Backend expertise', 'System design', 'Performance optimization'],
    improvements: ['Documentation', 'Knowledge sharing'],
    comments: 'Rahul is an exceptional backend developer. His systems are always well-designed and performant.',
    isAnonymous: false
  },
  {
    id: 12,
    from: 'EMP001',
    to: 'EMP005',
    type: 'Peer',
    date: '2024-03-08',
    rating: 3,
    strengths: ['UI implementation', 'CSS expertise'],
    improvements: ['Code structure', 'Component reusability', 'Testing'],
    comments: 'Naveen creates good UIs but needs to focus more on code structure, reusable components, and testing practices.',
    isAnonymous: false
  },
  {
    id: 13,
    from: 'EMP005',
    to: 'EMP002',
    type: 'Peer',
    date: '2024-03-12',
    rating: 4,
    strengths: ['Marketing strategy', 'Content creation', 'Data analysis'],
    improvements: ['Technical understanding'],
    comments: 'Emily has excellent marketing skills and content creation abilities. She could benefit from a deeper understanding of our technical products.',
    isAnonymous: false
  },
  {
    id: 14,
    from: 'HR001',
    to: 'EMP003',
    type: 'Manager',
    date: '2024-03-17',
    rating: 5,
    strengths: ['Product management', 'Team leadership', 'Strategic thinking'],
    improvements: ['Documentation', 'Delegation'],
    comments: 'Sneha is an outstanding product manager with excellent leadership skills. She could improve by delegating more and documenting decisions better.',
    isAnonymous: false
  },
  {
    id: 15,
    from: 'EMP004',
    to: 'EMP003',
    type: 'Peer',
    date: '2024-03-22',
    rating: 4,
    strengths: ['Product vision', 'User focus', 'Team coordination'],
    improvements: ['Design collaboration', 'Feedback timing'],
    comments: 'Sneha has a great product vision and keeps the team focused on user needs. She could collaborate more closely with the design team.',
    isAnonymous: false
  },
  
  // April Feedback
  {
    id: 16,
    from: 'EMP002',
    to: 'EMP003',
    type: 'Peer',
    date: '2024-04-05',
    rating: 5,
    strengths: ['Strategy alignment', 'Communication clarity', 'Product roadmap'],
    improvements: ['Marketing integration'],
    comments: 'Sneha does an excellent job aligning product strategy with company goals. Her communication is always clear and helpful.',
    isAnonymous: false
  },
  {
    id: 17,
    from: 'EMP003',
    to: 'EMP002',
    type: 'Peer',
    date: '2024-04-10',
    rating: 4,
    strengths: ['Marketing campaigns', 'Brand consistency', 'Social media strategy'],
    improvements: ['Product knowledge', 'Technical communication'],
    comments: 'Emily runs great marketing campaigns with consistent branding. She should deepen her product knowledge to better communicate technical features.',
    isAnonymous: false
  },
  {
    id: 18,
    from: 'EMP001',
    to: 'EMP004',
    type: 'Peer',
    date: '2024-04-15',
    rating: 5,
    strengths: ['Design systems', 'User testing', 'Visual design', 'Collaboration'],
    improvements: ['Technical constraints awareness'],
    comments: 'Priya creates amazing designs and is always open to collaboration. She could benefit from a deeper understanding of technical constraints.',
    isAnonymous: false
  },
  {
    id: 19,
    from: 'HR001',
    to: 'EMP002',
    type: 'Manager',
    date: '2024-04-18',
    rating: 4,
    strengths: ['Marketing strategy', 'Content quality', 'Team collaboration'],
    improvements: ['Project timelines', 'Resource planning'],
    comments: 'Emily develops excellent marketing strategies and quality content. She should focus on better project timeline management and resource planning.',
    isAnonymous: false
  },
  {
    id: 20,
    from: 'EMP005',
    to: 'EMP004',
    type: 'Peer',
    date: '2024-04-22',
    rating: 5,
    strengths: ['Design innovation', 'User empathy', 'Collaboration'],
    improvements: ['Technical handoff'],
    comments: 'Priya consistently creates innovative designs that show deep user empathy. Her design specs could be more detailed for easier implementation.',
    isAnonymous: false
  },
  
  // May Feedback
  {
    id: 21,
    from: 'EMP004',
    to: 'EMP002',
    type: 'Peer',
    date: '2024-05-03',
    rating: 4,
    strengths: ['Brand messaging', 'Campaign creativity', 'Audience targeting'],
    improvements: ['Design collaboration', 'Feedback integration'],
    comments: 'Emily crafts excellent brand messages and creative campaigns. She could work more closely with the design team during campaign development.',
    isAnonymous: false
  },
  {
    id: 22,
    from: 'EMP002',
    to: 'EMP005',
    type: 'Peer',
    date: '2024-05-08',
    rating: 3,
    strengths: ['Frontend implementation', 'UI animation'],
    improvements: ['Code quality', 'Testing', 'Documentation', 'Deadlines'],
    comments: 'Naveen creates appealing frontend implementations with nice animations, but needs to improve code quality, testing, and documentation.',
    isAnonymous: true
  },
  {
    id: 23,
    from: 'EMP003',
    to: 'EMP004',
    type: 'Peer',
    date: '2024-05-12',
    rating: 5,
    strengths: ['Design research', 'User testing', 'Visual design', 'Prototyping'],
    improvements: ['Design system documentation'],
    comments: 'Priya excels in all aspects of design, from research to final visuals. Her design system documentation could be more comprehensive.',
    isAnonymous: false
  },
  {
    id: 24,
    from: 'HR001',
    to: 'EMP005',
    type: 'Manager',
    date: '2024-05-15',
    rating: 3,
    strengths: ['Frontend skills', 'UI implementation'],
    improvements: ['Code quality', 'Meeting deadlines', 'Team communication'],
    comments: 'Naveen has good frontend skills but needs significant improvement in code quality, meeting deadlines, and team communication.',
    isAnonymous: false
  },
  {
    id: 25,
    from: 'EMP001',
    to: 'HR001',
    type: 'Upward',
    date: '2024-05-20',
    rating: 5,
    strengths: ['Leadership', 'Team support', 'Feedback quality', 'Career development'],
    improvements: ['Technical understanding'],
    comments: 'Vikram is an excellent HR manager who provides great support and quality feedback. A deeper understanding of technical roles would help with career planning.',
    isAnonymous: false
  },
  
  // Feedback to HR from all employees
  {
    id: 26,
    from: 'EMP002',
    to: 'HR001',
    type: 'Upward',
    date: '2024-02-28',
    rating: 4,
    strengths: ['Employee advocacy', 'Policy clarity', 'Conflict resolution'],
    improvements: ['Process efficiency', 'Digital tools'],
    comments: 'Vikram is a strong advocate for employees and clearly explains policies. HR processes could be more efficient with better digital tools.',
    isAnonymous: true
  },
  {
    id: 27,
    from: 'EMP003',
    to: 'HR001',
    type: 'Upward',
    date: '2024-03-25',
    rating: 5,
    strengths: ['Strategic planning', 'Team building', 'Career development support'],
    improvements: ['Role-specific training'],
    comments: 'Vikram excels at strategic HR planning and team building. More role-specific training opportunities would be beneficial.',
    isAnonymous: false
  },
  {
    id: 28,
    from: 'EMP004',
    to: 'HR001',
    type: 'Upward',
    date: '2024-04-30',
    rating: 4,
    strengths: ['Employee well-being', 'Work-life balance initiatives', 'Approachability'],
    improvements: ['Design career path clarity'],
    comments: 'Vikram prioritizes employee well-being and is always approachable. Design-specific career paths could be better defined.',
    isAnonymous: true
  },
  {
    id: 29,
    from: 'EMP005',
    to: 'HR001',
    type: 'Upward',
    date: '2024-05-22',
    rating: 3,
    strengths: ['Policy communication', 'Benefits management'],
    improvements: ['Technical understanding', 'Feedback specificity', 'Development opportunities'],
    comments: 'Vikram communicates policies well, but feedback for technical roles lacks specificity. More development opportunities would be appreciated.',
    isAnonymous: true
  }
];

// Function to add new feedback
export const addFeedback = (newFeedback: Omit<Feedback, 'id'>): Feedback => {
  const newId = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1;
  const feedbackWithId = { ...newFeedback, id: newId };
  feedbacks = [...feedbacks, feedbackWithId];
  return feedbackWithId;
};

// Mock leave applications database
export let leaveApplications: LeaveApplication[] = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Rahul Sharma',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    type: 'Annual Leave',
    reason: 'Family vacation',
    status: 'Pending',
    contactInfo: '+91 98765 43210',
    appliedOn: '2024-03-15',
    days: 5
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Emily Johnson',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    type: 'Sick Leave',
    reason: 'Medical appointment',
    status: 'Approved',
    contactInfo: '+91 87654 32109',
    appliedOn: '2024-03-20',
    approvedOn: '2024-03-21',
    days: 3
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Sneha Patel',
    startDate: '2024-05-10',
    endDate: '2024-05-15',
    type: 'Annual Leave',
    reason: 'Personal vacation',
    status: 'Approved',
    contactInfo: '+91 76543 21098',
    appliedOn: '2024-03-18',
    approvedOn: '2024-03-19',
    days: 6
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Priya Singh',
    startDate: '2024-04-15',
    endDate: '2024-04-16',
    type: 'Sick Leave',
    reason: 'Not feeling well',
    status: 'Pending',
    contactInfo: '+91 65432 10987',
    appliedOn: '2024-03-25',
    days: 2
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Naveen Joshi',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    type: 'Annual Leave',
    reason: 'Family event',
    status: 'Rejected',
    contactInfo: '+91 54321 09876',
    appliedOn: '2024-03-10',
    rejectedOn: '2024-03-12',
    rejectionReason: 'Critical project deadline during this period',
    days: 5
  }
];

// Function to add new leave application
export const addLeaveApplication = (newLeave: Omit<LeaveApplication, 'id'>) => {
  const newId = leaveApplications.length > 0 ? Math.max(...leaveApplications.map(l => l.id)) + 1 : 1;
  const leaveWithId = { ...newLeave, id: newId };
  leaveApplications = [...leaveApplications, leaveWithId];
  return leaveWithId;
};

// Function to update leave status
export const updateLeaveStatus = (
  id: number, 
  status: 'Approved' | 'Rejected' | 'Pending', 
  reason?: string, 
  approvedOn?: string, 
  rejectedOn?: string
) => {
  leaveApplications = leaveApplications.map(leave => {
    if (leave.id === id) {
      if (status === 'Approved') {
        return { 
          ...leave, 
          status, 
          approvedOn: approvedOn || new Date().toISOString().split('T')[0],
          rejectedOn: undefined,
          rejectionReason: undefined
        };
      } else if (status === 'Rejected') {
        return { 
          ...leave, 
          status, 
          rejectedOn: rejectedOn || new Date().toISOString().split('T')[0], 
          rejectionReason: reason,
          approvedOn: undefined
        };
      } else {
        return {
          ...leave,
          status,
          approvedOn: undefined,
          rejectedOn: undefined,
          rejectionReason: undefined
        };
      }
    }
    return leave;
  });
}; 