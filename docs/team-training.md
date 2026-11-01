# Team Training Release

Implemented the selected feature-list entries: 1, 2, 3, 4, 5, 7, 8, 10, and 12.

## Entry Points

- Open a menu and select Training for the menu's training hub.
- Dashboard > Training provides the same functions with a menu selector.
- Training-capable roles (admin, owner, manager, editor, trainer) get Setup,
  assignment reports, team progress selectors, and reward fulfilment controls.
- Regular account users get their own progress, assigned training, briefings,
  pairing practice, restaurant leaderboards, badges, and rewards.
- Shared-code viewers get their device's progress, daily challenges, briefings,
  acknowledgements, pairing practice, and their own answer reviews. They do not
  receive staff assignment administration, account leaderboards, or rewards.

## Features

1. Detailed quiz review saves the question, options, selected answers, correct
   answers, explanation, topic, and answer time. Correct multi-selection grading
   uses the quiz engine's existing complete-set comparison.
2. New results link to the account username, independently of the displayed name.
   Shared viewers use a persistent device identifier. Older name-only submissions
   are not guessed or automatically assigned to accounts.
3. Assignments include named assignees with menu access, a category, topic,
   question count, due date, and pass percentage. Reports show passed, retry,
   not-started, and overdue statuses. Managers can edit or archive assignments.
4. The daily challenge has five deterministic questions for the menu and date.
   The stored restaurant training time zone defines the date. Item reordering
   does not change the challenge. Recipe changes can change generated questions;
   completed attempts retain their original question snapshots.
5. Restaurant leaderboards combine accessible menus in the same restaurant and
   workspace. Only account-linked completed attempts rank. Only the best quiz
   per person, menu, and date contributes: 20 completion points plus percentage.
   Windows are 7 days, 30 days, or recorded history. Guest names do not rank.
7. Pre-shift briefings support specials, unavailable items, recipe updates, and
   service notes. A blank date applies to all shifts; a selected date applies
   to that date in the training time zone. Managers can edit or archive notes.
8. Required acknowledgements are tied to the briefing revision timestamp. A new
   revision needs a new acknowledgement. Managers can see who acknowledged and
   when, and which current team members have not. Existing menu notifications
   can populate a briefing. The menu's Training button shows pending readings.
10. Computed badges recognize a first completed quiz, five quizzes, a perfect
    score, and three consecutive practice days in recorded history. Managers
    can publish rewards with a 30-day point threshold. Staff request a reward;
    managers mark it fulfilled. This is a recognition workflow, not a payment
    or automatic prize-delivery system. Each person can claim a reward once.
12. Editors enter approved pairing notes and guest recommendations in the item
    form. Those notes display with expanded items and in Training > Pairings.
    Practice questions use approved notes only and require distinct alternatives.
    No wine/cocktail matrix schema or AI-generated pairing advice is introduced.

## Storage And Sync

- `menu.training` stores settings, assignments, briefings, acknowledgement
  records, rewards, and claims. Records merge by id and updated timestamp.
  Archived records remain tombstones to prevent old snapshots restoring them.
- Detailed attempts live separately at
  `menus/{workspace}/trainingAttempts/{attempt}`. Menu/share result lists keep
  compact summaries and topic totals, avoiding question-history duplication
  in the main menu document. The result listener fetches the most recent 150
  detailed attempts for the selected menu, merging those with stored summaries.
- Daily attempt ids are deterministic per menu, date, and participant. A
  transaction retains the first saved daily attempt when devices race.
- Firestore rules require authentication for attempt reads and require the
  authenticated Firebase uid on attempt creation and update. Existing workspace
  menu rules remain unchanged; this release does not redesign project-wide ACLs.
- Assignment/briefing/acknowledgement/reward changes use transactions against
  the latest workspace document; a shared-code write also updates its snapshot.
- A local retry queue retains failed writes. It retries while the app is open,
  on reconnect, on startup, and through Refresh training. It does not run after
  the app/browser closes. The public demo stores attempts locally only.
- Progress and badges are derived from available recorded attempts, not a
  permanent lifetime ledger. Older quiz summaries remain available, but missing
  historical question details cannot be recreated retroactively.

## Deployment And Checks

The new scripts keep app source copies synchronized for web and Capacitor.
Deploy Firestore rules and indexes with the website. The detailed-history
listener falls back to an unordered menu query while a composite index builds.

Tests cover quiz review, account linkage, deterministic challenges, timezone
boundaries, assignment completion, acknowledgement versions, pairing practice,
leaderboard repeat suppression, badges, rewards/fulfilment, and restarting
while a quiz save is delayed. Browser tests use isolated fixtures and a fake
Firestore transaction store; they do not create real staff or change live menus.
