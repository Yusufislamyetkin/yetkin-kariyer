"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function AdminGamificationPage() {
	const [rewards, setRewards] = useState<any[]>([]);
	const [quests, setQuests] = useState<any[]>([]);
	const [badges, setBadges] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const [r, q, b] = await Promise.all([
					fetch("/api/gamification/admin/rewards"),
					fetch("/api/gamification/admin/quests"),
					fetch("/api/gamification/admin/badges"),
				]);
				setRewards((await r.json()).rewards ?? []);
				setQuests((await q.json()).quests ?? []);
				setBadges((await b.json()).badges ?? []);
			} catch (e: any) {
				setError(e?.message ?? "Yüklenemedi");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const [newReward, setNewReward] = useState<any>({ sku: "", title: "", type: "VIRTUAL", cost: 100, stock: null });
	const createReward = async () => {
		const res = await fetch("/api/gamification/admin/rewards", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newReward),
		});
		if (res.ok) {
			const data = await res.json();
			setRewards([data.reward, ...rewards]);
			setNewReward({ sku: "", title: "", type: "VIRTUAL", cost: 100, stock: null });
		} else {
			alert("Ödül oluşturulamadı");
		}
	};

	if (loading) return <div className="p-6">Yükleniyor...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold">Gamification Yönetimi</h1>

			<Card>
				<CardHeader>
					<CardTitle>Ödüller</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-5 gap-2">
						<Input placeholder="SKU" value={newReward.sku} onChange={(e) => setNewReward({ ...newReward, sku: e.target.value })} />
						<Input placeholder="Başlık" value={newReward.title} onChange={(e) => setNewReward({ ...newReward, title: e.target.value })} />
						<select className="border rounded px-2 py-2" value={newReward.type} onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}>
							<option value="VIRTUAL">VIRTUAL</option>
							<option value="VOUCHER">VOUCHER</option>
							<option value="PHYSICAL">PHYSICAL</option>
						</select>
						<Input type="number" placeholder="Maliyet" value={newReward.cost} onChange={(e) => setNewReward({ ...newReward, cost: Number(e.target.value) })} />
						<Button onClick={createReward}>Ekle</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						{rewards.map((r) => (
							<div key={r.id} className="border rounded p-3">
								<div className="font-semibold">{r.title}</div>
								<div className="text-sm">SKU: {r.sku}</div>
								<div className="text-sm">Tür: {r.type}</div>
								<div className="text-sm">Maliyet: {r.cost}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Görevler</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-gray-600">Toplam {quests.length} görev</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Rozetler</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						{badges.map((b) => (
							<div key={b.id} className="border rounded p-3">
								<div className="font-semibold">{b.name}</div>
								<div className="text-sm">Anahtar: {b.key}</div>
								<div className="text-sm">Kategori: {b.category}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


