import { CredentialDTO } from "@coredin/shared";
import MerkleTree from "merkletreejs";

export const getSections = (credentials: CredentialDTO[], tree: MerkleTree) => {
  return [
    {
      section: "Education",
      credentials: credentials.filter((c) => c.type === "EducationCredential"),
      tree
    },
    {
      section: "Experience",
      credentials: credentials.filter(
        (c) => c.type === "ProfessionalExperience"
      ),
      tree
    },
    {
      section: "Events",
      credentials: credentials.filter((c) => c.type === "EventAttendance"),
      tree
    }
  ];
};
