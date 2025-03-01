import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import nlp from 'compromise';

// Types
export interface Review {
  id: string;
  serviceId: string;
  reviewerId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PlagiarismResult {
  id: string;
  serviceId: string;
  text: string;
  originalityScore: number; // 0-100, higher is more original
  matches: PlagiarismMatch[];
  createdAt: string;
}

export interface PlagiarismMatch {
  text: string;
  similarity: number; // 0-100
  source?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string; // service or user ID
  targetType: 'service' | 'user';
  reason: string;
  details: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface IntegrityContextType {
  reviews: Review[];
  plagiarismResults: PlagiarismResult[];
  reports: Report[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<Review>;
  getServiceReviews: (serviceId: string) => Review[];
  getUserReviews: (userId: string) => Review[];
  checkPlagiarism: (text: string, serviceId: string) => Promise<PlagiarismResult>;
  reportViolation: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => Promise<Report>;
  getAverageRating: (userId: string) => number;
}

const IntegrityContext = createContext<IntegrityContextType | undefined>(undefined);

export const useIntegrity = () => {
  const context = useContext(IntegrityContext);
  if (context === undefined) {
    throw new Error('useIntegrity must be used within an IntegrityProvider');
  }
  return context;
};

interface IntegrityProviderProps {
  children: ReactNode;
}

export const IntegrityProvider = ({ children }: IntegrityProviderProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [plagiarismResults, setPlagiarismResults] = useState<PlagiarismResult[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    const storedPlagiarismResults = localStorage.getItem('plagiarismResults');
    const storedReports = localStorage.getItem('reports');
    
    if (storedReviews) setReviews(JSON.parse(storedReviews));
    if (storedPlagiarismResults) setPlagiarismResults(JSON.parse(storedPlagiarismResults));
    if (storedReports) setReports(JSON.parse(storedReports));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('plagiarismResults', JSON.stringify(plagiarismResults));
  }, [plagiarismResults]);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  // Add a new review
  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setReviews(prev => [...prev, newReview]);
    return newReview;
  };

  // Get reviews for a specific service
  const getServiceReviews = (serviceId: string): Review[] => {
    return reviews.filter(review => review.serviceId === serviceId);
  };

  // Get reviews for a specific user (as provider)
  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => review.providerId === userId);
  };

  // Get average rating for a user
  const getAverageRating = (userId: string): number => {
    const userReviews = getUserReviews(userId);
    if (userReviews.length === 0) return 0;
    
    const total = userReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / userReviews.length;
  };

  // Simple plagiarism detection simulation
  const checkPlagiarism = async (text: string, serviceId: string): Promise<PlagiarismResult> => {
    // This is a simplified simulation of plagiarism detection
    // In a real application, you would integrate with a proper service like Turnitin
    
    // Parse the text with compromise NLP
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    
    // Simulate some "matches" for demonstration purposes
    const matches: PlagiarismMatch[] = [];
    
    // Create some dummy matches for longer texts
    if (sentences.length > 3) {
      // Pseudo-randomly select 1-3 sentences to mark as "similar to external sources"
      const maxMatches = Math.min(3, Math.floor(sentences.length / 3));
      const matchCount = Math.max(1, Math.floor(Math.random() * maxMatches));
      
      for (let i = 0; i < matchCount; i++) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        const sentence = sentences[randomIndex];
        
        // Only add if the sentence is substantial
        if (sentence.split(' ').length > 5) {
          const similarity = 40 + Math.floor(Math.random() * 50); // Generate a similarity between 40-90%
          
          matches.push({
            text: sentence,
            similarity,
            source: `Sample Academic Source ${i + 1}`
          });
        }
      }
    }
    
    // Calculate originality score based on matches
    // More/higher matches = lower originality score
    let originalityScore = 100;
    if (matches.length > 0) {
      const similarityAvg = matches.reduce((sum, match) => sum + match.similarity, 0) / matches.length;
      originalityScore = Math.max(0, 100 - (matches.length * 5) - (similarityAvg * 0.2));
    }
    
    const result: PlagiarismResult = {
      id: `plagiarism_${Date.now()}`,
      serviceId,
      text,
      originalityScore,
      matches,
      createdAt: new Date().toISOString()
    };
    
    setPlagiarismResults(prev => [...prev, result]);
    return result;
  };

  // Report a user or service for violating guidelines
  const reportViolation = async (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>): Promise<Report> => {
    const newReport: Report = {
      ...reportData,
      id: `report_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setReports(prev => [...prev, newReport]);
    return newReport;
  };

  return (
    <IntegrityContext.Provider value={{
      reviews,
      plagiarismResults,
      reports,
      addReview,
      getServiceReviews,
      getUserReviews,
      checkPlagiarism,
      reportViolation,
      getAverageRating
    }}>
      {children}
    </IntegrityContext.Provider>
  );
};
