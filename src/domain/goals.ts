/** The goals an athlete is offered: skills people come for, from the first of each kind to the far ones. Any skill can be a goal later, from the skill tree. */
export const GOALS = [
  'push-first', 'pull-first', 'pull-10', 'hs-free-10', 'hs-free-30', 'pull-mu-1', 'core-lsit-30',
  'legs-pistol-1', 'push-wallhspu-1', 'pull-fl-full-5', 'push-pl-full-5', 'mob-pancake', 'mob-front-split',
]

/** How many at a time: enough to want, few enough to train for. */
export const MAX_GOALS = 3

/** A goal chosen (or kept) and declined, never more than the maximum. */
export const acceptGoal = (goals: string[], id: string) => (goals.includes(id) || goals.length >= MAX_GOALS ? goals : [...goals, id])
export const declineGoal = (goals: string[], id: string) => goals.filter((g) => g !== id)
