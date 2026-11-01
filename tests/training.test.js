const { test } = require('node:test');
const assert = require('node:assert/strict');
const Training = require('../training');

test('training merges preserve newer edits and archive markers', () => {
  const old = { briefings: [{ id: 'b', title: 'Old', updatedAt: '2026-10-01T00:00:00Z' }] };
  const recent = { briefings: [{ id: 'b', title: 'Updated', archived: true, updatedAt: '2026-11-01T00:00:00Z' }], assignments: [{ id: 'a', assignees: ['staff'], questionLimit: 10 }] };
  assert.equal(Training.merge(recent, old).briefings[0].archived, true);
  assert.equal(Training.merge(old, recent).briefings[0].title, 'Updated');
  assert.equal(Training.merge(old, recent).assignments[0].questionLimit, 10);
  assert.equal(Training.normalize().settings.timeZone, 'America/Los_Angeles');
});

test('answer history keeps multi-select responses and is omitted from menu summaries', () => {
  const questions = Training.normalizeQuestions([{ prompt: 'Select allergies', topic: 'allergies', options: [{ value: 'egg', label: 'Egg' }, { value: 'soy', label: 'Soy' }], answers: ['egg', 'soy'], selected: ['egg'], correct: false }]);
  assert.deepEqual(questions[0].answers, ['egg', 'soy']);
  assert.deepEqual(questions[0].selected, ['egg']);
  assert.deepEqual(Training.scoreTopics(questions).allergies, { correct: 0, total: 1 });
  assert.equal('questions' in Training.compactResult({ id: 'q', questions }), false);
});

const attempt = (id, percent = 80, more = {}) => ({ id, menuId: 'menu', userKey: 'account:staff', takerUsername: 'staff', percent, score: percent / 20, total: 5, questionLimit: 5, takenAt: '2026-11-01T20:00:00Z', ...more });
test('leaderboard rewards only the best completed account quiz per menu per day', () => {
  const rows = Training.leaderboard([attempt('a'), attempt('b', 100), attempt('c', 60), attempt('guest', 100, { takerUsername: '', userKey: 'guest:a' }), attempt('partial', 100, { total: 2 })], 'America/Los_Angeles');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].points, 120);
  assert.equal(rows[0].sessions, 1);
});

test('assignment pass and overdue status are tied to assignee and assignment id', () => {
  const assignment = { id: 'a', dueDate: '2026-10-31', passPercent: 80 };
  assert.equal(Training.assignmentStatus(assignment, [], 'staff', '2026-11-01').label, 'Overdue');
  assert.equal(Training.assignmentStatus(assignment, [attempt('quiz', 100, { assignmentId: 'a' })], 'staff', '2026-11-01').passed, true);
  assert.equal(Training.assignmentStatus(assignment, [attempt('quiz', 100, { assignmentId: 'other' })], 'staff', '2026-11-01').passed, false);
});

test('daily challenges are deterministic and timezone dates survive DST boundaries', () => {
  const menu = { id: 'm', items: [{ id: 'a', name: 'Garlic prawns', ingredients: ['Garlic', 'Prawns'], allergens: ['Shellfish'] }, { id: 'b', name: 'Egg noodles', ingredients: ['Noodles'], allergens: ['Egg', 'Gluten'] }] };
  const first = Training.dailyQuestions(menu, '2026-11-01');
  assert.deepEqual(first, Training.dailyQuestions(menu, '2026-11-01'));
  assert.equal(first.length, 5);
  assert.ok(first.every(q => q.options.some(o => o.value === q.answers[0])));
  assert.equal(Training.dayKey('2026-11-01T06:00:00Z', 'America/Los_Angeles'), '2026-10-31');
  assert.equal(Training.dayKey('2026-11-01T10:00:00Z', 'America/Los_Angeles'), '2026-11-01');
  assert.deepEqual(Training.dailyQuestions({ id: 'empty', items: [] }, '2026-11-01'), []);
});

test('badges use distinct consecutive days, not repeat attempts in a single day', () => {
  const repeated = Array.from({ length: 5 }, (_, i) => attempt(String(i), 100));
  assert.equal(Training.badges(repeated, 'account:staff', 'UTC').find(b => b.title === 'Three-day rhythm').earned, false);
  const days = [1, 2, 3].map(i => attempt(String(i), 100, { takenAt: `2026-11-0${i}T12:00:00Z` }));
  assert.equal(Training.badges(days, 'account:staff', 'UTC').find(b => b.title === 'Three-day rhythm').earned, true);
});
