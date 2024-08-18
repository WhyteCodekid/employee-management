import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      isIconOnly={true}
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="md"
      className="text-success text-sm p-2"
      variant="light"
      color="success"
      radius="full"
    >
      <AnimatePresence>
        {theme === "dark" ? (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillOpacity={0}
              stroke="currentColor"
              strokeDasharray={64}
              strokeDashoffset={64}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C15.53 21 18.59 18.96 20.06 16C20.06 16 14 17.5 11 13C8 8.5 12 3 12 3Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="64;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="fill-opacity"
                begin="0.6s"
                dur="0.15s"
                values="0;0.3"
              ></animate>
            </path>
          </motion.svg>
        ) : (
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 24 24"
          >
            <g stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
              <path
                fill="currentColor"
                fillOpacity={0}
                strokeDasharray={34}
                strokeDashoffset={34}
                d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.4s"
                  values="34;0"
                ></animate>
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.9s"
                  dur="0.15s"
                  values="0;0.3"
                ></animate>
              </path>
              <g fill="none" strokeDasharray={2} strokeDashoffset={2}>
                <path d="M0 0">
                  <animate
                    fill="freeze"
                    attributeName="d"
                    begin="0.5s"
                    dur="0.2s"
                    values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
                  ></animate>
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.5s"
                    dur="0.2s"
                    values="2;0"
                  ></animate>
                </path>
                <path d="M0 0">
                  <animate
                    fill="freeze"
                    attributeName="d"
                    begin="0.7s"
                    dur="0.2s"
                    values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
                  ></animate>
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.7s"
                    dur="0.2s"
                    values="2;0"
                  ></animate>
                </path>
              </g>
            </g>
          </motion.svg>
        )}
      </AnimatePresence>
    </Button>
  );
}
