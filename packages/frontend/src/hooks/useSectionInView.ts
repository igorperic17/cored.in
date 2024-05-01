import { NavSection, navSections } from "@/constants";
import { useEffect, useState } from "react";

export const useSectionInView = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>("home");

  const checkInView = () => {
    for (const section of navSections) {
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
