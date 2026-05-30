# Tasks: Knowledge Extraction & Reporting

**Input**: Design documents from `/specs/001-knowledge-extraction/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in feature specification. Tests are OPTIONAL.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- **Next.js App Router**: `src/app/` for pages, `src/components/` for UI
- **Supabase**: `supabase/migrations/` for database, `src/lib/supabase/` for client

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Next.js 14+ project with TypeScript in src/
- [ ] T002 [P] Install and configure Tailwind CSS in tailwind.config.ts
- [ ] T003 [P] Install and configure shadcn/ui in src/components/ui/
- [ ] T004 [P] Configure ESLint and Prettier in .eslintrc.json and .prettierrc
- [ ] T005 [P] Configure Vitest for unit testing in vitest.config.ts
- [ ] T006 [P] Configure Playwright for e2e testing in playwright.config.ts
- [ ] T007 Initialize Supabase local CLI with npx supabase init
- [ ] T008 [P] Create environment configuration in .env.local and .env.example
- [ ] T009 [P] Set up project README.md with setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create Supabase database migrations in supabase/migrations/
- [ ] T011 [P] Implement Supabase client configuration in src/lib/supabase/client.ts
- [ ] T012 [P] Implement Supabase server client in src/lib/supabase/server.ts
- [ ] T013 [P] Create TypeScript types for all entities in src/types/
- [ ] T014 Implement authentication middleware in src/middleware.ts
- [ ] T015 [P] Create root layout with providers in src/app/layout.tsx
- [ ] T016 [P] Set up Zustand stores in src/stores/
- [ ] T017 [P] Configure React Query provider in src/components/providers.tsx
- [ ] T018 Create error handling utilities in src/lib/utils/error.ts
- [ ] T019 [P] Set up logging infrastructure in src/lib/utils/logger.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Extract Knowledge from Video (Priority: P1) 🎯 MVP

**Goal**: Users can paste a video link from YouTube, X.com, or TikTok and receive a comprehensive knowledge extraction report

**Independent Test**: Provide a video URL and verify a structured report is generated with key concepts, actionable insights, and implementation guidance

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create video platform adapter interface in src/lib/video/types.ts
- [ ] T021 [P] [US1] Implement YouTube transcript extractor in src/lib/video/youtube.ts
- [ ] T022 [P] [US1] Implement X.com video scraper in src/lib/video/xcom.ts
- [ ] T023 [P] [US1] Implement TikTok video scraper in src/lib/video/tiktok.ts
- [ ] T024 [US1] Create video URL parser and validator in src/lib/video/parser.ts
- [ ] T025 [US1] Implement AI knowledge extraction service in src/lib/ai/extraction.ts
- [ ] T026 [US1] Create extraction API route in src/app/api/extract/route.ts
- [ ] T027 [US1] Create extraction status API route in src/app/api/extract/[id]/route.ts
- [ ] T028 [P] [US1] Create extraction page UI in src/app/(dashboard)/extract/page.tsx
- [ ] T029 [P] [US1] Create URL input component in src/components/extraction/url-input.tsx
- [ ] T030 [P] [US1] Create extraction progress component in src/components/extraction/progress.tsx
- [ ] T031 [US1] Implement extraction store in src/stores/extraction.ts
- [ ] T032 [US1] Add real-time extraction status updates via Supabase Realtime
- [ ] T033 [US1] Implement error handling for failed extractions
- [ ] T034 [US1] Add retry mechanism for failed extractions

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View and Manage Saved Knowledge (Priority: P1)

**Goal**: Users can view all saved knowledge extractions organized by category with search and filter capabilities

**Independent Test**: Save multiple extractions, then browse/search the knowledge library to verify organization and retrieval work correctly

### Implementation for User Story 2

- [ ] T035 [P] [US2] Create knowledge categories API route in src/app/api/categories/route.ts
- [ ] T036 [P] [US2] Create knowledge list API route in src/app/api/knowledge/route.ts
- [ ] T037 [P] [US2] Create knowledge detail API route in src/app/api/knowledge/[id]/route.ts
- [ ] T038 [P] [US2] Create categories page UI in src/app/(dashboard)/knowledge/categories/page.tsx
- [ ] T039 [P] [US2] Create knowledge library page UI in src/app/(dashboard)/knowledge/page.tsx
- [ ] T040 [P] [US2] Create knowledge list component in src/components/knowledge/knowledge-list.tsx
- [ ] T041 [P] [US2] Create knowledge card component in src/components/knowledge/knowledge-card.tsx
- [ ] T042 [P] [US2] Create search component in src/components/knowledge/search-bar.tsx
- [ ] T043 [P] [US2] Create category filter component in src/components/knowledge/category-filter.tsx
- [ ] T044 [US2] Implement knowledge store in src/stores/knowledge.ts
- [ ] T045 [US2] Add delete functionality with confirmation dialog
- [ ] T046 [US2] Implement pagination for knowledge list

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Detailed Insightful Report (Priority: P1)

**Goal**: Users receive reports that are easy to understand with actionable insights for beginners

**Independent Test**: Review generated reports for clarity, completeness, and actionability by users with varying expertise levels

### Implementation for User Story 3

- [ ] T047 [P] [US3] Create report API route in src/app/api/reports/[id]/route.ts
- [ ] T048 [P] [US3] Create report page UI in src/app/(dashboard)/knowledge/[id]/page.tsx
- [ ] T049 [P] [US3] Create report summary component in src/components/reports/summary.tsx
- [ ] T050 [P] [US3] Create key concepts component in src/components/reports/key-concepts.tsx
- [ ] T051 [P] [US3] Create implementation steps component in src/components/reports/implementation-steps.tsx
- [ ] T052 [P] [US3] Create tools list component in src/components/reports/tools-list.tsx
- [ ] T053 [P] [US3] Create difficulty indicator component in src/components/reports/difficulty-indicator.tsx
- [ ] T054 [P] [US3] Create time estimate component in src/components/reports/time-estimate.tsx
- [ ] T055 [US3] Implement report store in src/stores/report.ts
- [ ] T056 [US3] Add report metadata display (relevance, feasibility, value scores)

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Multi-Profile Management (Priority: P2)

**Goal**: Users can create multiple profiles to organize knowledge by different life areas

**Independent Test**: Create multiple profiles, extract knowledge to different profiles, and verify separation and switching works correctly

### Implementation for User Story 4

- [ ] T057 [P] [US4] Create profiles API route in src/app/api/profiles/route.ts
- [ ] T058 [P] [US4] Create profile detail API route in src/app/api/profiles/[id]/route.ts
- [ ] T059 [P] [US4] Create profiles page UI in src/app/(dashboard)/profiles/page.tsx
- [ ] T060 [P] [US4] Create profile list component in src/components/profiles/profile-list.tsx
- [ ] T061 [P] [US4] Create profile card component in src/components/profiles/profile-card.tsx
- [ ] T062 [P] [US4] Create profile form component in src/components/profiles/profile-form.tsx
- [ ] T063 [US4] Implement profile store in src/stores/profile.ts
- [ ] T064 [US4] Add profile switching functionality to dashboard
- [ ] T065 [US4] Update extraction flow to support profile selection
- [ ] T066 [US4] Add delete profile with confirmation and knowledge cleanup

**Checkpoint**: User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Export Reports (Priority: P2)

**Goal**: Users can export knowledge reports as HTML or PDF for sharing and external storage

**Independent Test**: Generate export files and verify they contain all report sections with proper formatting

### Implementation for User Story 5

- [ ] T067 [P] [US5] Create export API route in src/app/api/export/route.ts
- [ ] T068 [P] [US5] Create export status API route in src/app/api/export/[id]/route.ts
- [ ] T069 [P] [US5] Implement PDF generation service in src/lib/pdf/generator.ts
- [ ] T070 [P] [US5] Implement HTML export service in src/lib/pdf/html-export.ts
- [ ] T071 [P] [US5] Create export button component in src/components/reports/export-button.tsx
- [ ] T072 [P] [US5] Create export format selector in src/components/reports/export-format-selector.tsx
- [ ] T073 [US5] Implement export store in src/stores/export.ts
- [ ] T074 [US5] Add export progress indicator
- [ ] T075 [US5] Implement file download and share functionality

**Checkpoint**: User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Video Analysis & Feasibility Assessment (Priority: P2)

**Goal**: Users see analysis of video relevance, difficulty, and implementation feasibility

**Independent Test**: Extract knowledge from various videos and verify relevance scores, difficulty ratings, and feasibility assessments are provided

### Implementation for User Story 6

- [ ] T076 [P] [US6] Create AI analysis service in src/lib/ai/analysis.ts
- [ ] T077 [P] [US6] Create relevance scoring component in src/components/reports/relevance-score.tsx
- [ ] T078 [P] [US6] Create feasibility assessment component in src/components/reports/feasibility-assessment.tsx
- [ ] T079 [P] [US6] Create warnings display component in src/components/reports/warnings.tsx
- [ ] T080 [US6] Integrate analysis into extraction pipeline
- [ ] T081 [US6] Add analysis scores to knowledge reports
- [ ] T082 [US6] Implement profile-based relevance calculation

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T083 [P] Add comprehensive error boundaries in src/app/error.tsx
- [ ] T084 [P] Implement loading states for all pages
- [ ] T085 [P] Add toast notifications for user feedback
- [ ] T086 [P] Implement offline support with service worker
- [ ] T087 [P] Add responsive design optimizations for mobile
- [ ] T088 [P] Implement PWA manifest in public/manifest.json
- [ ] T089 Security audit and RLS policy validation
- [ ] T090 Performance optimization (bundle size, lazy loading)
- [ ] T091 [P] Add comprehensive JSDoc comments
- [ ] T092 Run quickstart.md validation
- [ ] T093 Final integration testing across all user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 for profile selection
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US3 for report export
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 extraction pipeline

### Within Each User Story

- Models before services
- Services before endpoints
- Endpoints before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all video platform adapters together:
Task: "Implement YouTube transcript extractor in src/lib/video/youtube.ts"
Task: "Implement X.com video scraper in src/lib/video/xcom.ts"
Task: "Implement TikTok video scraper in src/lib/video/tiktok.ts"

# Launch all UI components together:
Task: "Create URL input component in src/components/extraction/url-input.tsx"
Task: "Create extraction progress component in src/components/extraction/progress.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Knowledge Extraction)
4. Complete Phase 4: User Story 2 (Knowledge Management)
5. Complete Phase 5: User Story 3 (Insightful Reports)
6. **STOP and VALIDATE**: Test P1 stories independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Core extraction!)
3. Add User Story 2 → Test independently → Deploy/Demo (Knowledge library!)
4. Add User Story 3 → Test independently → Deploy/Demo (Full reports!)
5. Add User Story 4 → Test independently → Deploy/Demo (Multi-profile!)
6. Add User Story 5 → Test independently → Deploy/Demo (Export!)
7. Add User Story 6 → Test independently → Deploy/Demo (Analysis!)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Extraction)
   - Developer B: User Story 2 (Knowledge Management)
   - Developer C: User Story 3 (Reports)
3. Stories complete and integrate independently
4. Add P2 stories as capacity allows

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
