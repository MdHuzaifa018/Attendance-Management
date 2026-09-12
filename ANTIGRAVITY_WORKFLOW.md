# Antigravity Workflow --- Attendance Management System

## 1. Create a Git checkpoint first

``` bash
git status
git add .
git commit -m "checkpoint before antigravity"
```

Never let an AI coding agent make large changes without a recoverable
checkpoint.

## 2. Keep these documents available

-   `ANTIGRAVITY_MASTER_PROMPT.md`
-   `ANTIGRAVITY_WORKFLOW.md`
-   `PHASE_STATUS_HANDOFF.md`
-   `01_PROJECT_OVERVIEW.md`
-   `02_ARCHITECTURE_AND_TECH_STACK.md`
-   `03_FEATURES_PAGES_AND_FUNCTIONALITY.md`
-   `04_DATABASE_API_AND_AI_GUIDE.md`

## 3. First prompt to Antigravity

> Read `ANTIGRAVITY_MASTER_PROMPT.md` completely.
>
> Inspect the existing repository. Do not modify files yet.
>
> Compare the actual repository with the architecture/progress in the
> prompt.
>
> Report: 1. current folder structure 2. backend files 3. frontend files
> 4. dependencies 5. authentication implementation 6. Phase 5
> implementation 7. missing pieces 8. conflicts/risky code 9. exact next
> 5--8 files you recommend changing
>
> Do not write code yet. Wait for approval.

## 4. Coding prompt

> Inspection is approved.
>
> Implement only the agreed Phase 5 batch.
>
> Inspect each file before modifying it and preserve working
> functionality.
>
> JavaScript/JSX only. Keep the agreed architecture.
>
> After implementation: - run frontend and backend - check imports -
> check console/server errors - test affected functionality - list
> changed files - explain changes - report exact test results - report
> remaining issues
>
> Do not claim a test passed unless it was actually run.

## 5. Debugging prompt

> Debug this issue without rewriting unrelated parts.
>
> First identify the exact error, file/line, root cause and why it
> happened.
>
> Make the smallest correct fix.
>
> Restart the affected server/dev server, reproduce the original action,
> verify the fix, and report the result.

## 6. UI improvement prompt

> Improve only the UI of the current feature. Do not change business
> logic or API contracts.
>
> Requirements: premium modern SaaS/admin design, responsive,
> accessible, Tailwind CSS only, Lucide icons, subtle Framer Motion
> animation, good loading/error/empty states, professional spacing and
> typography, no Bootstrap, no excessive gradients/glassmorphism.

## 7. Code-teaching prompt

> Do not modify code.
>
> Teach me the selected files one by one. For each file explain purpose,
> imports, every important line/block, concepts, data flow, relationship
> with other files, common mistakes, testing, and viva/interview
> questions.
>
> Explain first in simple language, then technical terminology, like a
> teacher teaching a BCA student.

## 8. Testing checklist

### Auth

-   valid registration
-   duplicate email
-   invalid email
-   short password
-   valid login
-   wrong password
-   unknown email
-   `/me` without token
-   `/me` with valid token
-   fake token
-   expired token
-   logout
-   refresh persistence

### Authorization

-   student blocked from admin API
-   teacher blocked from admin API
-   teacher can access assigned functionality
-   admin can access admin functionality

### UI

-   desktop/tablet/mobile
-   loading
-   empty
-   API error
-   form validation
-   toast
-   navigation
-   logout

## 9. Git checkpoints

After a meaningful completed phase:

``` bash
git add .
git commit -m "complete phase 5"
```

Never commit:

``` text
.env
node_modules/
dist/
```

## 10. Stop and ask before

Do not automatically: - change database technology - replace the stack -
introduce TypeScript - add a UI framework - delete modules - change API
contracts - change attendance rules

## 11. Standard cycle

``` text
INSPECT → PLAN → APPROVE → IMPLEMENT → RUN → TEST → DEBUG → DOCUMENT → GIT CHECKPOINT → NEXT PHASE
```
