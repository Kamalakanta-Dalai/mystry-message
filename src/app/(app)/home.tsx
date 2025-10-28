"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

import messages from "@/constants/messages.json";
import people from "@/constants/people.json";

const Home = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center ">
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Dive into the mystry world of Anonymous Conversations
            </h1>

            <p className="mt-3 md:mt-4 text-xl md:text-2xl lg:text-2xl  ">
              Explore Mystry Message - Where your identity remains untouched
            </p>
          </section>
          <AnimatedTestimonials testimonials={messages} autoplay={true} />
        </main>

        <footer className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center mb-5 w-full">
            <AnimatedTooltip items={people} />
          </div>
          <h2 className="text-2xl font-bold">Our Developers</h2>
          <p className="text-center p-4 md:p-6">
            © 2025 Mystry Message. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
