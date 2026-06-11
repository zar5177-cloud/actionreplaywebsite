"use client";

import Link from "next/link";
import { useState } from "react";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import type { ArchiveFile } from "@/data/config/archive-files";
import { archiveResidueByFileId } from "@/data/residue";
import { trackArchiveUnlockClick } from "@/lib/analytics/microConversions";
import {
  DuplicateFileNotice,
  FileStamp,
  AliasStrip,
  BrokenThumbnail,
  AbsentMedia,
  InternalComment,
  MissingAsset,
  ObsoleteWarning,
  PreservationNote,
  RestorationNote,
  TemporalMismatch,
  UnlockHintFragment,
} from "@/components/residue/residue-fragments";

type ArchiveGridProps = {
  files: readonly ArchiveFile[];
};

const toneClassByThumbnail: Record<ArchiveFile["thumbnailTone"], string> = {
  blue: "from-sky-400/30 via-blue-950 to-black",
  violet: "from-violet-400/30 via-indigo-950 to-black",
  silver: "from-zinc-100/30 via-slate-800 to-black",
  magenta: "from-fuchsia-400/30 via-purple-950 to-black",
  green: "from-lime-300/25 via-emerald-950 to-black",
};

export function ArchiveGrid({ files }: ArchiveGridProps) {
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {files.map((file) => {
          const residue = archiveResidueByFileId[file.id];

          return (
            <button
              key={file.id}
              type="button"
              onClick={() => {
                trackArchiveUnlockClick(file.id, "archive_grid");
                setSelectedFile(file);
              }}
              className="group min-w-0 border border-white/12 bg-black/60 p-3 text-left transition hover:-translate-y-1 hover:border-sky-300/60 hover:bg-sky-950/25 focus-visible:-translate-y-1"
            >
              <div
                className={`archive-thumb bg-gradient-to-br ${toneClassByThumbnail[file.thumbnailTone]}`}
                aria-hidden="true"
              >
                <span>{file.fileName}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em]">
                <span className="text-zinc-500">{file.timestamp}</span>
                <span className="text-lime-200">
                  {file.status ?? file.rarity}
                </span>
              </div>
              <h2 className="mt-3 min-h-14 text-xl font-black uppercase leading-none text-white">
                {file.fileName}: {file.title}
              </h2>
              <p className="mt-3 line-clamp-3 font-mono text-xs leading-5 text-zinc-400">
                {file.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {file.classification ? (
                  <FileStamp label="class" value={file.classification} />
                ) : null}
                {file.accessTier ? (
                  <FileStamp label="access" value={file.accessTier} />
                ) : null}
                {typeof file.corruptionLevel === "number" ? (
                  <FileStamp label="corrupt" value={`${file.corruptionLevel}%`} />
                ) : null}
              </div>
              {residue ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <FileStamp label="rev" value={residue.revision} />
                  <FileStamp label="state" value={residue.state} />
                  {residue.maintainer ? (
                    <FileStamp label="touched" value={residue.maintainer} />
                  ) : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedFile ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/82 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-detail-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close archive detail"
            onClick={() => setSelectedFile(null)}
          />
          <article className="relative max-h-[90vh] w-full max-w-2xl overflow-auto border border-sky-300/45 bg-[#02040b] p-4 shadow-[0_0_80px_rgba(56,189,248,0.18)] sm:p-6">
            {(() => {
              const residue = archiveResidueByFileId[selectedFile.id];

              return residue ? (
                <>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <FileStamp label="last verified" value={residue.lastVerified} />
                    <FileStamp label="state" value={residue.state} />
                    {residue.maintainer ? (
                      <FileStamp label="touched" value={residue.maintainer} />
                    ) : null}
                  </div>
                  {residue.aliases ? (
                    <AliasStrip aliases={residue.aliases} className="mb-3" />
                  ) : null}
                  {residue.timestampConflict ? (
                    <TemporalMismatch className="mb-3">
                      {residue.timestampConflict}
                    </TemporalMismatch>
                  ) : null}
                  {residue.obsoleteWarning ? (
                    <ObsoleteWarning className="mb-3">
                      {residue.obsoleteWarning}
                    </ObsoleteWarning>
                  ) : null}
                </>
              ) : null;
            })()}
            <div
              className={`archive-thumb min-h-52 bg-gradient-to-br ${toneClassByThumbnail[selectedFile.thumbnailTone]}`}
              aria-hidden="true"
            >
              <span>{selectedFile.checksum}</span>
            </div>
            <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-lime-200">
              {selectedFile.fileName} / {selectedFile.rarity}
            </p>
            <h2
              id="archive-detail-title"
              className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl"
            >
              {selectedFile.title}
            </h2>
            <p className="mt-4 font-mono text-sm leading-6 text-zinc-300">
              {selectedFile.description}
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                ["file id", selectedFile.id],
                ["classification", selectedFile.classification ?? "untyped"],
                ["status", selectedFile.status ?? selectedFile.rarity],
                ["access tier", selectedFile.accessTier ?? "open"],
                [
                  "corruption",
                  typeof selectedFile.corruptionLevel === "number"
                    ? `${selectedFile.corruptionLevel}%`
                    : "unlogged",
                ],
                ["release", selectedFile.releaseDate ?? "timestamp conflict"],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/10 bg-white/[0.03] p-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-zinc-600">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase text-zinc-200">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {selectedFile.systemNote ? (
              <p className="mt-4 border-l-2 border-lime-300/60 bg-lime-300/10 p-3 font-mono text-xs uppercase leading-5 text-lime-100">
                system note: {selectedFile.systemNote}
              </p>
            ) : null}
            {selectedFile.status === "locked" ? (
              <div className="mt-5">
                <ReplayClubSignup
                  compact
                  placement={`archive_locked_${selectedFile.id}`}
                  source="archive"
                  title="REQUEST CLEARANCE"
                  copy="some files require replay club access before the preview restores."
                />
              </div>
            ) : null}
            {(() => {
              const residue = archiveResidueByFileId[selectedFile.id];

              if (!residue) return null;

              return (
                <div className="mt-5 grid gap-3">
                  <RestorationNote>{residue.restoredFrom}</RestorationNote>
                  {residue.duplicateFile ? (
                    <DuplicateFileNotice fileName={residue.duplicateFile} />
                  ) : null}
                  {residue.internalComment ? (
                    <InternalComment user={residue.internalComment.user}>
                      {residue.internalComment.body}
                    </InternalComment>
                  ) : null}
                  {residue.preservationNote ? (
                    <PreservationNote>{residue.preservationNote}</PreservationNote>
                  ) : null}
                  {residue.localizationFragment ? (
                    <FileStamp label="loc" value={residue.localizationFragment} />
                  ) : null}
                  {residue.printError ? (
                    <FileStamp label="print" value={residue.printError} />
                  ) : null}
                  {residue.compressionHistory?.length ? (
                    <div className="grid gap-1.5 border border-white/10 bg-black/35 p-3">
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-600">
                        compression history
                      </p>
                      {residue.compressionHistory.map((entry) => (
                        <p
                          key={entry}
                          className="font-mono text-[0.68rem] leading-5 text-zinc-500"
                        >
                          / {entry}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {residue.missingReference ? (
                    <MissingAsset label={residue.missingReference} />
                  ) : null}
                  {residue.deadImageRef && residue.deadImageAlt ? (
                    <BrokenThumbnail
                      fileRef={residue.deadImageRef}
                      altText={residue.deadImageAlt}
                    />
                  ) : null}
                  {residue.absentMedia ? (
                    <AbsentMedia
                      label={residue.absentMedia.label}
                      fileRef={residue.absentMedia.ref}
                      note={residue.absentMedia.note}
                    />
                  ) : null}
                  {residue.unlockHint ? (
                    <UnlockHintFragment href={residue.unlockHint.href}>
                      {residue.unlockHint.label}
                    </UnlockHintFragment>
                  ) : null}
                </div>
              );
            })()}
            <div className="mt-5 border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                recovery notes
              </p>
              <ul className="mt-3 space-y-2 font-mono text-xs leading-5 text-zinc-300">
                {selectedFile.recoveryNotes.map((note) => (
                  <li key={note}>/ {note}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ui-button mt-5"
            >
              close file
            </button>
            {selectedFile.productHandle ? (
              <Link
                href={`/shop/${selectedFile.productHandle}`}
                className="ui-button ui-button-hot mt-5 sm:ml-2"
              >
                view artifact
              </Link>
            ) : (
              <Link href={`/archive/${selectedFile.id}`} className="ui-button mt-5 sm:ml-2">
                open detail
              </Link>
            )}
          </article>
        </div>
      ) : null}
    </>
  );
}
