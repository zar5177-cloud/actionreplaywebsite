import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SurveyPayload = {
  answer?: string;
  attribution?: Record<string, string>;
  page?: string;
  placement?: string;
  question?: string;
  question_id?: string;
  session_id?: string;
  timestamp?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

async function writeSurveyLine(payload: Record<string, unknown>) {
  if (process.env.SURVEY_WRITE_MODE === "log") {
    console.info("Action Replay survey answer", payload);
    return "log";
  }

  if (process.env.SURVEY_WRITE_MODE !== "file") {
    return "event_only";
  }

  const [{ appendFile, mkdir }, path] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);
  const directory = path.join(process.cwd(), "data");
  const filePath = path.join(directory, "survey_responses.jsonl");

  await mkdir(directory, { recursive: true });
  await appendFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");

  return "file";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SurveyPayload;
  const answer = clean(body.answer);
  const questionId = clean(body.question_id);

  if (!answer || !questionId) {
    return NextResponse.json(
      { ok: false, error: "answer and question_id are required." },
      { status: 400 },
    );
  }

  const payload = {
    answer,
    attribution: body.attribution ?? {},
    page: clean(body.page),
    placement: clean(body.placement),
    question: clean(body.question),
    question_id: questionId,
    session_id: clean(body.session_id),
    timestamp: clean(body.timestamp) || new Date().toISOString(),
  };

  try {
    const stored = await writeSurveyLine(payload);

    return NextResponse.json({ ok: true, stored });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "survey answer could not be stored.",
      },
      { status: 502 },
    );
  }
}
