# Advanced .NET Core Curriculum

This document explains how the interactive `.NET Core Backend Development` course
is structured, which files hold the canonical content definition, and how to
extend or reseed the data.

## Content Schema

The course uses the strongly typed schema defined in
`types/course-content.ts`. The root `CourseContent` object contains:

- `overview`: summary, audience, skills and total duration
- `learningObjectives` & `prerequisites`: top-level lists
- `modules`: ordered learning units with:
  - `activities`: each activity has a `type` (`concept`, `guided-exercise`,
    `code-challenge`, `discussion`, `reflection`, `knowledge-check`) and
    optional rich data such as steps, code samples, checklists, hints,
    questions, etc.
  - `checkpoints`: larger deliverables with tasks and success criteria
- `resources`: curated references
- `capstone`: final project brief and evaluation rubric

Update the type definitions first when introducing new activity types or fields
so both the seed scripts and UI receive compile-time feedback.

## Seed Data Sources

| Purpose | File |
| --- | --- |
| Canonical dataset | `database-seed.sql` |

`database-seed.sql` artık tüm örnek `.NET Core Backend Development` içeriğini
JSON sütunlarına doğrudan yazar. İçerikte güncelleme yaptığınızda aynı dosyada
ilgili `INSERT` ifadesini düzenlemeniz yeterlidir; ek dönüştürücü script
gerekmiyor.

## Mini Testler

- Her ders için yeni eklenen mini testler `quizzes` tablosunda `type = 'MINI_TEST'`
  olarak saklanır ve `lessonSlug` alanı ile `/education/lessons/...` rotalarına bağlanır.
- Örnek olarak `mini-test-csharp-loops-for` girdisi üç soruluk bir mini sınav sağlar.
  Yeni mini testler eklerken aynı deseni takip edip slug alanını ilgili derse göre
  güncellemeniz yeterlidir.

## Running the Seeds

| Command | Description |
| --- | --- |
| `npm run db:schema` | Drops & recreates the schema using `database-schema.sql` |
| `npm run db:seed` | Inserts canonical data from `database-seed.sql` |
| `npm run db:schema && npm run db:seed` | Tam sıfırlama + seed kombinasyonu |

Gerektiğinde `database-schema.sql` script'i tüm tabloları temizleyip yeniden
oluşturur; ardından `database-seed.sql` örnek verileri ekler.

## UI

The interactive rendering lives in
`app/(dashboard)/education/courses/[id]/page.tsx`. It:

- Renders module accordions with per-activity progress state
- Supports checklists, hints, code samples and knowledge checks
- Surfaces checkpoints, resources and the capstone brief

When you extend the schema, update this page to visualise the new fields.


