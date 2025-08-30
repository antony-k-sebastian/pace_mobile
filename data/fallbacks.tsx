import { ActionItem } from "@/components/ActionCard";

const FALLBACKS: Record<string, Partial<ActionItem> & { description: string; steps: string[]; kpi: string }> = {
  "textbook-exchange": { description: "Drop off old textbooks in the campus 'Textbook Exchange' bin near libraries. Scan the QR to log your action and claim a coupon.", steps: ["Locate a bin", "Drop your books", "Scan QR in the app"], kpi: "Weight of collected books; number of QR scans." },
  "sustainable-snack": { description: "Buy a snack from the Sustainable Station stocked with local, ethical products. Earn points toward a free snack.", steps: ["Find the station", "Choose a sustainable snack", "Pay & log the purchase"], kpi: "Sales data from the snack station." },
  "campus-cleanup": { description: "Join a 45-minute clean-up session and help keep the campus clean.", steps: ["Sign up", "Pick a route", "Collect litter", "Dispose properly"], kpi: "Participants and total litter weight." },
  "peer-tutoring": { description: "Offer or receive 30-minute tutoring in a campus study area.", steps: ["Pick a slot", "Meet your peer", "Complete the session", "Log it"], kpi: "Number of sessions completed." },
  "mindfulness-moment": { description: "Take a 5–10 minute guided mindfulness break with the in-app audio.", steps: ["Find a quiet spot", "Start the session", "Breathe & relax"], kpi: "Sessions started and time spent." },
  "stair-challenge": { description: "Skip the elevator, take the stairs, and scan the QR at the top.", steps: ["Find the marked stairwell", "Climb!", "Scan QR to log"], kpi: "Number of stairwell QR scans." },
  "litter-patrol": { description: "Walk a designated route for 30–45 minutes and pick up litter.", steps: ["Join a route", "Collect litter safely", "Dispose & log"], kpi: "Participants and litter weight." },
  "water-whistle": { description: "Report leaky faucets by scanning the QR and submitting a quick form.", steps: ["Scan sticker QR", "Fill short form", "Submit"], kpi: "Reports submitted and issues resolved." },
  "reusable-cup": { description: "Bring your own cup for beverages and scan the counter QR to log it.", steps: ["Use a reusable cup", "Buy your drink", "Scan QR"], kpi: "QR scans and loyalty stamps." },
  "food-waste-fighter": { description: "Scrape plates into compost bins and scan the QR near the bin.", steps: ["Scrape into compost", "Scan QR", "Earn badge"], kpi: "QR scans at compost bins." },
  "sdg-story": { description: "Share a 30–60s video or short write-up of your SDG contribution.", steps: ["Record or write", "Submit in app", "Inspire others"], kpi: "Submissions and views." },
  "sustainability-poll": { description: "Complete a 2–5 minute poll on campus sustainability.", steps: ["Open poll", "Answer questions", "Submit"], kpi: "Poll completions." },
};

export default FALLBACKS;