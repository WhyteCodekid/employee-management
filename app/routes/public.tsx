import { Button } from "@nextui-org/react";
import React from "react";
import FrostedNavbar from "~/components/frosted-topnav";

export default function Public() {
  return (
    <div className="">
      <FrostedNavbar />

      <section className="h-[94vh] px-11 flex items-center justify-center flex-col gap-5 bg-gradient-to-bl from-violet-400 to-purple-300">
        <p className="baskervville-sc-regular text-6xl font-semibold">
          Avaible Job
        </p>
        <p className="baskervville-sc-regular text-6xl font-semibold">
          Openings
        </p>

        <div className="flex gap-3 items-center">
          <input
            type="text"
            className="outline-none bg-white px-9 p-3 rounded-3xl w-96 border"
            placeholder="Search for jobs..."
          />
          <Button
            className="bg-black text-white p-3 rounded-3xl"
            size="lg"
            href="#listings"
          >
            Search
          </Button>
        </div>
      </section>

      <section className="h-[100vh] px-11" id="listings">
        <p>somethign here</p>
      </section>
    </div>
  );
}
