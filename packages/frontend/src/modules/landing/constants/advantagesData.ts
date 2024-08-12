import CoreumLogo from "@/assets/partner-logos/coreum.png";
import WaltIdLogo from "@/assets/partner-logos/waltid.png";
import FolderIcon from "@/assets/folderIcon.png";

export const ADVANTAGES_DATA = [
  {
    heading: "Built on Coreum",
    text: "Built on top of the Cosmos ecosystem, Coreum is a Smart-Contract proof-of-stake blockchain built as a core infrastructure for the future of decentralized applications and Defi.\n\nCoreum is actively supporting cored.in as part of the Wave 3 of their development grants.",
    image: CoreumLogo,
    alt: "Coreum",
    link: "https://www.coreum.com/"
  },
  {
    heading: "Soulbound subscriptions",
    text: "Profile subscriptions are represented by soulbound non-fungible tokens that are minted on demand.\n\nUsers can optionally set a price for their subscriptions that will be automatically paid by the subscriber upon minting.",
    image: FolderIcon,
    alt: ""
  },
  {
    heading: "Verifiable credentials",
    text: "By leveraging the open-source SSI (Self-Sovereign Identity) technology from walt.id, each profile is backed by a DID (Decentralized Identifier).\n\nClaims are then based on verifiable credentials which include cryptographic proof of the information issuer to ensure their autenticity. They can be either issued directly within the platform or imported from existing SSI standards.",
    image: WaltIdLogo,
    alt: "Walt ID",
    link: "https://walt.id/"
  }
];
