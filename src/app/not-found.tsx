import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  BrokenThumbnail,
  FileStamp,
  InternalComment,
} from "@/components/residue/residue-fragments";

export default function NotFound() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="crt-panel p-5 sm:p-8">
          <div className="flex flex-wrap gap-1.5">
            <FileStamp label="route" value="mirror pending" />
            <FileStamp label="last checked" value="02:14" />
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
            asset unavailable
          </h1>
          <p className="mt-4 max-w-xl font-mono text-sm leading-6 text-zinc-400">
            The folder exists in the index, but the page did not survive this
            mirror. Some links were left because their labels still helped.
          </p>
          <BrokenThumbnail
            fileRef="mirror_pending/empty_folder/.keep"
            altText="empty folder, label intact, preview never filled"
            className="mt-5"
          />
          <InternalComment user="export_boy" className="mt-5">
            restored from old laptop. route still points nowhere.
          </InternalComment>
          <Link href="/archive-log" className="ui-button mt-6">
            <ArrowLeft size={17} aria-hidden="true" />
            open restore log
          </Link>
        </div>
      </div>
    </section>
  );
}
