export type ForumPost = {
  id: string;
  user: string;
  role?: string;
  timestamp: string;
  body: string;
};

export const forumThread = {
  title: "did anyone else find the action replay hidden event?",
  archivedAt: "archived from bbs.actionreplay.local on 2007-03-03",
  stats: "12 replies / 4 users viewing / images missing",
  posts: [
    {
      id: "p-001",
      user: "slotA",
      role: "thread starter",
      timestamp: "02-26-2007 11:48 PM",
      body: "i was checking the archive mirror and file_001 changed from inactive to active. no banner, no email, just a little status line after the boot text. anyone else seeing this or is my cache messed up?",
    },
    {
      id: "p-002",
      user: "coldboot",
      timestamp: "02-27-2007 12:03 AM",
      body: "same here. the shop page is still locked for me but the event page started counting down from all zeroes. that usually means they already hid the thing.",
    },
    {
      id: "p-003",
      user: "walkthrough_txt",
      timestamp: "02-27-2007 12:19 AM",
      body: "don't brute force it. last time they logged bad entries and shadowbanned half the thread. check the tiny UI pieces first. old cheat sites always hid the real link in the part nobody clicked.",
    },
    {
      id: "p-004",
      user: "no_clip",
      timestamp: "02-27-2007 12:37 AM",
      body: "i found a blue pixel that didn't line up with the grid. not posting the code because people should actually look. it is short and it is exactly the kind of phrase they would use.",
    },
    {
      id: "p-005",
      user: "slotA",
      role: "thread starter",
      timestamp: "02-27-2007 01:04 AM",
      body: "confirmed. entered it on the front page and got the rare encounter message. keeping the window open in case the shop state flips later.",
    },
  ],
} satisfies {
  title: string;
  archivedAt: string;
  stats: string;
  posts: ForumPost[];
};
