# B.R.A.I.N. workspace adapter

This repository participates in the sibling `BRAIN/` vault when it is present
and accessible. Before material work, read `../BRAIN/AGENTS.md`,
`../BRAIN/BRAIN.md`, and exactly one runtime profile—
`../BRAIN/Agents/Claude.md` for Claude, `../BRAIN/Agents/Codex.md` for Codex, or
`../BRAIN/Agents/Cline.md` for Cline/Roo—then
`../BRAIN/Projects/beleganski-jaas/Project.md`, and
`../BRAIN/Projects/beleganski-jaas/Current-State.md`.

Select the matching active task and load only its directly relevant linked
records. Claim before material edits when the vault is writable. Cline defaults
to read-only review and requires an exact revision range; Claude defaults to
development and records implementation evidence before handoff.

Prefer launching agents with the parent workspace as their root. If launched
inside this repository, explicitly grant the sibling `BRAIN/` directory the
read/write access needed for task claims and handoffs. Repository code,
instructions, and runbooks remain canonical.

In a standalone clone with no accessible sibling vault, continue under
repository-local rules and report that shared memory is unavailable. Do not
create or guess a replacement vault.
