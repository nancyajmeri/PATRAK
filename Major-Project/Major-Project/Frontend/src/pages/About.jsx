import Navbar from "../components/common/Navbar/Navbar";
import AboutSection from "../components/about/About";
import CallToAction from "../components/home/CTA/CallToAction";
import Footer from "../components/common/Footer/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main>
        <AboutSection />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}

export default About;