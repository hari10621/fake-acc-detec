// src/utils/FakeDetector.ts
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
  private static knownAccounts = [
    'virat.kohli', 'viratkohli', 'imvkoli',
    'cristiano', 'leomessi', 'neymarjr',
    'selenagomez', 'taylorswift', 'arianagrande',
    'justinbieber', 'kimkardashian', 'kyliejenner',
    'therock', 'vancityreynolds', 'priyanka_chopra',
    'deepikapadukone', 'akshaykumar', 'iamsrk',
    'amitabhbachchan', 'ranveersingh', 'aliaabhatt',
    'katrinakaif', 'anushkasharma', 'sonamkapoor'
  ];

  private static isKnownAccount(username: string): boolean {
    return this.knownAccounts.some(acc => acc.toLowerCase() === username.toLowerCase());
  }

  private static generateProfile(username: string, platform: Platform): AccountProfile {
    // Generate realistic profile data, mocking actual Instagram info
    const isKnown = this.isKnownAccount(username);
    if (isKnown) {
      return {
        followerCount: 10_000_000 + Math.floor(Math.random() * 40_000_000),
        followingCount: 100 + Math.floor(Math.random() * 1000),
        postCount: 1000 + Math.floor(Math.random() * 5000),
        accountAge: 1000 + Math.floor(Math.random() * 3000),
        hasProfilePicture: true,
        hasBio: true,
        isVerified: true,
        engagementRate: 2 + Math.random() * 5,
        postFrequency: 0.5 + Math.random() * 2,
        profileCompleteness: 80 + Math.random() * 20,
      };
    } else {
      const accountAge = 30 + Math.floor(Math.random() * 2000);
      const isOld = accountAge > 365;
      return {
        followerCount: 10 + Math.floor(Math.random() * (isOld ? 5000 : 500)),
        followingCount: 50 + Math.floor(Math.random() * (isOld ? 2000 : 800)),
        postCount: 5 + Math.floor(Math.random() * (isOld ? 1000 : 100)),
        accountAge,
        hasProfilePicture: Math.random() > 0.2,
        hasBio: Math.random() > 0.3,
        isVerified: Math.random() > 0.95,
        engagementRate: 0.5 + Math.random() * 8,
        postFrequency: 0.1 + Math.random() * 3,
        profileCompleteness: 40 + Math.random() * 40,
      };
    }
  }

  private static calculateRiskScore(profile: AccountProfile, username: string) {
    let risk = 0;
    const indicators: string[] = [];
    const isKnown = this.isKnownAccount(username);

    if (isKnown && profile.followerCount > 1_000_000) {
      return { riskPercentage: 0, indicators: ['Verified celebrity/public figure'], status: 'genuine' };
    }

    // Negative risk (reduce risk)
    if (profile.isVerified) {
      risk -= 25;
      indicators.push('Has verified badge');
    }
    if (profile.accountAge > 1000) {
      risk -= 15;
      indicators.push('Long established account');
    }
    if (profile.engagementRate > 5 && profile.engagementRate < 15) {
      risk -= 10;
      indicators.push('Good engagement rate');
    }
    if (profile.followerCount > 10000 && profile.followingCount < 1000) {
      risk -= 10;
      indicators.push('Healthy follower/following ratio');
    }

    // Positive risk (add risk)
    if (!isKnown) {
      if (/messi|ronaldo|kohli|bieber|swift|gomez/i.test(username) && profile.followerCount < 100000) {
        risk += 40;
        indicators.push('Possible celebrity impersonator');
      }

      const ratio = profile.followerCount / (profile.followingCount || 1);
      if (profile.followerCount < 500) {
        risk += 40;
        indicators.push('Very low followers');
      }

      if (profile.followingCount > 1000) {
        risk += 20;
        indicators.push('Follows many accounts');
      }

      if (ratio < 0.1) {
        risk += 30;
        indicators.push('Unhealthy follower/following ratio');
      }

      if (!profile.hasProfilePicture) {
        risk += 30;
        indicators.push('No profile picture');
      } 

      if (!profile.hasBio) {
        risk += 20;
        indicators.push('No bio');
      }

      if (profile.engagementRate < 1) {
        risk += 30;
        indicators.push('Low engagement');
      } else if (profile.engagementRate > 20) {
        risk += 15;
        indicators.push('Suspicious engagement');
      }

      if (profile.postFrequency < 0.1) {
        risk += 15;
        indicators.push('Rarely posts');
      } else if (profile.postFrequency > 10) {
        risk += 15;
        indicators.push('Very frequent posting');
      }

      if (/^[a-zA-Z]+\d{4,}$/.test(username) || /^\w+_\w+_\d+$/.test(username) || /^user\d+$/.test(username)) {
        risk += 25;
        indicators.push('Bot-like username pattern');
      }

      const numberCount = (username.match(/\d/g) || []).length;
      if (numberCount > 4) {
        risk += 20;
        indicators.push('Excessive numbers in username');
      }

      if (profile.accountAge < 90) {
        risk += 25;
        indicators.push('Newly created account');
      }
    }

    risk = Math.max(0, Math.min(100, risk));

    let status: 'genuine' | 'suspicious' | 'fake';

    if (risk < 20) status = 'genuine';
    else if (risk < 60) status = 'suspicious';
    else status = 'fake';

    return { riskPercentage: risk, indicators, status };
  }

  private static generateExplanation(status: string, riskPercentage: number, indicators: string[], profile: AccountProfile, username: string) {
    const isKnown = this.isKnownAccount(username);

    if (isKnown) {
      return `This account is a verified celebrity or public figure with ${profile.followerCount.toLocaleString()} followers and strong authenticity.`;
    }

    switch (status) {
      case 'genuine':
        return `This account appears genuine with a low risk of ${riskPercentage}%.`;
      case 'suspicious':
        return `This account is suspicious. Risk: ${riskPercentage}%. Indicators: ${indicators.slice(0, 3).join(', ')}.`;
      case 'fake':
        return `This account is likely fake with a high risk of ${riskPercentage}%. Major indicators: ${indicators.slice(0, 4).join(', ')}.`;
      default:
        return 'Insufficient data for a definitive conclusion.';
    }
  }

  static async checkAccount(platform: Platform, username: string): Promise<DetectionResult> {
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    const cleanUsername = username.replace(/^@/, '');

    const hasValidLength = cleanUsername.length >= 3 && cleanUsername.length <= 30;
    const hasValidChars = /^[a-zA-Z0-9._-]+$/.test(cleanUsername);
    const exists = hasValidLength && hasValidChars && Math.random() > 0.05;

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
        indicators: ['Account not found'],
        explanation: `The account "${cleanUsername}" could not be found on ${platform.name}.`,
      };
    }

    const profile = this.generateProfile(cleanUsername, platform);

    const { riskPercentage, indicators, status } = this.calculateRiskScore(profile, cleanUsername);

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
      explanation,
    };
  }
}
