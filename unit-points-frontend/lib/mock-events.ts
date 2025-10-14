import type { Event, Activity } from "@/hooks/use-events"

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    name: "Polkadot Developer Summit 2025",
    description:
      "Join us for a week-long summit featuring workshops, talks, and networking with top Polkadot developers. Earn UPT by attending sessions and completing challenges.",
    company: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    startDate: Math.floor(new Date("2025-03-15").getTime() / 1000),
    endDate: Math.floor(new Date("2025-03-22").getTime() / 1000),
    isActive: true,
    image: "/polkadot-developer-conference-tech-summit.jpg",
    totalRewards: 350,
  },
  {
    id: 2,
    name: "Web3 Gaming Hackathon",
    description:
      "Build the next generation of blockchain games! Participate in coding challenges, vote on best projects, and redeem exclusive NFT rewards.",
    company: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    startDate: Math.floor(new Date("2025-04-01").getTime() / 1000),
    endDate: Math.floor(new Date("2025-04-30").getTime() / 1000),
    isActive: true,
    image: "/gaming-hackathon-neon-lights-esports.jpg",
    totalRewards: 475,
  },
  {
    id: 3,
    name: "DeFi Education Series",
    description:
      "Learn about decentralized finance through interactive workshops. Complete quizzes, participate in governance votes, and earn rewards for your progress.",
    company: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    startDate: Math.floor(new Date("2025-02-01").getTime() / 1000),
    endDate: Math.floor(new Date("2025-02-28").getTime() / 1000),
    isActive: false,
    image: "/defi-education-blockchain-learning.jpg",
    totalRewards: 75,
  },
  {
    id: 4,
    name: "NFT Art Exhibition",
    description:
      "Explore digital art from emerging creators. Vote for your favorite pieces, attend virtual gallery tours, and redeem limited edition prints.",
    company: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
    startDate: Math.floor(new Date("2025-05-10").getTime() / 1000),
    endDate: Math.floor(new Date("2025-06-10").getTime() / 1000),
    isActive: true,
    image: "/nft-digital-art-gallery-colorful.jpg",
    totalRewards: 70,
  },
  {
    id: 5,
    name: "Blockchain for Social Good",
    description:
      "Contribute to projects using blockchain for positive impact. Participate in community votes, complete volunteer activities, and earn rewards for making a difference.",
    company: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    startDate: Math.floor(new Date("2025-03-01").getTime() / 1000),
    endDate: Math.floor(new Date("2025-12-31").getTime() / 1000),
    isActive: true,
    image: "/social-good-community-helping-hands.jpg",
    totalRewards: 270,
  },
]

export const MOCK_ACTIVITIES: Record<number, Activity[]> = {
  1: [
    {
      id: 1,
      eventId: 1,
      name: "Attend Opening Keynote",
      description: "Check in at the opening keynote session",
      activityType: 1, // Earn
      rewardAmount: 50,
      isActive: true,
    },
    {
      id: 2,
      eventId: 1,
      name: "Complete Workshop Challenge",
      description: "Finish the hands-on coding workshop",
      activityType: 1, // Earn
      rewardAmount: 100,
      isActive: true,
    },
    {
      id: 3,
      eventId: 1,
      name: "Redeem Summit Swag",
      description: "Exchange tokens for exclusive merchandise",
      activityType: 0, // Redeem
      rewardAmount: 200,
      isActive: true,
    },
  ],
  2: [
    {
      id: 4,
      eventId: 2,
      name: "Submit Game Prototype",
      description: "Upload your game project for judging",
      activityType: 1, // Earn
      rewardAmount: 150,
      isActive: true,
    },
    {
      id: 5,
      eventId: 2,
      name: "Vote for Best Game",
      description: "Cast your vote for the winning project",
      activityType: 2, // Vote
      rewardAmount: 25,
      isActive: true,
    },
    {
      id: 6,
      eventId: 2,
      name: "Redeem NFT Prize",
      description: "Claim your exclusive game NFT",
      activityType: 0, // Redeem
      rewardAmount: 300,
      isActive: true,
    },
  ],
  3: [
    {
      id: 7,
      eventId: 3,
      name: "Complete DeFi Quiz",
      description: "Test your knowledge of decentralized finance",
      activityType: 1, // Earn
      rewardAmount: 75,
      isActive: false,
    },
  ],
  4: [
    {
      id: 8,
      eventId: 4,
      name: "Vote for Featured Artist",
      description: "Help select the next featured creator",
      activityType: 2, // Vote
      rewardAmount: 30,
      isActive: true,
    },
    {
      id: 9,
      eventId: 4,
      name: "Attend Virtual Tour",
      description: "Join the guided gallery experience",
      activityType: 1, // Earn
      rewardAmount: 40,
      isActive: true,
    },
  ],
  5: [
    {
      id: 10,
      eventId: 5,
      name: "Vote on Impact Projects",
      description: "Help decide which projects receive funding",
      activityType: 2, // Vote
      rewardAmount: 50,
      isActive: true,
    },
    {
      id: 11,
      eventId: 5,
      name: "Complete Volunteer Activity",
      description: "Participate in a community service project",
      activityType: 1, // Earn
      rewardAmount: 120,
      isActive: true,
    },
    {
      id: 12,
      eventId: 5,
      name: "Redeem Impact Badge",
      description: "Claim your social good contributor badge",
      activityType: 0, // Redeem
      rewardAmount: 100,
      isActive: true,
    },
  ],
}
