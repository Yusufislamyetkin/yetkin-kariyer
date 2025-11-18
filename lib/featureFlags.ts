export function isGamificationEnabled() {
	const flag = process.env.NEXT_PUBLIC_GAMIFICATION_ENABLED;
	return flag === undefined ? true : flag === "1" || flag?.toLowerCase() === "true";
}


