import { ActionItem } from "@/components/ActionCard";

const ACTIONS: ActionItem[] = [
  { id: "textbook-exchange", title: "Textbook Exchange Drop-off", sdgs: [4, 12], estimatedMins: 5, points: 20, impact: "E", category: "Donate & Buy" },
  { id: "sustainable-snack", title: "Sustainable Snack Station", sdgs: [2, 12], estimatedMins: 2, points: 10, impact: "S", category: "Donate & Buy" },

  { id: "campus-cleanup", title: "Campus Clean-Up Crew", sdgs: [11, 15], estimatedMins: 45, points: 40, impact: "E", category: "Volunteering" },
  { id: "peer-tutoring", title: "Peer Tutoring Power Hour", sdgs: [4, 10], estimatedMins: 30, points: 30, impact: "S", category: "Volunteering" },

  { id: "mindfulness-moment", title: "Campus Mindfulness Moment", sdgs: [3], estimatedMins: 10, points: 10, impact: "S", category: "Mind Body Spirit" },
  { id: "stair-challenge", title: "Stair Challenge Sprint", sdgs: [3, 11], estimatedMins: 5, points: 10, impact: "E", category: "Mind Body Spirit" },

  { id: "litter-patrol", title: "Litter Patrol Power Hour", sdgs: [15, 14], estimatedMins: 45, points: 40, impact: "E", category: "Protect Land/Sea/Wildlife" },
  { id: "water-whistle", title: "Water Saving Whistleblower", sdgs: [6, 12], estimatedMins: 3, points: 10, impact: "E", category: "Protect Land/Sea/Wildlife" },

  { id: "reusable-cup", title: "Reusable Cup Champion", sdgs: [12, 13], estimatedMins: 2, points: 10, impact: "E", category: "Reuse/Reduce/Recycle" },
  { id: "food-waste-fighter", title: "Food Waste Fighter", sdgs: [2, 12], estimatedMins: 2, points: 10, impact: "E", category: "Reuse/Reduce/Recycle" },

  { id: "sdg-story", title: "SDG Story Share", sdgs: [17], estimatedMins: 5, points: 15, impact: "G", category: "Advocate & Empower" },
  { id: "sustainability-poll", title: "Campus Sustainability Poll", sdgs: [16, 17], estimatedMins: 5, points: 10, impact: "G", category: "Advocate & Empower" },
];

export default ACTIONS;
