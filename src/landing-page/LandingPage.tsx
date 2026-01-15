import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProblemAgitationSection from "./components/ProblemAgitationSection";
import ScientificSolutionSection from "./components/ScientificSolutionSection";
import PrivacyPromiseSection from "./components/PrivacyPromiseSection";
import {
  footerNavigation,
} from "./contentSections";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        <Hero />
        <ProblemAgitationSection />
        <ScientificSolutionSection />
        <PrivacyPromiseSection />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
