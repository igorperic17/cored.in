import { CredentialDTO } from "@coredin/shared";
import MerkleTree from "merkletreejs";

export const getSections = (
  credentials: CredentialDTO[],
  tree: MerkleTree,
  isOwnProfile: boolean
) => {
  return [
    {
      section: "Education",
      credentials: credentials.filter((c) => c.type === "EducationCredential"),
      tree,
      showEdit: isOwnProfile
    },
    {
      section: "Experience",
      credentials: credentials.filter(
        (c) => c.type === "ProfessionalExperience"
      ),
      tree,
      showEdit: isOwnProfile
    },
    {
      section: "Events",
      credentials: credentials.filter((c) => c.type === "EventAttendance"),
      tree,
      showEdit: isOwnProfile
    }
  ];
};
