// src/utils/fakedetector.ts
import * as tf from '@tensorflow/tfjs';
import { Platform, DetectionResult } from '../types';

interface AccountProfile {
  followerCount: number;
  followingCount: number;
  postCount: number;
  accountAge: number; // days
  hasProfilePicture: boolean;
  hasBio: boolean;
  isVerified: boolean;
  engagementRate: number; // %
  postFrequency: number; // per day
  profileCompleteness: number; // %
}

export class FakeDetector {
  private static model: tf.LayersModel | null = null;

  // Features ordered as: followerCount, followingCount, postCount, accountAge, hasProfilePicture (0/1), 
  // hasBio(0/1), isVerified(0/1), engagementRate, postFrequency, profileCompleteness
  private static featureOrder = [
    'followerCount',
    'followingCount',
    'postCount',
    'accountAge',
    'hasProfilePicture',
    'hasBio',
    'isVerified',
    'engagementRate',
    'postFrequency',
    'profileCompleteness'
  ];

  // Load or initialize the pretrained model (simulate loading)
  static async loadModel() {
    if (!this.model) {
      // You can load a real model from local or URL here.
      // For demo, create a small model: logistic regression

      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [10], units: 1, activation: 'sigmoid' }));
      model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

      // Simulate random weights for demonstration (replace with real trained weights)
      const weights = model.getWeights();
      const newWeights = weights.map(w => tf.randomNormal(w.shape));
      model.setWeights(newWeights);

      this.model = model;
    }
    return this.model;
  }

  private static normalizeFeatures(features: number[]): number[] {
    // Simple normalization for demo purposes, scale large features
    return features.map((v, i) => {
      if (i === 0) return v / 1e6; // followerCount scaled down
      if (i === 1) return v / 1e4; // followingCount scaled down
      if (i === 2) return v / 1e3; // postCount scaled down
      if (i === 3) return v / 3650; // accountAge (up to 10 years)
      if (i >= 4 && i <= 6) return v; // binary flags as is
      if (i === 7) return v / 100; // engagementRate as fraction
      if (i === 8) return v / 30; // postFrequency per month
      if (i === 9) return v / 100; // completeness fraction
      return v;
    });
  }

  private static profileToTensor(profile: AccountProfile): tf.Tensor {
    const inputFeatures = [
      profile.followerCount,
      profile.followingCount,
      profile.postCount,
      profile.accountAge,
      profile.hasProfilePicture ? 1 : 0,
      profile.hasBio ? 1 : 0,
      profile.isVerified ? 1 : 0,
      profile.engagementRate,
      profile.postFrequency,
      profile.profileCompleteness
    ];
    const normalized = this.normalizeFeatures(inputFeatures);
    return tf.tensor2d([normalized]);
  }

  static async checkAccount(platform: Platform, username: string): Promise<DetectionResult> {
    // Simulate API/network delay
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500));

    const cleanUsername = username.replace(/^@/, '');
    const hasValidName = /^[a-zA-Z0-9._-]{3,30}$/.test(cleanUsername);

    if (!hasValidName) {
      return {
        id: `${Date.now()}-${Math.random()}`,
        platform,
        username: cleanUsername,
        timestamp: new Date(),
        exists: false,
        isVerified: false,
        riskPercentage: 0,
        status: 'genuine',
        indicators: ['Invalid username format or does not exist'],
        explanation: `Username "${cleanUsername}" is invalid or does not exist on platform.`,
      };
    }

    // For demo, generate synthetic profile data (replace with real API calls)
    const profile = this.generateSyntheticProfile(cleanUsername, platform);

    // Load or initialize model
    const model = await this.loadModel();

    // Prepare input tensor
    const inputTensor = this.profileToTensor(profile);

    // Predict with model (output between 0 and 1, higher = more likely fake)
    const predictionTensor = model.predict(inputTensor) as tf.Tensor;
    const prediction = (await predictionTensor.data())[0];
    predictionTensor.dispose();
    inputTensor.dispose();

    // Map prediction to risk %
    const riskPercentage = Math.round(prediction * 100);

    // Decision thresholds
    let status: 'genuine' | 'suspicious' | 'fake' = 'genuine';
    if (riskPercentage >= 70) status = 'fake';
    else if (riskPercentage >= 40) status = 'suspicious';

    // Explain top indicators for demo
    const indicators = [];
    if (profile.followingCount > 1000) indicators.push('Follows many accounts');
    if (profile.followerCount < 100) indicators.push('Very low followers');
    if (!profile.hasProfilePicture) indicators.push('No profile picture');
    if (!profile.hasBio) indicators.push('No bio');
    if (profile.engagementRate < 1) indicators.push('Low engagement');
    if (riskPercentage > 50) indicators.push('Model indicates suspicious behavior');

    const explanation = `Model predicts a ${riskPercentage}% chance that the account is fake. Indicators: ${indicators.join(', ') || 'None'}.`;

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

  private static generateSyntheticProfile(username: string, platform: Platform): AccountProfile {
    const isFamous = this.isFamousUsername(username);
    if (isFamous) {
      return {
        followerCount: 500000 + Math.floor(Math.random() * 1000000),
        followingCount: 100 + Math.floor(Math.random() * 500),
        postCount: 1000 + Math.floor(Math.random() * 500),
        accountAge: 1500 + Math.floor(Math.random() * 1000),
        hasProfilePicture: true,
        hasBio: true,
        isVerified: true,
        engagementRate: 3 + Math.random() * 5,
        postFrequency: 1 + Math.random() * 2,
        profileCompleteness: 95,
      };
    }
    const age = Math.floor(Math.random() * 1000);
    return {
      followerCount: Math.floor(Math.random() * 50_000),
      followingCount: Math.floor(Math.random() * 3000),
      postCount: Math.floor(Math.random() * 200),
      accountAge: age,
      hasProfilePicture: Math.random() > 0.3,
      hasBio: Math.random() > 0.5,
      isVerified: Math.random() > 0.95,
      engagementRate: Math.random() * 10,
      postFrequency: Math.random() * 3,
      profileCompleteness: Math.random() * 70 + 30,
    };
  }

  private static isFamousUsername(username: string): boolean {
    return this.knownAccounts.some(acc => acc.toLowerCase() === username.toLowerCase());
  }
}
