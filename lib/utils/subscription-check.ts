/**
 * Client-side abonelik kontrolü yapar ve gerekirse yönlendirme yapar
 * @returns Promise<boolean> - Abonelik varsa true, yoksa false (ve yönlendirme yapılır)
 */
export async function checkSubscriptionAndRedirect(): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/check");
    const data = await response.json();

    if (!data.hasActiveSubscription) {
      window.location.href = "/subscription-required";
      return false;
    }

    return true;
  } catch (error) {
    console.error("[checkSubscriptionAndRedirect] Error:", error);
    // Hata durumunda da yönlendir (güvenli taraf)
    window.location.href = "/subscription-required";
    return false;
  }
}

/**
 * Abonelik kontrolü yapar ama yönlendirme yapmaz
 * @returns Promise<boolean> - Abonelik varsa true, yoksa false
 */
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/check");
    const data = await response.json();
    return data.hasActiveSubscription === true;
  } catch (error) {
    console.error("[hasActiveSubscription] Error:", error);
    return false;
  }
}

/**
 * Aktivite başlatmadan önce abonelik kontrolü yapar
 * Abonelik yoksa yönlendirme yapar, varsa true döner
 * @returns Promise<boolean> - Abonelik varsa true, yoksa false (ve yönlendirme yapılır)
 */
export async function checkSubscriptionBeforeAction(): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/check");
    const data = await response.json();
    
    if (!data.hasActiveSubscription) {
      // Store current URL as referrer for back button functionality
      if (typeof window !== "undefined") {
        sessionStorage.setItem("subscriptionRedirectReferrer", window.location.href);
      }
      window.location.href = "/subscription-required";
      return false;
    }
    return true;
  } catch (error) {
    console.error("[checkSubscriptionBeforeAction] Error:", error);
    // Store current URL as referrer for back button functionality
    if (typeof window !== "undefined") {
      sessionStorage.setItem("subscriptionRedirectReferrer", window.location.href);
    }
    window.location.href = "/subscription-required";
    return false;
  }
}
