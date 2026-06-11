import Link from "next/link";
import { getSystemMessage } from "@/data/system-messages";

export function SystemMessageBar() {
  const message = getSystemMessage();
  const content = (
    <>
      <span className="text-lime-200">SYSTEM MESSAGE:</span>{" "}
      <span>{message.message}</span>
    </>
  );

  return (
    <div className="relative z-30 border-b border-lime-300/20 bg-black px-4 py-2 text-center font-mono text-[0.68rem] uppercase tracking-[0.16em] text-zinc-400 sm:px-6">
      {message.href ? (
        <Link href={message.href} className="hover:text-lime-100">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
