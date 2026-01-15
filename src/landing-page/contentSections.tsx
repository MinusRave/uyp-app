import daBoiAvatar from "../client/static/da-boi.webp";
import kivo from "../client/static/examples/kivo.webp";
import messync from "../client/static/examples/messync.webp";
import microinfluencerClub from "../client/static/examples/microinfluencers.webp";
import promptpanda from "../client/static/examples/promptpanda.webp";
import reviewradar from "../client/static/examples/reviewradar.webp";
import scribeist from "../client/static/examples/scribeist.webp";
import searchcraft from "../client/static/examples/searchcraft.webp";
import { BlogUrl, DocsUrl } from "../shared/common";
import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "The 'Silence' Trap",
    description: "You try to talk, they shut down. You feel ignored, they feel attacked. See the data behind the disconnect.",
    emoji: "😶",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "The Explosive Loop",
    description: "Why does a small comment turn into a 3-hour fight? It's not 'sensitivity', it's a conflict trigger mismatch.",
    emoji: "💥",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Secret Resentment",
    description: "They say 'I'm fine', but you know they aren't. Our dimensional analysis reveals hidden emotional debts.",
    emoji: "🧊",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Scientific Vindication",
    description: "Stop relying on 'he said, she said'. Get an objective, psychological score of your compatibility dynamics.",
    emoji: "⚖️",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "10 Minutes to Clarity",
    description: "You've spent years guessing. spend 10 minutes knowing. Instant results, no account needed to start.",
    emoji: "⏱️",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Different Love Languages",
    description: "You give 100%, they feel 0%. You're speaking different emotional dialects. We provide the dictionary.",
    emoji: "🗣️",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "The 'Nice Guy' Syndrome",
    description: "Are you over-accommodating just to keep the peace? See your 'Agreeableness' risk score.",
    emoji: "🎭",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Sexual Mismatch?",
    description: "It's rarely just about 'drive'. It's about intimacy styles. Decode them without the awkward talk.",
    emoji: "❤️‍🔥",
    href: DocsUrl,
    size: "small",
  },
];

export const testimonials = [
  {
    name: "Maria, 34",
    role: "Felt unheard for 3 years",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "I was convinced he didn't care. The report showed me he scored high on 'Logical Processing' and low on 'Verbal Affirmation'. It wasn't malice, it was his wiring. Meaning changed everything.",
  },
  {
    name: "James, 29",
    role: "Tired of the drama",
    avatarSrc: daBoiAvatar,
    socialUrl: "",
    quote: "I wanted to prove I was right. The test showed *I* was actually the one escalating conflict with my 'Defensive' score. Humbling, but it saved us.",
  },
  {
    name: "Sarah & Tom",
    role: "On the brink of breakup",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "We took it separately. Comparing the graphs was the first time we laughed about our fights in months. 'Oh, THAT is why you do that!'",
  },
];

export const faqs = [
  {
    id: 1,
    question: "Do they have to take it with me?",
    answer: "No. You can start alone. Understanding YOUR perception of the dynamic is 50% of the solution. You'll get instant clarity on your side of the equation.",
    href: "#",
  },
  {
    id: 2,
    question: "Is this going to tell me to break up?",
    answer: "It's not a crystal ball. It's a map. We show you the potholes and the shortcuts. Whether you drive the car is up to you.",
    href: "#",
  },
  {
    id: 3,
    question: "Is my data safe?",
    answer: "100%. We use bank-level encryption. Your results are yours alone. We don't sell data, we sell clarity.",
    href: "#",
  },
  {
    id: 4,
    question: "Why should I pay for a quiz?",
    answer: "This isn't a buzzfeed quiz. It's a psychometric instrument based on the Big 5 and Attachment Theory. Cheaper than 5 minutes of therapy.",
    href: "#",
  },
];

export const footerNavigation = {
  app: [],
  company: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export const examples = [];
