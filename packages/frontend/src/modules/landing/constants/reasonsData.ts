export const REASONS_DATA = [
  {
    title: "Create a verifiable profile",
    description:
      "Gain credibility through verification of your diplomas and work experience by professional institutions, past, and present employers."
  },
  {
    title: "Protect your data",
    description: "Manage who has permission to view your complete profile."
  },
  {
    title: "Chat securely",
    description: "Securely message other users with encrypted messages."
  },
  {
    title: "Get paid",
    description:
      "Get paid for sharing the information in your profile with other users and receiving messages."
  },
  {
    title: "No spam",
    description:
      "Since sending messages incurs a cost, it is less attractive for spammers. If you ever receive messages from them, you will be paid for it."
  }
] as const;

export type reason = (typeof REASONS_DATA)[number]["title"];
