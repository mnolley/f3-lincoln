/** Slack API shapes we care about for backblasts. */

export type SlackTextObject = {
  type?: string;
  text?: string;
};

export type SlackBlock = {
  type: string;
  text?: SlackTextObject;
  elements?: unknown[];
  fields?: SlackTextObject[];
};

export type SlackMessage = {
  type?: string;
  subtype?: string;
  ts: string;
  text?: string;
  bot_id?: string;
  app_id?: string;
  username?: string;
  user?: string;
  blocks?: SlackBlock[];
  metadata?: {
    event_type?: string;
    event_payload?: Record<string, unknown>;
  };
  thread_ts?: string;
};

export type SlackHistoryResponse = {
  ok: boolean;
  error?: string;
  messages?: SlackMessage[];
  has_more?: boolean;
  response_metadata?: { next_cursor?: string };
};
