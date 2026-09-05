import Navbar from "../components/common/Navbar/Navbar";
import Hero from "../components/home/Hero/Hero";
import CoreServices from "../components/services/CoreServices/CoreServices";
import WorkFlow from "../components/home/WorkFlow/WorkFlow";
import WhyChooseUs from "../components/home/WhyChooseUs/WhyChooseUs";
import About from "../components/about/About";
import CallToAction from "../components/home/CTA/CallToAction";
import Footer from "../components/common/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CoreServices />
      <WorkFlow />
      <WhyChooseUs />
      <About />
      <CallToAction />
      <Footer />
   </>
  );
}

export default Home;