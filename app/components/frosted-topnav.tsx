import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
// import {
//   FacebookAnimated,
//   InstagramAnimated,
//   TwitterAnimated,
// } from "../icons/social-media";
import { Link, useNavigate } from "@remix-run/react";
import ThemeSwitcher from "./ui/theme-switcher";

export default function FrostedNavbar() {
  const navigate = useNavigate();
  // nav handler
  const [scrolled, setScrolled] = useState(false);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close the mobile nav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        navIsOpen
      ) {
        setNavIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navIsOpen]);

  return (
    <>
      <div
        className={`sticky xl:max-w-[100rem] mx-auto  ${
          scrolled
            ? "top-2 backdrop-blur-lg bg-slate-700/90 sticky mx-11 2xl:mx-11"
            : "top-0"
        } transition-all duration-400 h-14 md:h-20 rounded-3xl md:rounded-3xl z-50 flex items-center justify-between px-4`}
      >
        {/* logo */}
        <Link to="/" className="flex items-center gap-2 font-bold">
          AEMS
        </Link>

        {/* navlinks */}
        <div className="flex items-center gap-2"></div>

        {/* cta button */}
        <Button
          isIconOnly
          variant="light"
          className="flex items-center justify-center lg:hidden"
          onClick={() => setNavIsOpen(!navIsOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="size-8 text-black"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 17h8m-8-5h14M5 7h8"
            ></path>
          </svg>
        </Button>
        <div className="lg:flex items-center gap-4 hidden">
          {/* <FacebookAnimated className="size-5 text-white" />
          <TwitterAnimated className="size-5 text-white" />
          <InstagramAnimated className="size-5 text-white" /> */}

          <ThemeSwitcher />
          <Button
            size="sm"
            color="primary"
            radius="full"
            variant="solid"
            className="bg-cyan-400 text-slate-950 font-semibold font-montserrat"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>

      {/* mobile nav */}
      <aside
        ref={mobileNavRef}
        className={`w-[80vw] md:w-[40%] z-[60] bg-cyan-900/60 backdrop-blur-xl dark:bg-slate-800/60 fixed top-0 ${
          navIsOpen ? "left-0" : "-left-[100vw]"
        } transition-all duration-500 h-screen lg:hidden border-r border-white/40 flex justify-between flex-col gap-16 py-3 px-4`}
      >
        <div className="flex justify-center items-center bg-slate-800/60 px-5 py-4 rounded-3xl">
          <img
            src={
              "https://assets-global.website-files.com/65e0baa4c574875c0d348044/65e24a17888b5c95a19354f2_logo-studio-records-white.svg"
            }
            alt="logo"
            className="w-[80%]"
          />
        </div>

        <div className="flex flex-col gap-6"></div>

        <div className="flex items-center gap-5 px-5">
          {/* <FacebookAnimated className="size-5 text-white" />
          <TwitterAnimated className="size-5 text-white" />
          <InstagramAnimated className="size-6 text-white" /> */}
        </div>
      </aside>
    </>
  );
}
