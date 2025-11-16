-- ==========================================================
-- Template: Append a new module to the .NET Core Roadmap course
-- Usage:
--   1. Replace all TODO_* placeholders with the real values.
--   2. Optionally extend objectives / activities / checkpoints arrays.
--   3. Run with: psql $POSTGRES_PRISMA_URL -f scripts/dotnet-core-topic-module-template.sql
-- ==========================================================

BEGIN;

WITH new_module AS (
  SELECT
    $${
      "id": "module-xx-unique-slug",
      "title": "TODO_modul_basligi",
      "summary": "TODO_modul_ozeti (1-2 cumle).",
      "durationMinutes": 90,
      "objectives": [
        "TODO_ilk_ogrenme_hdefi",
        "TODO_ikinci_ogrenme_hedefi"
      ],
      "activities": [
        {
          "id": "activity-xx-concept",
          "type": "concept",
          "title": "TODO_kavramsal_icerik_basligi",
          "estimatedMinutes": 15,
          "content": "TODO_kavramsal_aciklama (Markdown desteklenir).",
          "highlights": [
            "TODO_onemli_not_1",
            "TODO_onemli_not_2"
          ],
          "codeSamples": [
            {
              "language": "csharp",
              "filename": "Program.cs",
              "code": "// TODO: C# kod ornegi.",
              "explanation": "TODO_kod_aciklamasi"
            }
          ],
          "checklist": [
            {
              "id": "check-xx-understanding",
              "label": "TODO_kontrol_maddesi",
              "explanation": "TODO_kontrol_detayi"
            }
          ]
        },
        {
          "id": "activity-xx-guided",
          "type": "guided-exercise",
          "title": "TODO_yonlendirmeli_egzersiz",
          "estimatedMinutes": 30,
          "description": "TODO_egzersiz_aciklamasi",
          "steps": [
            {
              "title": "TODO_adim_1_baslik",
              "detail": "TODO_adim_1_detay",
              "hint": "TODO_adim_1_ipucu"
            },
            {
              "title": "TODO_adim_2_baslik",
              "detail": "TODO_adim_2_detay"
            }
          ],
          "starterCode": {
            "language": "csharp",
            "filename": "Startup.cs",
            "code": "// TODO: Baslangic kodu.",
            "explanation": "TODO_kisa_aciklama"
          },
          "hints": [
            "TODO_ek_ipucu_1",
            "TODO_ek_ipucu_2"
          ],
          "validation": {
            "type": "self",
            "criteria": [
              "TODO_dogrulama_kriteri_1",
              "TODO_dogrulama_kriteri_2"
            ]
          }
        },
        {
          "id": "activity-xx-challenge",
          "type": "code-challenge",
          "title": "TODO_bagimsiz_gorev",
          "estimatedMinutes": 45,
          "description": "TODO_senaryo_aciklamasi",
          "acceptanceCriteria": [
            "TODO_kabul_kriteri_1",
            "TODO_kabul_kriteri_2"
          ],
          "starterCode": {
            "language": "csharp",
            "filename": "Service.cs",
            "code": "// TODO: Servis iskeleti.",
            "explanation": "TODO_servis_aciklamasi"
          },
          "testCases": [
            {
              "id": "test-happy-path",
              "description": "TODO_test_senaryosu",
              "input": "TODO_girdi_aciklamasi",
              "expectedOutput": "TODO_beklenen_cikti"
            }
          ],
          "evaluationTips": [
            "TODO_degerlendirme_ipucu_1"
          ]
        }
      ],
      "checkpoints": [
        {
          "id": "checkpoint-xx-demo",
          "title": "TODO_modul_sonu_gorevi",
          "description": "TODO_checkpoint_aciklamasi",
          "tasks": [
            {
              "id": "task-xx-review",
              "description": "TODO_gorev_detayi",
              "resources": [
                {
                  "id": "resource-xx-link",
                  "title": "TODO_kaynak_basligi",
                  "url": "https://TODO",
                  "type": "article",
                  "description": "TODO_kaynak_aciklamasi"
                }
              ],
              "coachTips": [
                "TODO_mentor_ipuclari"
              ]
            }
          ],
          "successCriteria": [
            "TODO_basarim_kriteri_1",
            "TODO_basarim_kriteri_2"
          ],
          "estimatedMinutes": 30
        }
      ],
      "learnLink": {
        "label": "TODO_ana_link_etiketi",
        "href": "/education/courses?search=TODO_query",
        "description": "TODO_link_aciklamasi"
      },
      "relatedTopics": [
        {
          "label": "TODO_ilgili_konu_1",
          "href": "/education/lessons/TODO_path_1",
          "description": "TODO_ilgili_konu_aciklama_1"
        }
      ]
    }$$::jsonb AS module
)

UPDATE "courses"
SET "content" = jsonb_set(
  "content",
  '{modules}',
  ("content"->'modules') || (SELECT module FROM new_module)
)
WHERE "id" = 'course-dotnet-roadmap';

COMMIT;


