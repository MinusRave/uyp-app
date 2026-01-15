import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ValuePreviewSection from "./components/ValuePreviewSection";
import ProblemAgitationSection from "./components/ProblemAgitationSection";
import SocialProofSection from "./components/SocialProofSection";
import ScientificSolutionSection from "./components/ScientificSolutionSection";
import FAQSection from "./components/FAQSection";
import PrivacyPromiseSection from "./components/PrivacyPromiseSection";
import ClosingCTASection from "./components/ClosingCTASection";
import {
  footerNavigation,
} from "./contentSections";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        <Hero />
        <ValuePreviewSection />
        <ProblemAgitationSection />
        <SocialProofSection />
        <ScientificSolutionSection />
        <FAQSection />
        <PrivacyPromiseSection />
        <ClosingCTASection />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
