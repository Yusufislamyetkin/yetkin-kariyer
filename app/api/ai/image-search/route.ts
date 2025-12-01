import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Placeholder for image search API
// Will support Unsplash or Pexels when keys are provided
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // Try Unsplash first if key is available
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${unsplashKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const images = (data.results || []).map((photo: any) => ({
            id: photo.id,
            url: photo.urls?.regular || photo.urls?.small,
            thumbnail: photo.urls?.thumb,
            description: photo.description || photo.alt_description,
            author: photo.user?.name,
            authorUrl: photo.user?.links?.html,
          }));

          return NextResponse.json({ images, source: "unsplash" });
        }
      } catch (error) {
        console.error("Unsplash API error:", error);
      }
    }

    // Try Pexels if key is available
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (pexelsKey) {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
          {
            headers: {
              Authorization: pexelsKey,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const images = (data.photos || []).map((photo: any) => ({
            id: photo.id,
            url: photo.src?.large || photo.src?.medium,
            thumbnail: photo.src?.small,
            description: photo.alt,
            author: photo.photographer,
            authorUrl: photo.photographer_url,
          }));

          return NextResponse.json({ images, source: "pexels" });
        }
      } catch (error) {
        console.error("Pexels API error:", error);
      }
    }

    // No API keys available, return empty result
    return NextResponse.json({
      images: [],
      source: null,
      message: "Image search API key not configured. Add UNSPLASH_ACCESS_KEY or PEXELS_API_KEY to enable image search.",
    });
  } catch (error) {
    console.error("Image search error:", error);
    return NextResponse.json(
      { error: "Görsel arama sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
