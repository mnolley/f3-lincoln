import type { Leader } from "@/lib/types";
import { roleDefinitions } from "@/lib/site";

/**
 * Local leadership directory.
 * f3Name + role are people in admin roles — not workout styles (PRD §4.4).
 */
export const leaders: Leader[] = [
  {
    f3Name: "Not Jake",
    role: "Nantan",
    description: roleDefinitions.Nantan,
  },
  {
    f3Name: "Gandalf",
    role: "Weasel Shaker",
    description: roleDefinitions["Weasel Shaker"],
  },
  {
    f3Name: "TBD",
    role: "Site Q",
    description: roleDefinitions["Site Q"],
    ao: "Sparta",
  },
  {
    f3Name: "TBD",
    role: "1st F Q",
    description: roleDefinitions["1st F Q"],
  },
  {
    f3Name: "TBD",
    role: "2nd F Q",
    description: roleDefinitions["2nd F Q"],
  },
  {
    f3Name: "TBD",
    role: "3rd F Q",
    description: roleDefinitions["3rd F Q"],
  },
];
