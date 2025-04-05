import React, { useState, useRef, useEffect } from 'react';
import ChatbotIcon from "./ChatbotIcon";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define types for our component
interface Message {
  role: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

interface BotResponse {
  response: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I\'m your HR Assistant. How can I help you today? You can ask about leave policies, benefits, payroll, or any other HR-related questions.' }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Toggle speech recognition
  const toggleListening = (): void => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      recognition.current?.start();
      setIsListening(true);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chatbot to initial state
  const handleReset = (): void => {
    setMessages([
      { role: 'bot', text: 'Hello! I\'m your HR Assistant. How can I help you today? You can ask about leave policies, benefits, payroll, or any other HR-related questions.' }
    ]);
    setUserInput('');
  };

  // Function to call the HR chatbot API with authentication
  const fetchBotResponse = async (userQuery: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Updated with a more realistic API endpoint (replace with your actual endpoint)
      const response = await fetch('https://api.company.com/hr/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('user_token'), // Authentication token
          'X-Employee-ID': localStorage.getItem('employee_id'), // Employee identifier
        },
        body: JSON.stringify({
          query: userQuery,
          // User context from authentication system
          userId: localStorage.getItem('employee_id'),
          department: localStorage.getItem('department'),
          role: localStorage.getItem('job_role'),
          manager: localStorage.getItem('manager_id'),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: BotResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching from HR API:', error);
      // Fall back to local responses if API call fails
      return getHRFallbackResponse(userQuery);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated HR responses for common questions (as fallback) with company-specific policies
  const getHRFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('leave') || lowerQuery.includes('vacation') || lowerQuery.includes('pto')) {
      return "Based on our company policy, full-time employees are entitled to 25 days of paid time off annually, accruing at 2.08 days per month. Senior employees (5+ years) receive 30 days. Leave requests must be submitted through Workday at least 5 business days in advance for approval by your direct manager. For emergency leave, please contact both your manager and HR directly.";
    }

    if (lowerQuery.includes('onboarding') || lowerQuery.includes('new hire') || lowerQuery.includes('first day')) {
      return "Welcome to the team! As a new hire, your onboarding tasks are available in Workday, including benefits enrollment, compliance training, and equipment setup. Your manager should have scheduled your orientation session and team introductions. For any onboarding concerns, contact onboarding@company.com or your assigned onboarding buddy.";
    }
    
    if (lowerQuery.includes('timesheet') || lowerQuery.includes('attendance') || lowerQuery.includes('clock in') || lowerQuery.includes('hours')) {
      return "Employees are required to submit their timesheets by Friday 5 PM each week through the TimeTracker portal. If you experience issues clocking in/out or need to correct hours, please inform your manager and submit a correction form through the portal.";
    }
    
    if (lowerQuery.includes('access') || lowerQuery.includes('vpn') || lowerQuery.includes('system') || lowerQuery.includes('tools')) {
      return "For system or VPN access issues, please contact IT Support via the Service Desk portal or email helpdesk@company.com. New tool access requests must be approved by your manager and submitted through the IT Request form.";
    }
    
    if (lowerQuery.includes('diversity') || lowerQuery.includes('inclusion') || lowerQuery.includes('dei')) {
      return "Our DEI initiatives include employee resource groups (ERGs), inclusive leadership training, and quarterly DEI forums. We value a diverse and inclusive workplace—learn more or get involved by visiting the DEI section on our intranet or emailing dei@company.com.";
    }
    
    if (lowerQuery.includes('relocation') || lowerQuery.includes('transfer') || lowerQuery.includes('move')) {
      return "Interested in relocating or transferring to a new team or location? Internal transfer requests can be initiated in Workday and must be discussed with both your current and prospective managers. For relocations, our HR mobility team can assist with logistics, housing, and transition support.";
    }
    
    if (lowerQuery.includes('holiday') || lowerQuery.includes('company holidays') || lowerQuery.includes('office closed')) {
      return "Our company observes 12 paid holidays annually, including major federal holidays and a winter shutdown between December 24 and January 1. The full holiday calendar is available on the HR portal.";
    }

    if (lowerQuery.includes('salary') || lowerQuery.includes('pay') || lowerQuery.includes('payroll')) {
      return "Our company processes payroll on the 28th of each month, with statements available in the employee portal 2 days prior. Annual performance-based salary reviews occur in April. For confidential payroll inquiries, please email payroll@company.com with your employee ID and query details, or schedule a meeting with our compensation specialist through the HR portal.";
    }
    
    if (lowerQuery.includes('benefits') || lowerQuery.includes('insurance') || lowerQuery.includes('health')) {
      return "Our comprehensive benefits package includes premium health insurance with Blue Cross (90% employer-paid), dental and vision coverage, 401(k) matching up to 6%, annual wellness stipend of $500, mental health services, parental leave (16 weeks), and education assistance (up to $5,000/year). Open enrollment is in November, but life events allow for mid-year changes. View full details in our benefits portal or schedule a consultation with our benefits coordinator.";
    }
    
    if (lowerQuery.includes('complaint') || lowerQuery.includes('issue') || lowerQuery.includes('problem') || lowerQuery.includes('harassment')) {
      return "I understand you're facing an issue. Our company takes all workplace concerns seriously. You can report issues through our confidential EthicsLine at 1-800-555-1234, email confidential@company.com, or schedule a private meeting with an HR representative through our booking system. All reports are handled with strict confidentiality according to our non-retaliation policy.";
    }
    
    if (lowerQuery.includes('training') || lowerQuery.includes('development') || lowerQuery.includes('learning')) {
      return "Our company offers various professional development opportunities including LinkedIn Learning access, department-specific training budgets of $2,000 annually, monthly lunch-and-learn sessions, tuition reimbursement for approved courses, and our mentorship program. Speak with your manager about your development plan or visit the Learning Portal to browse available courses and request enrollment.";
    }
    
    if (lowerQuery.includes('remote') || lowerQuery.includes('wfh') || lowerQuery.includes('work from home')) {
      return "Our hybrid work policy allows most employees to work remotely 2-3 days per week, with core in-office days on Tuesday and Wednesday. Specific arrangements should be discussed with your manager. Full-remote positions require VP approval. Please ensure your work location is updated in Workday, and refer to the Remote Work Policy in the employee handbook for equipment and expense reimbursement guidelines.";
    }
    
    if (lowerQuery.includes('promotion') || lowerQuery.includes('career') || lowerQuery.includes('advancement')) {
      return "Career advancement at our company involves regular performance reviews (semi-annual), career development plans, and our internal job posting system. All positions are posted internally for 5 business days before external recruitment begins. Speak with your manager about your career goals during your next 1:1 meeting, or contact our talent development team at careers@company.com to discuss growth opportunities.";
    }

    if (lowerQuery.includes('recognition') || lowerQuery.includes('reward') || lowerQuery.includes('appreciation')) {
      return "We love recognizing great work! Use the Kudos platform to send appreciation to your peers, or nominate someone for a quarterly excellence award. Learn more in the Recognition section on the intranet or during team stand-ups.";
    }

    if (lowerQuery.includes('feedback') || lowerQuery.includes('suggestion') || lowerQuery.includes('idea box')) {
      return "We welcome your feedback! Submit your suggestions through the anonymous Employee Feedback Form on our HR portal, or attend the monthly town hall where employee voices are heard directly by leadership.";
    }
    
    if (lowerQuery.includes('resignation') || lowerQuery.includes('quit') || lowerQuery.includes('leaving')) {
      return "If you're considering leaving the company, our standard notice period is 2 weeks for most positions and 4 weeks for leadership roles. Please submit your formal resignation in writing to your manager and HR@company.com. An exit interview will be scheduled, and our HR team will guide you through the offboarding process including benefits continuation options, equipment return, and final paycheck timing.";
    }
    
    return "I'm here to help with HR-related questions about our company policies. You can ask about leave policies, benefits, payroll, remote work arrangements, career development, workplace issues, or any other HR matters. If I can't answer your specific question, I'll direct you to the right resource within our HR team.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userQuestion = userInput.trim();
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);
    setUserInput('');
    
    // Add typing indicator
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'bot', text: '...', isTyping: true }]);
    
    // Get bot response from API or fallback
    const botResponse = await fetchBotResponse(userQuestion);
    
    // Remove typing indicator and add actual response
    setMessages(prev => prev.filter(msg => !msg.isTyping).concat({ role: 'bot', text: botResponse }));
    setIsLoading(false);
  };

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">smart_toy</span>
          </button>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl flex flex-col h-96 md:h-[32rem] transition-all duration-300">
            {/* Chatbot Header */}
            <div className="flex items-center justify-between rounded-t-2xl px-4 py-3 bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <ChatbotIcon />
                <h2 className="text-lg font-semibold">HR Assistant</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={handleReset}
                  title="Restart conversation"
                >
                  <span className="material-symbols-outlined">refresh</span>
                </button>
                <button 
                  className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* ChatBot Body */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'bot' ? 'items-start' : 'items-end justify-end'} mb-4`}
                >
                  {message.role === 'bot' && <ChatbotIcon />}
                  <p 
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      message.role === 'bot' 
                        ? 'bg-gray-100 text-gray-800 ml-2' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.isTyping ? 
                      <span className="flex space-x-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span> : 
                      message.text
                    }
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* ChatBot Footer */}
            <div className="border-t border-gray-200 p-3 rounded-b-2xl">
              <form onSubmit={handleSubmit} className="flex items-center">
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`${isListening ? 'bg-red-500' : 'bg-gray-200 hover:bg-gray-300'} p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2`}
                  title="Voice input"
                >
                  <span className="material-symbols-outlined">
                    {isListening ? 'mic' : 'mic_none'}
                  </span>
                </button>
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask an HR question..." 
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  className={`${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-full ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined">{isLoading ? 'hourglass_top' : 'send'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;