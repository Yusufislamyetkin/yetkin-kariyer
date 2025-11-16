'use client';

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Goal,
  Lightbulb,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { LessonMiniTest } from "./LessonMiniTest";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

type LessonContentBlock =
  | { type: "text"; body: string }
  | { type: "code"; code: string; language?: string; explanation?: string | null }
  | { type: "list"; items: string[]; ordered?: boolean; title?: string }
  | { type: "callout"; variant?: string; title?: string; body: string }
  | { type: "quote"; body: string; attribution?: string };

type LessonSection = {
  id: string;
  title: string;
  summary?: string | null;
  content: LessonContentBlock[];
};

type LessonCheckpoint = {
  id: string;
  question: string;
  options: string[];
  answer?: string | null;
  rationale?: string | null;
};

type LessonResource = {
  id: string;
  label: string;
  href?: string | null;
  type?: string | null;
  description?: string | null;
  estimatedMinutes?: number | null;
};

type LessonPractice = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  estimatedMinutes?: number | null;
  difficulty?: string | null;
  instructions: string[];
};

type ActivitySummary = {
  id?: string;
  title?: string;
  type?: string;
  estimatedMinutes?: number | null;
  prompt?: string | null;
};

type LessonInfoItem = {
  label: string;
  value: string;
};

type RelatedTopic = {
  label: string;
  href: string;
  description?: string | null;
};

type LessonExperienceProps = {
  lessonSlug: string;
  lessonTitle: string;
  lessonDescription?: string | null;
  lessonKeyTakeaways: string[];
  lessonSections: LessonSection[];
  lessonCheckpoints: LessonCheckpoint[];
  lessonResources: LessonResource[];
  lessonPractice: LessonPractice[];
  lessonInfoItems: LessonInfoItem[];
  moduleObjectives: string[];
  moduleLessons: RelatedTopic[];
  moduleTitle: string;
  moduleSummary: string;
  activities: ActivitySummary[];
  onBackHref: string;
};

