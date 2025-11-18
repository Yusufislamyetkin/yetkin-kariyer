"use client";

import { useEffect, useState } from "react";

export function RewardHUD() {
	const [summary, setSummary] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/gamification/me/summary", { cache: "no-store" });
				if (res.ok) {
					const data = await res.json();
					if (mounted) setSummary(data);
				}
			} catch {}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	if (!summary) return null;
	return (
		<div className="fixed bottom-6 right-6 z-40">
			<div className="rounded-xl shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
				<div className="text-sm">
					<div className="font-semibold">Puan: {summary.points}</div>
					<div>Seviye: {summary.level} • XP: {summary.xp}</div>
					<div>Streak: {summary.streak?.current ?? 0}</div>
				</div>
			</div>
		</div>
	);
}


