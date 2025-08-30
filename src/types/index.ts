export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DetectionResult {
  id: string;
  platform: Platform;
  username: string;
  timestamp: Date;
  exists: boolean;
  isVerified: boolean;
  riskPercentage: number;
  status: 'genuine' | 'suspicious' | 'fake';
  indicators: string[];
  explanation: string;
}

export interface ChartDataPoint {
  hour: string;
  fakeCount: number;
  suspiciousCount: number;
}