function renderLessonBlock(block: LessonContentBlock, index: number) {
  switch (block.type) {
    case "code":
      return (
        <div key={`code-${index}`} className="space-y-2">
          <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100 shadow-inner">
            <code>{block.code}</code>
          </pre>
          {block.explanation && (
            <p className="text-xs text-gray-500">{block.explanation}</p>
          )}
        </div>
      );
    case "list":
      return (
        <div key={`list-${index}`} className="space-y-2">
          {block.title && (
            <p className="text-sm font-semibold text-gray-700">{block.title}</p>
          )}
          {block.ordered ? (
            <ol className="list-decimal space-y-1 pl-6 text-sm text-gray-700">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul className="list-disc space-y-1 pl-6 text-sm text-gray-700">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "callout": {
      const variant = block.variant ?? "info";
      const palette: Record<string, string> = {
        tip: "border-green-200 bg-green-50 text-green-800",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        info: "border-blue-200 bg-blue-50 text-blue-800",
      };
      const calloutClasses = palette[variant] ?? palette.info;
      return (
        <div
          key={`callout-${index}`}
          className={`rounded-xl border px-4 py-3 text-sm ${calloutClasses}`}
        >
          {block.title && (
            <p className="text-sm font-semibold">{block.title}</p>
          )}
          <p className="mt-1 leading-relaxed">{block.body}</p>
        </div>
      );
    }
    case "quote":
      return (
        <blockquote
          key={`quote-${index}`}
          className="rounded-xl border-l-4 border-blue-300 bg-blue-50/80 px-5 py-4 text-sm italic text-blue-900"
        >
          <p>{block.body}</p>
          {block.attribution && (
            <footer className="mt-2 text-xs font-semibold not-italic text-blue-700">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "text":
    default:
      return (
        <p key={`text-${index}`} className="text-sm leading-6 text-gray-700">
          {block.body}
        </p>
      );
  }
}

function StepBadge({
  label,
  active,
  completed,
}: {
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : completed
            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
            : "border-gray-200 bg-gray-50 text-gray-500"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
        }`}
      >
        {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : label[0]}
      </span>
      <span className="uppercase tracking-wide">{label}</span>
    </div>
  );
}

export function LessonExperience(props: LessonExperienceProps) {
  const {
    lessonSlug,
    lessonTitle,
    lessonDescription,
    lessonKeyTakeaways,
    lessonSections,
    lessonCheckpoints,
    lessonResources,
    lessonPractice,
    lessonInfoItems,
    moduleObjectives,
    moduleLessons,
    moduleTitle,
    moduleSummary,
    activities,
    onBackHref,
  } = props;

  const [activeStep, setActiveStep] = useState<0 | 1>(0);
  const [miniTestPassed, setMiniTestPassed] = useState(false);

  const handleStatusChange = useCallback(({ passed }: { passed: boolean }) => {
    setMiniTestPassed(passed);
  }, []);

  const stepDescriptions = useMemo(
    () => [
      {
        title: "Konu Anlatımı",
        description:
          "Dersin tüm bölümlerini incele, örnekleri uygula ve pratik görevleri tamamla.",
      },
      {
        title: "Mini Test",
        description:
          "Üç soruluk mini sınav ile kazanımlarını doğrula ve dersi tamamla.",
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-blue-100 bg-white/70 px-6 py-6 shadow-md shadow-blue-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
              Ders Akışı
            </p>
            <h2 className="text-2xl font-bold text-gray-900">{lessonTitle}</h2>
            {lessonDescription && (
              <p className="text-sm text-gray-600">{lessonDescription}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StepBadge
              label="Konu"
              active={activeStep === 0}
              completed={miniTestPassed}
            />
            <StepBadge
              label="Test"
              active={activeStep === 1}
              completed={miniTestPassed}
            />
          </div>
        </div>
        {lessonInfoItems.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lessonInfoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm"
              >
                <span className="text-blue-700">{item.label}</span>
                <span className="font-semibold text-blue-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stepDescriptions.map((step, index) => (
            <div
              key={step.title}
              className={`rounded-2xl border px-5 py-4 transition ${
                activeStep === index
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Adım {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {step.title}
              </p>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={activeStep === 0 ? "primary" : "secondary"}
            className="gap-2"
            onClick={() => setActiveStep(0)}
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            Konu anlatımı
          </Button>
          <Button
            type="button"
            variant={activeStep === 1 ? "primary" : "secondary"}
            className="gap-2"
            onClick={() => setActiveStep(1)}
          >
            Mini teste geç
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
          <Button
            href={onBackHref}
            variant="ghost"
            className="inline-flex items-center gap-2 text-sm text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Modül sayfasına dön
          </Button>
        </div>
      </div>

      <div hidden={activeStep !== 0} className="space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ListChecks className="h-5 w-5 text-blue-600" />
              Bu derste kazanacakların
            </CardTitle>
            <p className="text-sm text-gray-600">
              Modül hedeflerini ve ders sonunda cebinde kalacakları gözden geçir.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {moduleObjectives.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Modül hedefleri
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {moduleObjectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-2">
                      <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {lessonKeyTakeaways.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                  <Sparkles className="h-4 w-4" />
                  Dersi tamamladığında
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {lessonKeyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="flex items-start gap-2">
                      <span className="mt-1 block h-2 w-2 rounded-full bg-amber-400" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {moduleSummary && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  Modül özeti:
                </span>{" "}
                {moduleSummary}
              </p>
            )}
          </CardContent>
        </Card>

        {lessonSections.length > 0 && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Ders içeriği
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {lessonSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-gray-100 bg-white/80 p-5 shadow-sm shadow-blue-50"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Bölüm
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    {section.summary && (
                      <p className="text-sm leading-6 text-gray-600">
                        {section.summary}
                      </p>
                    )}
                  </div>
                  {section.content.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {section.content.map((block, blockIndex) =>
                        renderLessonBlock(block, blockIndex)
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}


        {lessonPractice.length > 0 && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Goal className="h-5 w-5 text-emerald-600" />
                Pratik görevler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lessonPractice.map((task) => {
                const isCoding = task.type?.toLowerCase() === "coding";
                return (
                  <div
                    key={task.id}
                    className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-emerald-900">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-emerald-800">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-700">
                        {task.type && (
                          <span className="rounded-full bg-white px-2 py-1 capitalize">
                            {task.type}
                          </span>
                        )}
                        {typeof task.estimatedMinutes === "number" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">
                            {task.estimatedMinutes} dk
                          </span>
                        )}
                        {task.difficulty && (
                          <span className="rounded-full bg-white px-2 py-1">
                            {task.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.instructions.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm text-emerald-900">
                        {task.instructions.map((instruction, index) => (
                          <li
                            key={`${task.id}-instruction-${index}`}
                            className="flex gap-2"
                          >
                            <span className="mt-1 block h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {isCoding && (
                      <div className="mt-4">
                        <Link href="/education/live-coding">
                          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                            Kodlamaya başla
                            <ChevronLeft className="h-4 w-4 rotate-180" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="h-5 w-5 text-blue-600" />
                Kaynaklar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessonResources.length > 0 ? (
                lessonResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-gray-900">
                        {resource.label}
                      </p>
                      {resource.description && (
                        <p className="text-xs text-gray-500">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {resource.type && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-wide text-gray-600">
                            {resource.type}
                          </span>
                        )}
                      </div>
                      {typeof resource.estimatedMinutes === "number" && (
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          {resource.estimatedMinutes} dk
                        </span>
                      )}
                    </div>
                    {resource.href && (
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Kaynağı aç
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Bu ders için ek kaynaklar yakında eklenecek.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Diğer ilgili dersler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {moduleLessons.length > 0 ? (
                  moduleLessons.map((lesson) => (
                    <div
                      key={lesson.href}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                    >
                      <p className="font-semibold text-gray-900">
                        {lesson.label}
                      </p>
                      {lesson.description && (
                        <p className="mt-1 text-xs text-gray-500">
                          {lesson.description}
                        </p>
                      )}
                      <Link
                        href={lesson.href}
                        className="mt-3 inline-flex"
                      >
                        <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
                          Derse git
                          <ChevronLeft className="rotate-180 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Bu modül altında başka ders bulunmuyor.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            className="gap-2"
            onClick={() => setActiveStep(1)}
          >
            Mini teste başla
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>

      <div hidden={activeStep !== 1}>
        <LessonMiniTest
          lessonSlug={lessonSlug}
          lessonTitle={lessonTitle}
          onStatusChange={handleStatusChange}
        />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 text-gray-600"
            onClick={() => setActiveStep(0)}
          >
            <ChevronLeft className="h-4 w-4" />
            Konu anlatımına dön
          </Button>
          {miniTestPassed && (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Şahane! Bu dersi tamamladın.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


