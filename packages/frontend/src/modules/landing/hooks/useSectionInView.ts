import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "../constants";

export const useSectionInView = () => {
  const [currentSection, setCurrentSection] = useState<NAV_SECTIONS>(
    NAV_SECTIONS.HOME
  );

  const checkInView = () => {
    for (const section of Object.values(NAV_SECTIONS)) {
      const element = document.querySelector(`#${section}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // console.log(section, "rect", rect);
        if (rect.bottom >= window.innerHeight / 2) {
          setCurrentSection(section);
          break;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", checkInView);
    return () => {
      document.removeEventListener("scroll", checkInView);
    };
  }, []);

  return currentSection;
};
