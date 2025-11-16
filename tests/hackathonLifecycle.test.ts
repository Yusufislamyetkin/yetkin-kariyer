import { strict as assert } from "node:assert";
import test from "node:test";

import { HackathonPhase } from "@prisma/client";

import { computeHackathonPhase } from "@/lib/hackathon/lifecycle";

const iso = (offsetHours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + offsetHours);
  return date.toISOString();
};

const baseTimeline = () => ({
  applicationOpensAt: iso(-6),
  applicationClosesAt: iso(6),
  submissionOpensAt: iso(12),
  submissionClosesAt: iso(24),
  judgingOpensAt: iso(30),
  judgingClosesAt: iso(48),
  archivedAt: null as string | null,
});

test("computeHackathonPhase returns upcoming before application window", () => {
  const timeline = baseTimeline();
  timeline.applicationOpensAt = iso(4);
  const result = computeHackathonPhase(timeline);
  assert.equal(result.derivedPhase, HackathonPhase.upcoming);
  assert.equal(result.isApplicationWindowOpen, false);
});

test("computeHackathonPhase detects active application window", () => {
  const timeline = baseTimeline();
  const result = computeHackathonPhase(timeline);
  assert.equal(result.derivedPhase, HackathonPhase.applications);
  assert.equal(result.isApplicationWindowOpen, true);
  assert.equal(result.isSubmissionWindowOpen, false);
});

test("computeHackathonPhase reports submission window", () => {
  const timeline = baseTimeline();
  timeline.applicationOpensAt = iso(-12);
  timeline.applicationClosesAt = iso(-6);
  timeline.submissionOpensAt = iso(-1);
  const result = computeHackathonPhase(timeline);
  assert.equal(result.derivedPhase, HackathonPhase.submission);
  assert.equal(result.isSubmissionWindowOpen, true);
});

test("computeHackathonPhase moves to completed after submission closes", () => {
  const timeline = baseTimeline();
  timeline.applicationOpensAt = iso(-48);
  timeline.applicationClosesAt = iso(-36);
  timeline.submissionOpensAt = iso(-24);
  timeline.submissionClosesAt = iso(-12);
  timeline.judgingOpensAt = iso(-8);
  timeline.judgingClosesAt = iso(-4);
  const result = computeHackathonPhase(timeline);
  assert.equal(result.derivedPhase, HackathonPhase.completed);
});

test("computeHackathonPhase marks archived hackathons", () => {
  const timeline = baseTimeline();
  timeline.archivedAt = iso(-1);
  const result = computeHackathonPhase(timeline);
  assert.equal(result.derivedPhase, HackathonPhase.archived);
});

