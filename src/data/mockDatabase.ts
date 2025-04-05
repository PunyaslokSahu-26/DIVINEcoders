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
  {
    id: 1,
    from: 'EMP001',
    to: 'EMP002',
    type: 'Peer',
    date: '2024-03-15',
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
    date: '2024-03-16',
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
    date: '2024-03-18',
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
    date: '2024-03-20',
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
    date: '2024-03-22',
    rating: 4,
    strengths: ['Problem-solving', 'Technical knowledge', 'Helpfulness'],
    improvements: ['Communication with non-technical team members'],
    comments: 'Rahul is very knowledgeable and always willing to help, but sometimes explains technical concepts in a way that is difficult for non-technical team members to understand.',
    isAnonymous: true
  }
];

// Function to add new feedback
export const addFeedback = (newFeedback: Omit<Feedback, 'id'>) => {
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