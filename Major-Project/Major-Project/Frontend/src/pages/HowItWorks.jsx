import Navbar from "../components/common/Navbar/Navbar";
import WorkFlow from "../components/home/WorkFlow/WorkFlow";
import CallToAction from "../components/home/CTA/CallToAction";
import Footer from "../components/common/Footer/Footer";

function HowItWorks() {
  return (
    <>
      <Navbar />

      <main>
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 py-20 text-center">

            <p className="text-[#54ACBF] font-semibold uppercase tracking-widest">
              How It Works
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#023859]">
              Getting Started with PATRAK
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-gray-600 leading-8">
              From requesting a clinic workspace to managing daily
              operations, PATRAK keeps the entire process simple and
              organized.
            </p>

          </div>
        </section>

        <WorkFlow />

        <CallToAction />
      </main>

      <Footer />
    </>
  );
}

export default HowItWorks;