-- Aura · a third way of knowing
--
-- 'observed': a coach was present and watched, without checking it against the
-- written standard. It ranks above self-reported and below coach-verified.
-- A new enum value cannot be used in the transaction that adds it, so this
-- lives in its own migration.

alter type public.evidence_tier add value if not exists 'observed' before 'coach';
