import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function cleanString(str: string): string {
  return str
    .replace(/\s*-\s*.*remaster.*$/i, "")
    .replace(/\s*\(feat\..*?\)/i, "")
    .replace(/\s*\(with.*?\)/i, "")
    .replace(/\s*-\s*bonus track.*$/i, "")
    .trim();
}

async function findAudioFromDeezer(query: string) {
  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      for (const item of data.data) {
        if (item.preview) {
          return {
            source: "deezer",
            url: item.preview as string,
            title: item.title as string,
            artist: item.artist?.name as string,
          };
        }
      }
    }
  } catch (e) {
    console.error("Deezer search error:", e);
  }
  return null;
}

async function findAudioFromItunes(query: string) {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&entity=song&limit=3`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      for (const item of data.results) {
        if (item.previewUrl) {
          return {
            source: "itunes",
            url: item.previewUrl as string,
            title: item.trackName as string,
            artist: item.artistName as string,
          };
        }
      }
    }
  } catch (e) {
    console.error("iTunes search error:", e);
  }
  return null;
}

async function findYoutubeMusicId(query: string): Promise<string | null> {
  try {
    const { Innertube } = await import("youtubei.js");
    const yt = await Innertube.create();
    const search = await yt.search(`${query} audio`, { type: "video" });
    if (search.videos && search.videos.length > 0) {
      const first: any = search.videos[0];
      return first?.id || null;
    }
  } catch (e) {
    console.error("YouTube search error:", e);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let title = searchParams.get("title");
  let artist = searchParams.get("artist");
  const isJson =
    searchParams.get("format") === "json" ||
    searchParams.get("json") === "true" ||
    req.headers.get("accept")?.includes("application/json");

  if (!title) {
    try {
      const apiKey = process.env.LASTFM_API_KEY;
      const username = process.env.LASTFM_USERNAME;
      if (apiKey && username) {
        const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
          username
        )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;
        const res = await fetch(lastfmUrl, { next: { revalidate: 30 } });
        if (res.ok) {
          const data = await res.json();
          const tracks = data?.recenttracks?.track;
          const track = Array.isArray(tracks) ? tracks[0] : tracks;
          if (track) {
            title = track.name || "";
            artist =
              typeof track.artist === "string"
                ? track.artist
                : track.artist?.["#text"] || track.artist?.name || "";
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch track from Last.fm in audio route:", e);
    }
  }

  if (!title) {
    return NextResponse.json(
      { error: "No track specified or currently playing" },
      { status: 404 }
    );
  }

  const query = `${cleanString(title)} ${cleanString(artist || "")}`.trim();

  let audio = await findAudioFromDeezer(query);

  if (!audio) {
    audio = await findAudioFromItunes(query);
  }

  let youtubeId: string | null = null;
  if (isJson) {
    youtubeId = await findYoutubeMusicId(query);
  }

  if (!audio && !youtubeId) {
    return NextResponse.json(
      { error: "Audio not found for this track", query },
      { status: 404 }
    );
  }

  const payload = {
    title: audio?.title || title,
    artist: audio?.artist || artist,
    audioUrl: audio?.url || null,
    youtubeId,
    source: audio?.source || "youtube",
  };

  if (isJson || !audio?.url) {
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  return NextResponse.redirect(audio.url, {
    status: 307,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
