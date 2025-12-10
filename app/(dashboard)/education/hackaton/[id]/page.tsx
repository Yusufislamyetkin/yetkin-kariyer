/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  GitBranch,
  Link2,
  Loader2,
  Trophy,
  Users,
  Send,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

type HackathonPhase =
  | "draft"
  | "upcoming"
  | "applications"
  | "submission"
  | "judging"
  | "completed"
  | "archived";

type HackathonApplicationStatus =
  | "pending_review"
  | "auto_accepted"
  | "approved"
  | "waitlisted"
  | "rejected"
  | "withdrawn";

type HackathonTeamRole = "leader" | "co_leader" | "member";

type HackathonTeamMemberStatus = "invited" | "active" | "left" | "removed";

type HackathonSubmissionStatus =
  | "pending"
  | "valid"
  | "late"
  | "disqualified"
  | "under_review"
  | "finalist"
  | "winner";

type FriendshipStatus = "pending" | "accepted" | "declined" | "blocked";

interface FriendEntry {
  id: string;
  status: FriendshipStatus;
  direction: "incoming" | "outgoing";
  counterpart: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
}

interface HackathonLifecycle {
  derivedPhase: HackathonPhase;
  isApplicationWindowOpen: boolean;
  isSubmissionWindowOpen: boolean;
  isJudgingWindowOpen: boolean;
}

interface HackathonData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  visibility: string;
  phase: HackathonPhase;
  lifecycle: HackathonLifecycle;
  timezone: string;
  applicationOpensAt: string;
  applicationClosesAt: string;
  submissionOpensAt: string;
  submissionClosesAt: string;
  judgingOpensAt: string | null;
  judgingClosesAt: string | null;
  maxParticipants: number | null;
  minTeamSize: number | null;
  maxTeamSize: number | null;
  tags: string[];
  requirements: Record<string, unknown> | null;
  prizesSummary: string | null;
  organizer: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  counts: {
    applications: number;
    submissions: number;
    teams: number;
  };
}

interface TeamMember {
  id: string;
  userId: string;
  role: HackathonTeamRole;
  status: HackathonTeamMemberStatus;
  joinedAt: string;
  invitedById: string | null;
  user: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
}

interface TeamSummary {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
  lockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  submission: {
    id: string;
    status: HackathonSubmissionStatus;
    repoUrl: string;
    branch: string;
    commitSha: string | null;
    submittedAt: string;
    attempt: {
      id: string;
      metrics: Record<string, unknown> | null;
      completedAt: string | null;
    } | null;
  } | null;
}

interface SoloSubmission {
  id: string;
  status: HackathonSubmissionStatus;
  repoUrl: string;
  branch: string;
  commitSha: string | null;
  submittedAt: string;
  user: {
    id: string;
    name: string | null;
    profileImage: string | null;
  } | null;
  attempt: {
    id: string;
    metrics: Record<string, unknown> | null;
    completedAt: string | null;
  } | null;
}

interface UserContext {
  application: {
    id: string;
    status: HackathonApplicationStatus;
    teamId: string | null;
    appliedAt: string;
    reviewedAt: string | null;
  } | null;
  team: {
    id: string;
    name: string;
    role: HackathonTeamRole;
    status: HackathonTeamMemberStatus;
  } | null;
  submission: {
    id: string;
    status: HackathonSubmissionStatus;
    submittedAt: string;
  } | null;
  permissions: {
    canApply: boolean;
    canSubmit: boolean;
  };
  pendingInvitations: Array<{
    id: string;
    teamId: string;
    teamName: string;
    invitedById: string | null;
  }>;
}

interface HackathonDetailResponse {
  hackathon: HackathonData;
  teams: TeamSummary[];
  soloSubmissions: SoloSubmission[];
  userContext: UserContext;
}

