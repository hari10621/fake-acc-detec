import { Platform, DetectionResult } from '../types';

interface AccountProfile {
  followerCount: number;
  followingCount: number;
  postCount: number;
  accountAge: number; // in days
  hasProfilePicture: boolean;
  hasBio: boolean;
  isVerified: boolean;
  engagementRate: number; // percentage
  postFrequency: number; // posts per day
  profileCompleteness: number; // percentage
}

export class FakeDetector {
  private static knownLegitimateAccounts = [
    'virat.kohli', 'viratkohli', 'imvkohli',
    'cristiano', 'leomessi', 'neymarjr',
    'selenagomez', 'taylorswift', 'arianagrande',
    'justinbieber', 'kimkardashian', 'kyliejenner',
    'therock', 'vancityreynolds', 'priyankachopra',
    'deepikapadukone', 'akshaykumar', 'iamsrk',
    'amitabhbachchan', 'ranveersingh', 'aliaabhatt',
    'katrinakaif', 'anushkasharma', 'sonamkapoor'
  ];

  // Generate realistic profile method unchanged
  private static generateRealisticProfile(username: string, platform: Platform): AccountProfile {
    // ... as defined in your code ...
  }

  // Decision tree style risk classifier replacing calculateRiskScore
  private static decisionTreeRiskClassifier(profile: AccountProfile, username: string): {
    riskPercentage: number;
    indicators: string[];
    status: 'genuine' | 'suspicious' | 'fake';
  } {
    // Immediately classify known celebrities as genuine low-risk
    if (this.knownLegitimateAccounts.some(known =>
      username.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(username.toLowerCase())
    )) {
      return { riskPercentage: 10, indicators: [], status: 'genuine' };
    }

    const indicators: string[] = [];
    let risk = 0;

    // Decision tree logic (nested conditions representing splits):
    if (profile.followerCount < 1000) {
      if (!profile.isVerified) {
        if (profile.accountAge < 90) {
          risk = 85;
          indicators.push(
            'Low follower count',
            'Unverified account',
            'New account age'
          );
        } else {
          risk = 70;
          indicators.push(
            'Low follower count',
            'Unverified account'
          );
        }
      } else {
        risk = 55;
        indicators.push(
          'Low follower count',
          'Verified account'
        );
      }
    } else {
      if (profile.engagementRate < 0.5) {
        if (profile.postFrequency > 10) {
          risk = 75;
          indicators.push(
            'Very low engagement rate',
            'Unusually high posting frequency'
          );
        } else {
          if (username.match(/^[a-zA-Z]+\d{4,}$/) || username.match(/^\w+_\w+_\d+$/) || username.match(/^(user|account)\d+$/)) {
            risk = 65;
            indicators.push('Suspicious username pattern', 'Very low engagement rate');
          } else {
            risk = 35;
            indicators.push('Very low engagement rate');
          }
        }
      } else {
        if (profile.profileCompleteness < 50) {
          risk = 40;
          indicators.push('Incomplete profile information');
        } else {
          if (profile.postFrequency < 0.1) {
            risk = 50;
            indicators.push('Very low activity level');
          } else {
            risk = 20;
            indicators.push('Normal profile indicators');
          }
        }
      }
    }

    // Apply follower-to-following ratio adjustments
    const followerRatio = profile.followerCount / (profile.followingCount || 1);
    if (followerRatio < 0.1 && profile.followingCount > 1000) {
      risk += 15;
      indicators.push('Extremely low follower-to-following ratio');
    } else if (followerRatio < 0.5 && profile.followingCount > 500) {
      risk += 8;
      indicators.push('Low follower-to-following ratio');
    }

    // Caps and adjustments
    if (profile.hasBio === false) {
      risk += 10;
      indicators.push('Empty bio/description');
    }
    if (profile.hasProfilePicture === false) {
      risk += 12;
      indicators.push('No profile picture');
    }
    if (profile.accountAge > 1000) {
      risk -= 10; // trust boost for old account
    }
    if (profile.isVerified) {
      risk -= 20; // trust boost for verified
    }

    // Clamp risk between 15 and 95
    risk = Math.min(95, Math.max(15, risk));

    // Determine status from risk
    let status: 'genuine' | 'suspicious' | 'fake' = 'genuine';
    if (risk >= 70) status = 'fake';
    else if (risk >= 40) status = 'suspicious';

    return { riskPercentage: Math.floor(risk), indicators, status };
  }

  // generateExplanation unchanged or adapted
  private static generateExplanation(
    status: string,
    riskPercentage: number,
    indicators: string[],
    profile: AccountProfile,
    username: string
  ): string {
    // ... as defined in your code ...
  }

  // Replace calculateRiskScore call inside checkAccount with decisionTreeRiskClassifier
  static async checkAccount(platform: Platform, username: string): Promise<DetectionResult> {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const cleanUsername = username.replace(/^@/, '');

    const hasReasonableLength = cleanUsername.length >= 3 && cleanUsername.length <= 30;
    const hasValidChars = /^[a-zA-Z0-9._-]+$/.test(cleanUsername);
    const exists = hasReasonableLength && hasValidChars && Math.random() > 0.05;

    if (!exists) {
      return {
        id: `${Date.now()}-${Math.random()}`,
        platform,
        username: cleanUsername,
        timestamp: new Date(),
        exists: false,
        isVerified: false,
        riskPercentage: 0,
        status: 'genuine',
        indicators: ['Account not found or invalid username format'],
        explanation: `The username "${cleanUsername}" does not exist on ${platform.name} or contains invalid characters.`
      };
    }

    const profile = this.generateRealisticProfile(cleanUsername, platform);

    // Call the decision tree risk classifier here
    const { riskPercentage, indicators, status } = this.decisionTreeRiskClassifier(profile, cleanUsername);

    const explanation = this.generateExplanation(status, riskPercentage, indicators, profile, cleanUsername);

    return {
      id: `${Date.now()}-${Math.random()}`,
      platform,
      username: cleanUsername,
      timestamp: new Date(),
      exists: true,
      isVerified: profile.isVerified,
      riskPercentage,
      status,
      indicators,
      explanation
    };
  }
}
