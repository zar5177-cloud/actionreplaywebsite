import { forumThread } from "@/data/config/forum-posts";

export function ForumThread() {
  return (
    <article className="overflow-hidden border border-[#6e7893]/45 bg-[#090b12] shadow-[0_0_40px_rgba(14,165,233,0.08)]">
      <header className="border-b border-[#6e7893]/45 bg-[#141824] p-3 font-mono text-xs text-zinc-300 sm:p-4">
        <div className="flex flex-wrap justify-between gap-2">
          <span>Action Replay Underground BBS</span>
          <span>{forumThread.stats}</span>
        </div>
        <h1 className="mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-4xl">
          {forumThread.title}
        </h1>
        <p className="mt-2 text-zinc-500">{forumThread.archivedAt}</p>
      </header>

      <div className="divide-y divide-[#6e7893]/30">
        {forumThread.posts.map((post, index) => (
          <section
            key={post.id}
            className="grid gap-0 bg-[#0d1019] sm:grid-cols-[12rem_1fr]"
            aria-labelledby={`${post.id}-user`}
          >
            <aside className="border-b border-[#6e7893]/25 bg-[#111522] p-3 sm:border-b-0 sm:border-r sm:p-4">
              <p
                id={`${post.id}-user`}
                className="font-mono text-sm font-bold text-sky-200"
              >
                {post.user}
              </p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-zinc-500">
                {post.role ?? `member_${String(index + 14).padStart(3, "0")}`}
              </p>
              <p className="mt-4 font-mono text-[0.68rem] text-zinc-500">
                posts: {31 + index * 7}
              </p>
            </aside>
            <div className="p-3 sm:p-4">
              <p className="border-b border-[#6e7893]/20 pb-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
                posted {post.timestamp}
              </p>
              <p className="mt-4 max-w-3xl font-mono text-sm leading-7 text-zinc-200">
                {post.body}
              </p>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
