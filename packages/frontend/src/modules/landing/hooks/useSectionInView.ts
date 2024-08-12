import { useEffect, useState } from "react";
import { NAV_SECTIONS, NavSection } from "../constants";

export const useSectionInView = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>("home");

  const checkInView = () => {
    for (const section of NAV_SECTIONS) {
      const element = document.querySelector(`#${section.title}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // console.log(section.title, "rect", rect);
        if (rect.bottom >= window.innerHeight / 2) {
          setCurrentSection(section.title);
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
