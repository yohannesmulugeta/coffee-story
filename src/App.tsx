import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LegacySection } from "./components/LegacySection";
import { ScrollStory } from "./components/ScrollStory";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <ScrollStory />
        <LegacySection />
      </main>
      <Footer />
    </>
  );
}
