export const NAV_SECTIONS = [
  { title: "home", link: "#" },
  { title: "Why cored.in?", link: "#why-coredin" },
  { title: "advantages", link: "#advantages" },
  { title: "roadmap", link: "#roadmap" }
  // { title: "team", link: "#team" }
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number]["title"];
