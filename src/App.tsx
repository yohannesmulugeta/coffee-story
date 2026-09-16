import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ScrollStory } from "./components/ScrollStory";
import { SibuSections } from "./components/SibuSections";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <ScrollStory />
        <SibuSections />
      </main>
      <Footer />
    </>
  );
}
