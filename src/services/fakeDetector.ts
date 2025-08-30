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

  private static generateRealisticProfile(username: string, platform: Platform): AccountProfile {
    const isKnownLegitimate = this.knownLegitimateAccounts.some(known =>
      username.toLowerCase().includes(known.toLowerCase())
    );
    if (isKnownLegitimate) {
      return {
        followerCount: Math.floor(Math.random() * 50_000_000) + 10_000_000,
        followingCount: Math.floor(Math.random() * 1000) + 100,
        postCount: Math.floor(Math.random() * 5000) + 1000,
        accountAge: Math.floor(Math.random() * 3000) + 1000,
        hasProfilePicture: true,
        hasBio: true,
        isVerified: true,
        engagementRate: Math.random() * 5 + 2,
        postFrequency: Math.random() * 2 + 0.5,
        profileCompleteness: Math.random() * 20 + 80,
      };
    }
    const accountAge = Math.floor(Math.random() * 2000) + 30;
    const isOldAccount = accountAge > 365;
    return {
      followerCount: Math.floor(Math.random() * (isOldAccount ? 5000 : 500)) + 10,
      followingCount: Math.floor(Math.random() * (isOldAccount ? 2000 : 800)) + 50,
      postCount: Math.floor(Math.random() * (isOldAccount ? 1000 : 100)) + 5,
      accountAge,
      hasProfilePicture: Math.random() > 0.2,
      hasBio: Math.random() > 0.3,
      isVerified: Math.random() > 0.95,
      engagementRate: Math.random() * 8 + 0.5,
      postFrequency: Math.random() * 3 + 0.1,
      profileCompleteness: Math.random() * 40 + 40,
    };
  }

  private static calculateRiskScore(profile: AccountProfile, username: string) {
    let riskScore = 0;
    const indicators: string[] = [];
    const isKnownLegitimate = this.knownLegitimateAccounts.some(
      known => username.toLowerCase() === known.toLowerCase()
    );
    if (isKnownLegitimate && profile.followerCount > 1_000_000) {
      return { riskPercentage: 0, indicators: ['Verified celebrity/public figure'], status: 'genuine' };
    }
    if (!isKnownLegitimate && /messi|ronaldo|kohli|bieber|swift|gomez/i.test(username)) {
      if (profile.followerCount < 100_000) {
        riskScore += 40;
        indicators.push('Possible impersonation of celebrity with low followers');
      }
    }
    const ratio = profile.followerCount / (profile.followingCount || 1);
    if (ratio < 0.1 && profile.followingCount > 300) {
      riskScore += 30;
      indicators.push('Bot-like ratio: very low followers, following many');
    } else if (ratio < 0.5) {
      riskScore += 15;
      indicators.push('Unhealthy follower-to-following ratio');
    } else if (ratio > 50 && profile.followerCount > 10_000) {
      riskScore -= 5;
      indicators.push('High ratio – celebrity-like');
    }
    if (!profile.hasProfilePicture) {
      riskScore += 25;
      indicators.push('No profile picture');
    }
    if (profile.engagementRate < 0.5) {
      riskScore += 20;
      indicators.push('Extremely low engagement');
    } else if (profile.engagementRate > 15) {
      riskScore += 15;
      indicators.push('Suspiciously high engagement');
    }
    if (profile.postFrequency > 10) {
      riskScore += 20;
      indicators.push('Very high posting frequency');
    } else if (profile.postFrequency < 0.05) {
      riskScore += 15;
      indicators.push('Extremely inactive');
    }
    if (/^[a-zA-Z]+\d{4,}$|^\w+_\w+_\d+$|^(user|account)\d+$/i.test(username)) {
      riskScore += 20;
      indicators.push('Bot-like username pattern');
    }
    const numberCount = (username.match(/\d/g) || []).length;
    if (numberCount > 4) {
      riskScore += 15;
      indicators.push('Excessive numbers in username');
    }
    if (profile.accountAge < 90) {
      riskScore += 20;
      indicators.push('Very new account');
    } else if (profile.accountAge > 1000) {
      riskScore -= 5;
      indicators.push('Old account – trusted signal');
    }
    if (profile.isVerified) {
      riskScore -= 10;
      indicators.push('Verified badge');
    }
    const finalRiskScore = Math.min(100, Math.max(5, riskScore));
    let status: 'genuine' | 'suspicious' | 'fake';
    if (finalRiskScore <= 20) status = 'genuine';
    else if (finalRiskScore <= 60) status = 'suspicious';
    else status = 'fake';
    return { riskPercentage: finalRiskScore, indicators, status };
  }

  private static generateExplanation(
    status: string,
    riskPercentage: number,
    indicators: string[],
    profile: AccountProfile,
    username: string
  ): string {
    const isKnownLegitimate = this.knownLegitimateAccounts.some(
      known => username.toLowerCase() === known.toLowerCase()
    );
    if (isKnownLegitimate) {
      return `This appears to be a verified celebrity/public figure with ${profile.followerCount.toLocaleString()} followers and strong authenticity signals.`;
    }
    switch (status) {
      case 'genuine':
        return `This account looks genuine (${riskPercentage}% risk). Indicators like bio, profile picture, and engagement look natural.`;
      case 'suspicious':
        return `This account has mixed signals (${riskPercentage}% risk). Some traits raise suspicion: ${indicators.slice(0, 3).join(', ')}.`;
      case 'fake':
        return `High probability of being fake/bot (${riskPercentage}% risk). Major red flags: ${indicators.slice(0, 4).join(', ')}.`;
      default:
        return 'Not enough data to judge.';
    }
  }

  static async checkAccount(platform: Platform, username: string): Promise<DetectionResult> {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

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
        indicators: ['Account not found'],
        explanation: `The username "${cleanUsername}" does not exist on ${platform.name}.`
      };
    }
    const profile = this.generateRealisticProfile(cleanUsername, platform);
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
      explanation
    };
  }
}
