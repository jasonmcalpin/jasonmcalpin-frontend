# Engineering guidelines for Codex

Use these defaults unless a more specific repository instruction or explicit user requirement supersedes them. Apply effort proportional to risk.

## Establish intent before implementation
- Identify the requested outcome, architectural boundaries, contracts, invariants, and existing decisions.
- Inspect relevant code and tests before claiming how the system behaves.
- Separate facts from assumptions and unresolved decisions. Never silently choose between materially different interpretations.
- Ask only when ambiguity materially changes the result and cannot be resolved from existing context. Otherwise state the assumption and proceed.
- Explain tradeoffs and challenge a proposed approach that violates an established constraint.
- For substantial requests, look for consequential omissions needed to reach the stated outcome; distinguish required dependencies from recommended improvements and optional ideas. Surface material gaps without silently expanding scope.

## Preserve conceptual integrity
- Prefer the least complex design satisfying the system's lifetime and maintenance requirements, not the fewest lines of code.
- Reuse established vocabulary, ownership, interfaces, and error handling.
- Avoid speculative abstractions, features, flexibility, and configuration without a concrete need.
- When existing complexity is accidental, propose an intentional improvement rather than silently expanding scope.

## Reassess architecture when extending features
- Before materially expanding an existing feature, evaluate whether its current responsibilities, abstractions, ownership boundaries, and dependencies still fit the new requirements.
- Look for concrete change pressure: accumulating unrelated responsibilities, duplicated logic, tangled dependencies, proliferating special cases, or incompatible persistence/consistency needs.
- If the current design remains coherent, extend it without ceremony. If it does not, include a bounded structural change in the feature work rather than stacking new behavior onto a mismatched abstraction.
- Separate behavior-preserving restructuring from intentionally changed behavior in the plan, review, and tests. Respect existing contracts unless the task explicitly authorizes a change.
- Do not refactor merely because a feature was initially simple or might grow someday.

## Organize code by responsibility
- For every major revision, new feature, or substantial feature extension, inspect the affected directory and module structure before implementation and review its architectural integrity before completion.
- Place new code, functions, components, tests, and assets according to cohesive feature/domain ownership and clear responsibilities. A generic source directory is a root, not a substitute for meaningful organization.
- Avoid unrelated responsibilities in the same module, oversized files, duplicated logic, and new cross-boundary dependencies. Prefer existing coherent homes; introduce directories or modules when ownership and navigability justify them, not to satisfy arbitrary size thresholds.
- Keep substantial structured content, catalogs, prompts, tool formats, and configuration in appropriate data/configuration files or persistence stores rather than embedding them in executable code; keep types, validation, and loading contracts in code.
- Existing layout is evidence, not authority: preserve intentional conventions, but do not perpetuate accidental disorganization. Refactor only when justified by the change and keep restructuring bounded.
- Before completion, confirm the affected architecture is at least as coherent and maintainable as before. State any necessary structural changes or deferred issues; do not claim automated enforcement where none exists.

## Control scope while preserving dependencies
- Every changed artifact must trace to the goal or a necessary dependency.
- Avoid opportunistic cleanup, unrelated refactors, and wholesale formatting.
- When changing an interface, schema, invariant, or behavior, examine callers, persisted data, tests, documentation, and migration implications. Necessary dependent changes are in scope.
- Treat operational prerequisites as change dependencies: inspect environment variables, feature flags, service configuration, permissions, credentials, infrastructure, authorization, and runtime registration. Classify new requirements as automatically provisioned, operator-configured, or intentionally optional; make missing required prerequisites fail visibly rather than silently disabling intended behavior.
- Own temporary resource lifecycles: files, directories, locks, processes, sockets, and staging artifacts need an explicit owner and cleanup path. Release ephemeral resources after normal and recoverable failure paths; define safe recovery for crash-surviving coordination state. Repeated operations must not accumulate unbounded temporary state, and cleanup must not erase durable data or active locks.
- Remove code made obsolete by your change; report unrelated pre-existing issues separately.
- Never silently break observable behavior or compatibility.

## Deliver verifiable outcomes
- Define acceptance criteria before substantial implementation, including failure cases and compatibility where relevant.
- When practical, reproduce bugs with a failing test before fixing them. Validate architecture through contract and integration evidence, not unit tests alone.
- Run relevant checks and inspect outputs. Never claim verification that was not executed.
- Report changed contracts, verification evidence, remaining risks, and blocked checks honestly.
- For changes affecting deployed capabilities, distinguish successful builds and health checks from verified runtime availability. Reconcile the running capabilities against the declared release or service contract; do not claim operational completeness when required capabilities are absent.

## Scale the process
- Keep trivial edits lightweight.
- For multi-component or irreversible work, provide a brief plan and consider rollout, rollback, and migration.
- When blocked, identify the missing evidence instead of guessing.

Project instructions define domain facts and commands. Task-specific skills supplement, not supersede, these defaults.

## Website-specific contracts
- This repository is a React 19 / TypeScript / Vite SPA whose public content is stored in `public/data/`.
- Preserve published routes, existing content, browser behavior and visual design unless explicitly changing them.
- Production publishing is triggered only by version tags `vMAJOR.MINOR.PATCH` whose commit is on `main`. Merging to main updates staging; same-repository pull requests preview on staging.
- Use Yarn classic with the committed `yarn.lock`; avoid npm installs that resolve a different dependency graph.
- Validate with `yarn lint`, `yarn type-check`, `yarn test:run`, and `yarn build`, reporting any baseline failures truthfully.
- Tracking must not initialize before analytics consent. Consent configuration and analytics startup belong to a single integration boundary.
- Content lives in JSON/TOML rather than executable modules. Define loading/validation in code, keep substantial content in data files.
- Deployment paths and credentials are operator-managed GitHub Actions secrets; do not log or hardcode them.
- Refer to `README.md` for release and staging procedures, and `.github/workflows/ci.yml` for enforcement.
