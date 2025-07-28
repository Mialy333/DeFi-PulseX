import { useEffect, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

export const useGamification = (walletAddress?: string) => {
  const {
    profile,
    xpToNextLevel,
    dailyXPEarned,
    canEarnDailyXP,
    availableNFTs,
    addXP,
    markDailyActivity,
    claimNFT,
    setProfile
  } = useUserStore();

  // Initialiser le profil utilisateur
  useEffect(() => {
    if (walletAddress && !profile) {
      // Créer un nouveau profil ou le récupérer depuis une API
      const newProfile = {
        walletAddress,
        totalXP: 0,
        level: 1,
        dailyStreak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        todayActivities: {
          platformUsed: false,
          commentPosted: false,
          tradeExecuted: false
        },
        nftsOwned: [],
        totalTrades: 0,
        totalVolumeUSD: '0',
        communityContributions: 0,
        badges: []
      };
      
      setProfile(newProfile);
    }
  }, [walletAddress, profile, setProfile]);

  // Marquer l'utilisation quotidienne de la plateforme
  const markPlatformUsage = useCallback(() => {
    if (profile && !profile.todayActivities.platformUsed) {
      markDailyActivity('platformUsed');
      toast.success('🎉 +20 XP pour votre utilisation quotidienne !');
    }
  }, [profile, markDailyActivity]);

  // Récompenser un commentaire pertinent
  const rewardComment = useCallback(() => {
    if (profile && !profile.todayActivities.commentPosted) {
      markDailyActivity('commentPosted');
      toast.success('💬 +20 XP pour votre contribution à la communauté !');
    }
  }, [profile, markDailyActivity]);

  // Récompenser un trade exécuté
  const rewardTrade = useCallback(() => {
    if (profile && !profile.todayActivities.tradeExecuted) {
      markDailyActivity('tradeExecuted');
      toast.success('🔄 +10 XP pour votre trade !');
    }
  }, [profile, markDailyActivity]);

  // Réclamer un NFT avec animation
  const claimNFTWithAnimation = useCallback(async (nftId: string) => {
    const nft = availableNFTs.find(n => n.id === nftId);
    if (!nft) return;

    try {
      claimNFT(nftId);
      toast.success(`🏆 NFT "${nft.name}" réclamé avec succès !`, {
        duration: 4000,
        icon: '✨'
      });
    } catch (error) {
      toast.error('Erreur lors de la réclamation du NFT');
    }
  }, [availableNFTs, claimNFT]);

  // Calculer les métriques d'engagement
  const engagementMetrics = {
    completionRate: profile ? (
      (Number(profile.todayActivities.platformUsed) +
       Number(profile.todayActivities.commentPosted) +
       Number(profile.todayActivities.tradeExecuted)) / 3
    ) * 100 : 0,
    
    levelProgress: profile ? ((profile.totalXP % 100) / 100) * 100 : 0,
    
    streakMultiplier: profile ? Math.min(1 + (profile.dailyStreak * 0.1), 2) : 1,
    
    nextReward: availableNFTs.length > 0 ? availableNFTs[0] : null
  };

  // Marquer automatiquement l'usage de la plateforme au premier rendu
  useEffect(() => {
    if (profile) {
      markPlatformUsage();
    }
  }, [profile, markPlatformUsage]);

  return {
    // État du profil
    profile,
    xpToNextLevel,
    dailyXPEarned,
    canEarnDailyXP,
    availableNFTs,
    engagementMetrics,
    
    // Actions
    markPlatformUsage,
    rewardComment,
    rewardTrade,
    claimNFTWithAnimation,
    addXP // Pour des récompenses custom
  };
};