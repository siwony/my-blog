---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
---

**⚠️ MANDATORY: Before proceeding, read and follow `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` for all development work.**

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

## Prerequisites Check

1. **REQUIRED**: Read `docs/guidelines/AI_DEVELOPMENT_GUIDELINES.md` and ensure compliance with:
   - Guidelines adherence protocols
   - Atomic commit strategies  
   - Architecture documentation requirements

2. **REQUIRED**: Review related documentation:
   - `docs/guidelines/PROJECT_CONSTITUTION.md` - Core project principles
   - `docs/architecture/SYSTEM_ARCHITECTURE.md` - Current system state
   - `docs/guidelines/PERFORMANCE_GUIDELINES.md` - Performance standards

## Planning Workflow

Given the implementation details provided as an argument, do this:

1. Run `.specify/scripts/bash/setup-plan.sh --json` from the repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. All future file paths must be absolute.
   - BEFORE proceeding, inspect FEATURE_SPEC for a `## Clarifications` section with at least one `Session` subheading. If missing or clearly ambiguous areas remain (vague adjectives, unresolved critical choices), PAUSE and instruct the user to run `/clarify` first to reduce rework. Only continue if: (a) Clarifications exist OR (b) an explicit user override is provided (e.g., "proceed without clarification"). Do not attempt to fabricate clarifications yourself.
2. Read and analyze the feature specification to understand:
   - The feature requirements and user stories
   - Functional and non-functional requirements
   - Success criteria and acceptance criteria
   - Any technical constraints or dependencies mentioned

3. Read the constitution at `.specify/memory/constitution.md` to understand constitutional requirements.

4. Execute the implementation plan template:
   - Load `.specify/templates/plan-template.md` (already copied to IMPL_PLAN path)
   - Set Input path to FEATURE_SPEC
   - Run the Execution Flow (main) function steps 1-9
   - The template is self-contained and executable
   - Follow error handling and gate checks as specified
   - Let the template guide artifact generation in $SPECS_DIR:
     * Phase 0 generates research.md
     * Phase 1 generates data-model.md, contracts/, quickstart.md
     * Phase 2 generates tasks.md
   - Incorporate user-provided details from arguments into Technical Context: $ARGUMENTS
   - Update Progress Tracking as you complete each phase

5. Verify execution completed:
   - Check Progress Tracking shows all phases complete
   - Ensure all required artifacts were generated
   - Confirm no ERROR states in execution

6. **MANDATORY Post-Work Actions** (per AI_DEVELOPMENT_GUIDELINES.md):
   - Commit planning artifacts atomically
   - Update `docs/architecture/SYSTEM_ARCHITECTURE.md` if new architecture decisions
   - Update relevant feature documentation in `docs/features/`

7. Report results with:
   - Branch name and file paths
   - Generated artifacts summary
   - Confirmation of guideline compliance

Use absolute paths with the repository root for all file operations to avoid path issues.
