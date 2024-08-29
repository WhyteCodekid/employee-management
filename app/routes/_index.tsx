import { Progress } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import appIllustration from "~/assets/illustrations/data-analysis.svg";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      //  if (!storedValue?.token) {
      //  } else {
      //    navigate(`/${storedValue.user.role}`);
      //  }
      navigate("/public");
    };

    const timeoutId = setTimeout(fetchUser, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="h-screen justify-center items-center flex flex-col gap-5">
      <img src={appIllustration} alt="app illustration" className="w-1/4" />

      <h1 className="font-montserrat font-bold text-4xl">
        Advanced Employee Management System
      </h1>
      <Progress
        size="sm"
        isIndeterminate
        className="w-1/4"
        color="success"
        aria-label="Loader"
      />
    </div>
  );
}
