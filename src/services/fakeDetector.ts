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
    'katrinakaif', 'anushkasharma', 'sonamkapoor',

    // Added Instagram/other platform celebrities and influencers
    'billieeilish', 'dualipa', 'badgalriri', 'kendalljenner',
    'gigihadid', 'natgeo', 'champagnepapi', 'kourtneykardash',
    'khloekardashian', 'jenner', 'shawnmendes', 'camila_cabello',
    'zacefron', 'mileycyrus', 'beyonce', 'ladygaga', 'justintimberlake',
    'kevinhart4real', 'drake', 'jlo', 'bts.bighitofficial',
    'shakira', 'nasa', 'oprah', 'handemade', 'elonmusk', 'neiltyson'
  ];

  private static generateRealisticProfile(username: string, platform: Platform): AccountProfile {
    const isKnownLegitimate = this.knownLegitimateAccounts.some(known =>
      username.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(username.toLowerCase())
    );

    if (isKnownLegitimate) {
      return {
        followerCount: Math.floor(Math.random() * 50000000) + 10000000,
        followingCount: Math.floor(Math.random() * 1000) + 100,
        postCount: Math.floor(Math.random() * 5000) + 1000,
        accountAge: Math.floor(Math.random() * 3000) + 1000,
        hasProfilePicture: true,
        hasBio: true,
        isVerified: Math.random() > 0.1,
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

  private static decisionTreeRiskClassifier(profile: AccountProfile, username: string): {
    riskPercentage: number;
    indicators: string[];
    status: 'genuine' | 'suspicious' | 'fake';
  } {
    if (!profile) {
      throw new Error('Profile is undefined in decisionTreeRiskClassifier');
    }

    if (this.knownLegitimateAccounts.some(known =>
      username.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(username.toLowerCase())
    )) {
      return { riskPercentage: 10, indicators: [], status: 'genuine' };
    }

    const indicators: string[] = [];
    let risk = 0;

    // Follower count scoring
    if (profile.followerCount < 500) {
      risk += 30;
      indicators.push('Very low follower count');
    } else if (profile.followerCount < 1000) {
      risk += 15;
      indicators.push('Low follower count');
    }

    // Verification and account age signals
    if (!profile.isVerified) {
      risk += 25;
      indicators.push('Account not verified');
    } else if (profile.accountAge > 1000) {
      risk -= 20;
      indicators.push('Long-standing verified account');
    }

    // Account age
    if (profile.accountAge < 90) {
      risk += 20;
      indicators.push('New account age');
    } else if (profile.accountAge < 365) {
      risk += 5;
    }

    // Engagement rate anomalies
    if (profile.engagementRate < 1) {
      risk += 30;
      indicators.push('Very low engagement rate');
    } else if (profile.engagementRate > 15) {
      risk += 15;
      indicators.push('Unusually high engagement rate');
    }

    // Post frequency anomalies
    if (profile.postFrequency > 8) {
      risk += 15;
      indicators.push('High posting frequency');
    } else if (profile.postFrequency < 0.05) {
      risk += 10;
      indicators.push('Very inactive account');
    }

    // Profile completeness/bio
    if (!profile.hasBio) {
      risk += 15;
      indicators.push('Missing bio');
    }
    if (!profile.hasProfilePicture) {
      risk += 20;
      indicators.push('Missing profile picture');
    }

    // Suspicious username patterns
    if (/^[a-zA-Z]+\d{4,}$/.test(username) || /^\w+_\w+_\d+$/.test(username) || /^(user|account)\d+$/.test(username)) {
      risk += 20;
      indicators.push('Suspicious username format');
    }

    // Follower-to-following ratio
    const ratio = profile.followerCount / (profile.followingCount || 1);
    if (ratio < 0.05 && profile.followingCount > 2000) {
      risk += 20;
      indicators.push('Extremely unbalanced follower-to-following ratio');
    } else if (ratio < 0.15 && profile.followingCount > 1500) {
      risk += 10;
      indicators.push('Imbalanced follower-to-following ratio');
    }

    // Clamp risk score
    risk = Math.min(95, Math.max(10, risk));

    // Determine status
    let status: 'genuine' | 'suspicious' | 'fake' = 'genuine';
    if (risk >= 75) status = 'fake';
    else if (risk >= 40) status = 'suspicious';

    return { riskPercentage: Math.floor(risk), indicators, status };
  }

  private static generateExplanation(
    status: string,
    riskPercentage: number,
    indicators: string[],
    profile: AccountProfile,
    username: string
  ): string {
    if (this.knownLegitimateAccounts.some(known =>
      username.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(username.toLowerCase())
    )) {
      return `This appears to be a verified celebrity or public figure account with strong authenticity signals. The account shows typical patterns of a legitimate high-profile user with ${profile.followerCount.toLocaleString()} followers and verified status.`;
    }

    switch (status) {
      case 'genuine':
        return `This account demonstrates strong authenticity with only ${riskPercentage}% risk. Key positive signals include: ${profile.accountAge > 365 ? 'established account age' : 'reasonable account age'}, ${profile.hasProfilePicture ? 'complete profile picture' : ''}, ${profile.hasBio ? 'detailed bio' : ''}, and natural engagement patterns. The follower-to-following ratio and posting behavior appear organic.`;
      case 'suspicious':
        return `This account shows some concerning patterns with ${riskPercentage}% risk score. While not definitively fake, several indicators warrant caution: ${indicators.slice(0, 3).join(', ')}. The account may be legitimate but exhibits some automated or unusual behavior patterns.`;
      case 'fake':
        return `High probability of fake or bot account with ${riskPercentage}% risk score. Multiple red flags detected: ${indicators.slice(0, 4).join(', ')}. The combination of these factors strongly suggests this account may be artificially created or managed by automated systems.`;
      default:
        return 'Unable to determine account authenticity due to insufficient data.';
    }
  }

  static async checkAccount(platform: Platform, username: string): Promise<DetectionResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Clean username
    const cleanUsername = username.replace(/^@/, '');

    // Basic validation and existence simulation
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
        explanation: `The username "${cleanUsername}" does not exist on ${platform.name} or contains invalid characters.`,
      };
    }

    // Generate realistic profile
    const profile = this.generateRealisticProfile(cleanUsername, platform);

    if (!profile) {
      throw new Error('Failed to generate profile in checkAccount');
    }

    // Evaluate risk with decision tree classifier
    const { riskPercentage, indicators, status } = this.decisionTreeRiskClassifier(profile, cleanUsername);

    // Generate detailed explanation
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
