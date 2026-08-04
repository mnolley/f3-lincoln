/**
 * Manual F3 name overrides for Slack user IDs.
 *
 * Resolution order (highest priority last):
 * 1. Learned from Paxminer Q usernames on past backblasts
 * 2. Slack users.list display names (needs users:read scope on the bot)
 * 3. This file (always wins)
 *
 * Add anyone who never Qs so they still show an F3 name on the roster.
 */
export const paxNameOverrides: Record<string, string> = {
  // Seeded from PAX who have Q'd (Paxminer "Username (via F3 Nation)")
  U052K983SMA: "Not Jake",
  U01R59NDWD7: "Gandalf",
  U01M4QSFW8N: "Jon Snow",
  U050EDL1NGY: "Julia Childz",
  U07PN444TEF: "Chino",
  U062T9J9GLT: "Hog Barn",
  U08B3KV2048: "LTB",
  U08N269UFU2: "Red",
  U05AZA29EBZ: "Two Face",
  U0BFWCD4EAX: "Whoopi",
};
