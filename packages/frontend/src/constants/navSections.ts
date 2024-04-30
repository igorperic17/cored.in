export const navSections = [
  { title: "home", link: "#" },
  { title: "benefits", link: "#benefits" },
  { title: "tech", link: "#tech" },
  { title: "progress", link: "#progress" }
  // { title: "team", link: "#team" }
] as const;

export type NavSection = (typeof navSections)[number]["title"];