interface UserSubmissionDetail {
  id: string;
  repoUrl: string;
  branch: string;
  commitSha: string | null;
  title: string | null;
  summary: string | null;
  presentationUrl: string | null;
  demoUrl: string | null;
  status: HackathonSubmissionStatus;
}

interface ApplicantsData {
  solo: Array<{
    id: string;
    user: { id: string; name: string | null; profileImage: string | null };
    appliedAt: string;
  }>;
  teams: Array<{
    id: string;
    name: string;
    members: Array<{ id: string; name: string | null; profileImage: string | null }>;
    appliedAt: string;
  }>;
}

const formatDate = (value: string | null) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd MMM yyyy HH:mm", { locale: tr });
  } catch {
    return "-";
  }
};

const formatCountdown = (value: string | null) => {
  if (!value) return "-";
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true, locale: tr });
  } catch {
    return "-";
  }
};

const PHASE_BADGE_STYLES: Record<HackathonPhase, string> = {
  draft: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  applications: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  submission: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  judging: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400",
};

const phaseLabel = (phase: HackathonPhase) =>
  ({
    draft: "Taslak",
    upcoming: "Yaklaşan",
    applications: "Başvuru Sürecinde",
    submission: "Proje Teslimi",
    judging: "Değerlendirme",
    completed: "Sonuçlandı",
    archived: "Arşivlendi",
  }[phase] ?? phase);

const applicationStatusLabel = (status: HackathonApplicationStatus) =>
  ({
    pending_review: "Onay Bekliyor",
    auto_accepted: "Otomatik Onaylandı",
    approved: "Onaylandı",
    waitlisted: "Yedek Listede",
    rejected: "Reddedildi",
    withdrawn: "Geri Çekildi",
  }[status] ?? status);

