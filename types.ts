
export interface ProductInfo {
  title: string;
  price: string;
  bsr: string;
  reviews: number;
  launchDate: string;
  isNewRelease: boolean;
}

export interface TrendData {
  period: string;
  growth: string;
  isSeasonal: boolean;
  searchVolumeLevel: 'Low' | 'Medium' | 'High' | 'Explosive';
}

export interface SocialPulse {
  platform: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  discussionVolume: string;
  keyConcerns: string[];
}

export interface MarketAnalysis {
  recommendation: 'YES' | 'NO' | 'CAUTION';
  confidenceScore: number;
  priceStrategy: string;
  competitionLevel: number; // 1-10
  entryBarrier: number; // 1-10
  riskLevel: number; // 1-10
  opportunityPoints: string[];
  coreRisks: string[];
  competitors: ProductInfo[];
  trends: { month: string; value: number }[];
  redditSentiment: SocialPulse;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
