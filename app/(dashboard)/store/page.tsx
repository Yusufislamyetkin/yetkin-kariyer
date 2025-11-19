"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export default function StorePage() {
	const [rewards, setRewards] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [redeeming, setRedeeming] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/gamification/store");
				if (!res.ok) throw new Error("Mağaza yüklenemedi");
				const data = await res.json();
				setRewards(data.rewards ?? []);
			} catch (e: any) {
				setError(e?.message ?? "Hata oluştu");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const redeem = async (rewardId: string) => {
		try {
			setRedeeming(rewardId);
			const res = await fetch("/api/gamification/store/redeem", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rewardId }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error ?? "Redeem failed");
			alert("Ödül talebi oluşturuldu!");
		} catch (e: any) {
			alert(e?.message ?? "Hata");
		} finally {
			setRedeeming(null);
		}
	};

	if (loading) return <div className="p-6">Yükleniyor...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Ödül Mağazası</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{rewards.map((r) => (
					<Card key={r.id} className="border">
						<CardHeader>
							<CardTitle>{r.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="text-sm text-gray-600">SKU: {r.sku}</div>
							<div className="text-sm">Tür: {r.type}</div>
							<div className="font-semibold">Maliyet: {r.cost} puan</div>
							{r.stock != null && <div>Stok: {r.stock}</div>}
							<Button disabled={!!redeeming} onClick={() => redeem(r.id)}>
								{redeeming === r.id ? "İşleniyor..." : "Satın Al"}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}