export default function HackatonDetailPage() {
  const params = useParams();
  const resolvedHackathonId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [detail, setDetail] = useState<HackathonDetailResponse | null>(null);
  const [userSubmission, setUserSubmission] = useState<UserSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyMode, setApplyMode] = useState<"solo" | "create" | "join">("solo");
  const [applyMotivation, setApplyMotivation] = useState("");
  const [applySkills, setApplySkills] = useState("");
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [applySubmitting, setApplySubmitting] = useState(false);

  const [submissionForm, setSubmissionForm] = useState({
    repoUrl: "",
    branch: "main",
    commitSha: "",
    title: "",
    summary: "",
    presentationUrl: "",
    demoUrl: "",
  });
  const [submissionSubmitting, setSubmissionSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [invitingFriendId, setInvitingFriendId] = useState<string | null>(null);
  const [respondingTeamInviteId, setRespondingTeamInviteId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<ApplicantsData | null>(null);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const loadSubmission = async (hackathonId: string) => {
    try {
      setSubLoading(true);
      const response = await fetch(`/api/hackathons/${hackathonId}/submissions`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (data.submission) {
        setUserSubmission(data.submission);
        setSubmissionForm({
          repoUrl: data.submission.repoUrl ?? "",
          branch: data.submission.branch ?? "main",
          commitSha: data.submission.commitSha ?? "",
          title: data.submission.title ?? "",
          summary: data.submission.summary ?? "",
          presentationUrl: data.submission.presentationUrl ?? "",
          demoUrl: data.submission.demoUrl ?? "",
        });
      } else {
        setUserSubmission(null);
      }
    } catch (err) {
      console.error("Error loading submission", err);
    } finally {
      setSubLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      setFriendsLoading(true);
      const response = await fetch("/api/friends");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setFriends(data.friendships ?? []);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setFriendsLoading(false);
    }
  };

  const loadApplicants = async (hackathonId: string) => {
    try {
      setApplicantsLoading(true);
      const response = await fetch(`/api/hackathons/${hackathonId}/applicants`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setApplicants(data);
    } catch (err) {
      console.error("Error loading applicants:", err);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const loadDetail = async (hackathonId: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`/api/hackathons/${hackathonId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Hackathon bilgileri alınamadı.");
      }
      const data: HackathonDetailResponse = await response.json();
      setDetail(data);
      await loadSubmission(hackathonId);
    } catch (err) {
      console.error("Error fetching hackathon detail:", err);
      setError((err as Error).message || "Hackathon bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resolvedHackathonId) return;
    loadDetail(resolvedHackathonId);
  }, [resolvedHackathonId]);

  useEffect(() => {
    if (!detail) return;
    loadFriends();
    loadApplicants(detail.hackathon.id);
  }, [detail?.hackathon.id]);

  const showFeedback = (message: string, type: "success" | "error") => {
    setFeedback(message);
    setFeedbackType(type);
    window.setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
    }, 4000);
  };

  const handleApplySubmit = async () => {
    if (!detail) return;
    setApplySubmitting(true);
    setFeedback(null);
    setFeedbackType(null);

    try {
      const payload: Record<string, unknown> = {
        motivation: applyMotivation.trim() || undefined,
        skills: applySkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      payload.team = {
        mode: applyMode,
        name: applyMode === "create" ? teamName.trim() : undefined,
        inviteCode: applyMode === "join" ? joinCode.trim() : undefined,
      };

      const response = await fetch(`/api/hackathons/${detail.hackathon.id}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Başvurunuz kaydedilemedi.");
      }

      showFeedback("Başvurunuz başarıyla kaydedildi.", "success");
      setApplyOpen(false);
      setApplyMotivation("");
      setApplySkills("");
      setTeamName("");
      setJoinCode("");
      await loadDetail(detail.hackathon.id);
    } catch (err) {
      console.error("Error submitting application:", err);
      showFeedback(
        (err as Error).message || "Başvuru sırasında bir hata oluştu. Lütfen yeniden deneyin.",
        "error"
      );
    } finally {
      setApplySubmitting(false);
    }
  };

  const handleSubmissionSubmit = async () => {
    if (!detail) return;
    if (!submissionForm.repoUrl.trim()) {
      showFeedback("Lütfen projenizin deposunun bağlantısını ekleyin.", "error");
      return;
    }

    setSubmissionSubmitting(true);
    showFeedback("", "success");

    try {
      const response = await fetch(`/api/hackathons/${detail.hackathon.id}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: submissionForm.repoUrl.trim(),
          branch: submissionForm.branch.trim() || "main",
          commitSha: submissionForm.commitSha.trim() || undefined,
          title: submissionForm.title.trim() || undefined,
          summary: submissionForm.summary.trim() || undefined,
          presentationUrl: submissionForm.presentationUrl.trim() || undefined,
          demoUrl: submissionForm.demoUrl.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Proje gönderimi sırasında hata oluştu.");
      }

      showFeedback("Proje bağlantınız kaydedildi.", "success");
      await loadDetail(detail.hackathon.id);
    } catch (err) {
      console.error("Error submitting project:", err);
      showFeedback(
        (err as Error).message ||
          "Projeyi gönderirken bir sorun yaşandı. Lütfen kısa süre sonra tekrar deneyin.",
        "error"
      );
    } finally {
      setSubmissionSubmitting(false);
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        window.setTimeout(() => setCopiedCode(null), 2500);
      })
      .catch((err) => console.error("Failed to copy invite code:", err));
  };

  const userTeam = detail?.teams.find((team) => team.id === detail?.userContext.team?.id);
  const isTeamLeader =
    detail?.userContext.team?.role === "leader" || detail?.userContext.team?.role === "co_leader";

  const acceptedFriends = useMemo(
    () => friends.filter((friend) => friend.status === "accepted"),
    [friends]
  );

  const availableFriendsToInvite = useMemo(() => {
    if (!userTeam || !isTeamLeader) return [];
    const memberIds = new Set(userTeam.members.map((member) => member.userId));
    return acceptedFriends.filter((friend) => !memberIds.has(friend.counterpart.id));
  }, [acceptedFriends, userTeam, isTeamLeader]);

  const handleInviteFriend = async (friendUserId: string) => {
    if (!detail || !userTeam) return;
    setInvitingFriendId(friendUserId);
    try {
      const response = await fetch(
        `/api/hackathons/${detail.hackathon.id}/teams/${userTeam.id}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendUserId }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Arkadaş davet edilirken hata oluştu.");
      }
      showFeedback(data?.message || "Arkadaşına davet gönderildi.", "success");
      await loadDetail(detail.hackathon.id);
      await loadFriends();
    } catch (err) {
      console.error("Error inviting friend:", err);
      showFeedback(
        (err as Error).message || "Davet gönderilirken bir sorun oluştu.",
        "error"
      );
    } finally {
      setInvitingFriendId(null);
    }
  };

  const handleTeamInviteResponse = async (inviteId: string, action: "accept" | "decline") => {
    if (!detail) return;
    setRespondingTeamInviteId(inviteId);
    try {
      const response = await fetch(`/api/hackathons/${detail.hackathon.id}/teams/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Davet yanıtı gönderilemedi.");
      }
      showFeedback(
        data?.invitation
          ? "Takım daveti güncellendi."
          : action === "accept"
          ? "Takıma katıldın!"
          : "Davet reddedildi.",
        "success"
      );
      await loadDetail(detail.hackathon.id);
    } catch (err) {
      console.error("Error responding to team invite:", err);
      showFeedback(
        (err as Error).message || "Davet yanıtlanırken bir hata oluştu.",
        "error"
      );
    } finally {
      setRespondingTeamInviteId(null);
    }
  };

  const activeTeams = useMemo(
    () =>
      detail?.teams.map((team) => ({
        ...team,
        activeMembers: team.members.filter((member) => member.status === "active"),
      })) ?? [],
    [detail?.teams]
  );
  const hasSubmissionWindowClosed = useMemo(() => {
    if (!detail?.hackathon.submissionClosesAt) {
      return false;
    }
    const closeDate = new Date(detail.hackathon.submissionClosesAt);
    if (Number.isNaN(closeDate.getTime())) {
      return false;
    }
    return closeDate <= new Date();
  }, [detail?.hackathon.submissionClosesAt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Hackathon yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="elevated" className="max-w-lg p-8 text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Hackathon bulunamadı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Aradığınız hackathon kaydına erişilemiyor. Lütfen daha sonra tekrar deneyin."}
          </p>
          <Link href="/education/hackaton">
            <Button variant="gradient">Hackathon listesine dön</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const previewTeams = activeTeams.slice(0, 3);
  const previewSolo = detail?.soloSubmissions.slice(0, 3) ?? [];
  const hasMoreTeams = activeTeams.length > previewTeams.length;
  const hasMoreSolo = (detail?.soloSubmissions.length ?? 0) > previewSolo.length;

  return (
    <div className="animate-fade-in mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/education/hackaton">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Listeye dön
          </Button>
        </Link>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${PHASE_BADGE_STYLES[detail.hackathon.lifecycle.derivedPhase]}`}
        >
          {phaseLabel(detail.hackathon.lifecycle.derivedPhase)}
        </span>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-tr from-amber-600 via-orange-500 to-pink-500 px-6 py-8 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white/20 p-3 shadow-xl backdrop-blur-sm">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold md:text-3xl">{detail.hackathon.title}</h1>
                {detail.hackathon.description && (
                  <div className="mt-2 max-w-2xl space-y-2">
                    {detail.hackathon.description
                      .split('\n\n')
                      .filter(paragraph => paragraph.trim().length > 0)
                      .map((paragraph, index) => (
                        <p key={index} className="text-sm text-white/80">
                          {paragraph.trim()}
                        </p>
                      ))}
                  </div>
                )}
                <p className="mt-4 text-xs uppercase tracking-wide text-white/70">
                  Zaman Dilimi: {detail.hackathon.timezone}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm backdrop-blur-sm">
              <p className="font-semibold">Organizatör</p>
              <p className="text-white/80">
                {detail.hackathon.organizer?.name ?? "Bilgi bulunmuyor"}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
                <span>{detail.hackathon.counts.teams} takım</span>
                <span>•</span>
                <span>{detail.hackathon.counts.applications} başvuru</span>
                <span>•</span>
                <span>{detail.hackathon.counts.submissions} proje</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="grid gap-6 p-6 md:grid-cols-4">
          <div className="md:col-span-2 flex items-start gap-3 rounded-lg border border-dashed border-blue-200/70 p-4 dark:border-blue-500/20">
            <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Başvuru</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(detail.hackathon.applicationOpensAt)} —{" "}
                {formatDate(detail.hackathon.applicationClosesAt)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCountdown(detail.hackathon.applicationClosesAt)}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-3 rounded-lg border border-dashed border-amber-200/70 p-4 dark:border-amber-500/20">
            <CalendarClock className="mt-1 h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Proje Teslimi</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(detail.hackathon.submissionOpensAt)} —{" "}
                {formatDate(detail.hackathon.submissionClosesAt)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCountdown(detail.hackathon.submissionClosesAt)}
              </p>
            </div>
          </div>

          {detail.hackathon.prizesSummary && (
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-amber-100 to-white p-6 text-sm shadow-inner md:col-span-4 dark:border-amber-500/40 dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent">
              <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/40" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-500 p-3 text-white shadow-lg shadow-amber-300/40">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                      Ödül Havuzu
                    </p>
                    <p className="text-base font-semibold leading-snug text-amber-900 dark:text-amber-50">
                      {detail.hackathon.prizesSummary}
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-amber-400/40 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-widest text-amber-700 shadow-sm backdrop-blur-sm dark:border-amber-400/50 dark:bg-amber-500/20 dark:text-amber-100">
                  Kazananları Bekliyor
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {feedback && feedbackType && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
            feedbackType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
          }`}
        >
          {feedbackType === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Katılım Durumu</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Başvuru sürecinizi yönetin, takımınızı kurun ve arkadaşlarınızı davet edin.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail.userContext.application ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                  <p>
                    Başvuru durumunuz:{" "}
                    <span className="font-semibold">
                      {applicationStatusLabel(detail.userContext.application.status)}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-emerald-700/70 dark:text-emerald-200/70">
                    Başvuru tarihi: {formatDate(detail.userContext.application.appliedAt)}
                  </p>
                </div>
              ) : detail.userContext.permissions.canApply ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  Henüz bu hackathona başvurmadınız. Takımınızı oluşturmak veya solo katılmak
                  için başvuru formunu doldurun.
                </div>
              ) : (
                <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                  Başvuru pencersi kapandı veya kontenjan doldu. Artık başvuru yapamazsınız.
                </div>
              )}

              {detail.userContext.permissions.canApply && (
                <div className="rounded-xl border border-dashed border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Başvurunu hemen tamamla
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Solo katılım ya da takım kurarak hackathona dahil ol. Takım kurma aşamasında
                    arkadaşlarını davet edebilirsin.
                  </p>
                  <div className="mt-4">
                    {applyOpen ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={applyMode === "solo" ? "gradient" : "outline"}
                            onClick={() => setApplyMode("solo")}
                          >
                            Solo katılım
                          </Button>
                          <Button
                            size="sm"
                            variant={applyMode === "create" ? "gradient" : "outline"}
                            onClick={() => setApplyMode("create")}
                          >
                            Takım oluştur
                          </Button>
                          <Button
                            size="sm"
                            variant={applyMode === "join" ? "gradient" : "outline"}
                            onClick={() => setApplyMode("join")}
                          >
                            Takıma katıl
                          </Button>
                        </div>

                        {applyMode === "create" && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                              Takım adı
                            </label>
                            <Input
                              value={teamName}
                              onChange={(event) => setTeamName(event.target.value)}
                              placeholder="Örn. Gece Kodlayanlar"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Takımı oluşturduktan sonra arkadaşlarını davet edebilirsin.
                            </p>
                          </div>
                        )}

                        {applyMode === "join" && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                              Davet kodu
                            </label>
                            <Input
                              value={joinCode}
                              onChange={(event) => setJoinCode(event.target.value)}
                              placeholder="Takım davet kodunu girin"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Katılma motivasyonun (opsiyonel)
                          </label>
                          <textarea
                            value={applyMotivation}
                            onChange={(event) => setApplyMotivation(event.target.value)}
                            className="min-h-[90px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-amber-400 dark:focus:ring-amber-500/20"
                            placeholder="Bu hackathona neden katılmak istiyorsun?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Teknik yetkinliklerin (virgülle ayır)
                          </label>
                          <Input
                            value={applySkills}
                            onChange={(event) => setApplySkills(event.target.value)}
                            placeholder="React, Node.js, UI/UX"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="gradient"
                            disabled={
                              applySubmitting ||
                              (applyMode === "create" && !teamName.trim()) ||
                              (applyMode === "join" && !joinCode.trim())
                            }
                            onClick={handleApplySubmit}
                          >
                            {applySubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gönderiliyor
                              </>
                            ) : (
                              "Başvuruyu Gönder"
                            )}
                          </Button>
                          <Button variant="ghost" onClick={() => setApplyOpen(false)}>
                            Vazgeç
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setApplyOpen(true)} variant="gradient">
                        Başvuru formunu aç
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {detail.userContext.pendingInvitations.length > 0 && (
                <div className="space-y-3 rounded-xl border border-blue-200/70 bg-blue-50/70 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
                  <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                    Seni takımlarına davet eden arkadaşların var
                  </h3>
                  {detail.userContext.pendingInvitations.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100"
                    >
                      <div>
                        <p className="font-semibold">{invite.teamName}</p>
                        <p className="text-xs text-blue-600/80 dark:text-blue-200/80">
                          Davet kodu ile katılabilir veya burada onaylayabilirsin.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="gradient"
                          disabled={respondingTeamInviteId === invite.id}
                          onClick={() => handleTeamInviteResponse(invite.id, "accept")}
                        >
                          Katıl
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={respondingTeamInviteId === invite.id}
                          onClick={() => handleTeamInviteResponse(invite.id, "decline")}
                        >
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {userTeam && (
                <div className="space-y-4 rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Takımın: {userTeam.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Rolün: {detail.userContext.team?.role === "leader"
                          ? "Takım Lideri"
                          : detail.userContext.team?.role === "co_leader"
                          ? "Yardımcı Lider"
                          : "Üye"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-200">
                        {userTeam.members.filter((member) => member.status === "active").length}/
                        {detail.hackathon.maxTeamSize ?? "∞"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    {userTeam.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                          member.status === "active"
                            ? "border-blue-200 bg-white/70 dark:border-blue-500/30 dark:bg-blue-500/5"
                            : "border-gray-200 bg-white/40 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {member.user?.name ?? "İsimsiz Kullanıcı"}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          {member.role === "leader"
                            ? "Lider"
                            : member.role === "co_leader"
                            ? "Yardımcı"
                            : member.status === "invited"
                            ? "Davet Edildi"
                            : "Üye"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-dashed border-blue-300 p-3 text-xs text-blue-700 dark:border-blue-500/40 dark:text-blue-200">
                    <p className="font-semibold mb-2">Takım davet kodu</p>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-white/70 px-2 py-1 text-sm font-semibold tracking-widest text-blue-700 dark:bg-blue-500/10 dark:text-blue-100">
                        {userTeam.inviteCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyInviteCode(userTeam.inviteCode)}
                        aria-label="Davet kodunu kopyala"
                      >
                        {copiedCode === userTeam.inviteCode ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="mt-2">Arkadaşların bu kodu kullanarak takıma katılabilir.</p>
                  </div>

                  {isTeamLeader && (
                    <div className="rounded-xl border border-dashed border-gray-300/80 p-4 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Arkadaşlarını davet et
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Arkadaş listenizdeki kullanıcıları bir tıkla takıma ekleyebilirsin.
                      </p>
                      <div className="mt-3 space-y-2">
                        {friendsLoading ? (
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Arkadaşların yükleniyor...
                          </div>
                        ) : availableFriendsToInvite.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400">
                            Davet edilebilir arkadaş bulunamadı. Önce arkadaş ekleyebilir veya
                            mevcut davetleri bekleyebilirsin.
                          </div>
                        ) : (
                          availableFriendsToInvite.map((friend) => (
                            <div
                              key={friend.counterpart.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-900"
                            >
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                  {friend.counterpart.name ?? "İsimsiz Kullanıcı"}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {friend.counterpart.id}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInviteFriend(friend.counterpart.id)}
                                disabled={invitingFriendId === friend.counterpart.id}
                              >
                                {invitingFriendId === friend.counterpart.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  "Davet et"
                                )}
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50/70 p-3 text-[11px] text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-200">
                        Arkadaş listenizi yönetmek için{" "}
                        <a
                          className="font-semibold underline"
                          href="/dashboard/friends"
                        >
                          arkadaşlar sayfasını
                        </a>{" "}
                        ziyaret edebilirsiniz.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Proje Gönderimi</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submission döneminde GitHub repo bağlantınızı ve isteğe bağlı diğer linkleri
                ekleyin.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail.userContext.permissions.canSubmit ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Repository URL
                    </label>
                    <Input
                      placeholder="https://github.com/takim/ad"
                      value={submissionForm.repoUrl}
                      onChange={(event) =>
                        setSubmissionForm((prev) => ({ ...prev, repoUrl: event.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Branch
                      </label>
                      <Input
                        placeholder="main"
                        value={submissionForm.branch}
                        onChange={(event) =>
                          setSubmissionForm((prev) => ({ ...prev, branch: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Commit SHA (opsiyonel)
                      </label>
                      <Input
                        placeholder="abc123..."
                        value={submissionForm.commitSha}
                        onChange={(event) =>
                          setSubmissionForm((prev) => ({ ...prev, commitSha: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Sunum linki (opsiyonel)
                      </label>
                      <Input
                        placeholder="https://docs.google.com/..."
                        value={submissionForm.presentationUrl}
                        onChange={(event) =>
                          setSubmissionForm((prev) => ({
                            ...prev,
                            presentationUrl: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Demo linki (opsiyonel)
                      </label>
                      <Input
                        placeholder="https://demo.com"
                        value={submissionForm.demoUrl}
                        onChange={(event) =>
                          setSubmissionForm((prev) => ({ ...prev, demoUrl: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Proje başlığı (opsiyonel)
                    </label>
                    <Input
                      placeholder="Projeniz için kısa bir başlık"
                      value={submissionForm.title}
                      onChange={(event) =>
                        setSubmissionForm((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Proje özeti (opsiyonel)
                    </label>
                    <textarea
                      placeholder="Projenizin kısa bir özeti..."
                      value={submissionForm.summary}
                      onChange={(event) =>
                        setSubmissionForm((prev) => ({ ...prev, summary: event.target.value }))
                      }
                      className="min-h-[90px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                    />
                  </div>
                  <Button
                    variant="gradient"
                    className="w-full"
                    disabled={submissionSubmitting}
                    onClick={handleSubmissionSubmit}
                  >
                    {submissionSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Proje Bağlantısını Kaydet
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  Proje gönderimi şu an için aktif değil. Submission dönemi başladığında
                  GitHub bağlantınızı ekleyebilirsiniz.
                </div>
              )}

              {userSubmission && (
                <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                  <p className="font-semibold">Gönderilen proje:</p>
                  <a
                    href={userSubmission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-2 text-xs underline"
                  >
                    <GitBranch className="h-4 w-4" />
                    {userSubmission.repoUrl}
                  </a>
                  <p className="mt-2 text-xs text-emerald-600/80 dark:text-emerald-200/80">
                    Durum: {userSubmission.status}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Takım ve Katılımcılar</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hackathona katılan tüm takımlar ve solo katılımcılar.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTeams.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  Henüz takım oluşturulmamış. İlk takımı sen kurabilirsin!
                </div>
              ) : (
                previewTeams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {team.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {team.activeMembers.length} aktif üye
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(team.createdAt)}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                            member.status === "active"
                              ? "border-blue-200 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/10"
                              : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                          }`}
                        >
                          <span>{member.user?.name ?? "İsimsiz Kullanıcı"}</span>
                          <span className="uppercase tracking-wide">
                            {member.status === "active" ? member.role : "Davet"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {hasMoreTeams && (
              <CardContent className="border-t border-gray-200 dark:border-gray-800 py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  href={`/education/hackaton/${resolvedHackathonId}/teams`}
                >
                  Tüm takımları görüntüle
                </Button>
              </CardContent>
            )}
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Solo Katılımcılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!hasSubmissionWindowClosed && previewSolo.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Proje bağlantıları teslim dönemi sona erdikten sonra herkes tarafından görüntülenir.
                </p>
              )}
              {previewSolo.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Henüz solo katılımcı projesi bulunmuyor.
                </p>
              ) : (
                previewSolo.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{submission.user?.name ?? "İsimsiz"}</span>
                      <span>{formatDate(submission.submittedAt)}</span>
                    </div>
                    {submission.repoUrl ? (
                      <a
                        href={submission.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 flex items-center gap-2 text-xs text-blue-600 underline dark:text-blue-300"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        {submission.repoUrl}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Proje bağlantısı teslim dönemi sona erdiğinde paylaşılacak.
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
            {hasMoreSolo && (
              <CardContent className="border-t border-gray-200 dark:border-gray-800 py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  href={`/education/hackaton/${resolvedHackathonId}/solo-participants`}
                >
                  Tüm solo katılımcıları görüntüle
                </Button>
              </CardContent>
            )}
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Başvuranlar</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hackathona başvuran tüm kullanıcılar ve takımlar.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : !applicants || (applicants.solo.length === 0 && applicants.teams.length === 0) ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  Henüz başvuru yok.
                </div>
              ) : (
                <>
                  {applicants.solo.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Solo Başvuranlar
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {applicants.solo.map((application) => {
                          const initials = application.user.name
                            ? application.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : application.user.id.slice(0, 2).toUpperCase();
                          return (
                            <div
                              key={application.id}
                              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                            >
                              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                {application.user.profileImage ? (
                                  <Image
                                    src={application.user.profileImage}
                                    alt={application.user.name || "Kullanıcı"}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                                    {initials}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {application.user.name || "İsimsiz Kullanıcı"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatCountdown(application.appliedAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {applicants.teams.length > 0 && (
                    <div className="space-y-3">
                      {applicants.solo.length > 0 && (
                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700" />
                      )}
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Takım Başvuranları
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                        {applicants.teams.map((team) => (
                          <div
                            key={team.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                          >
                            <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {team.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {team.members.map((member) => {
                                  const initials = member.name
                                    ? member.name
                                        .split(" ")
                                        .map((n) => n?.[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)
                                    : member.id.slice(0, 2).toUpperCase();
                                  return (
                                    <div
                                      key={member.id}
                                      className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 dark:border-gray-900"
                                      title={member.name || "Üye"}
                                    >
                                      {member.profileImage ? (
                                        <Image
                                          src={member.profileImage}
                                          alt={member.name || "Üye"}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                                          {initials}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="ml-2 flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {team.members.length} üye
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {formatCountdown(team.appliedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

