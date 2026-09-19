import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    return NextResponse.json(
      { isPlaying: false, track: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      username
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { isPlaying: false, track: null },
        { status: 200 }
      );
    }

    const data = await res.json();
    const tracks = data?.recenttracks?.track;
    const track = Array.isArray(tracks) ? tracks[0] : tracks;

    if (!track) {
      return NextResponse.json(
        { isPlaying: false, track: null },
        { status: 200 }
      );
    }

    const isPlaying = track["@attr"]?.nowplaying === "true";
    const title = track.name || "";
    const artist =
      typeof track.artist === "string"
        ? track.artist
        : track.artist?.["#text"] || track.artist?.name || "";
    const album = track.album?.["#text"] || "";

    // Find the largest valid image from Last.fm
    let albumImageUrl: string | null = null;
    if (Array.isArray(track.image)) {
      const preferredSizes = ["extralarge", "large", "medium", "small"];
      for (const size of preferredSizes) {
        const found = track.image.find(
          (img: { size?: string; "#text"?: string }) =>
            img.size === size && img["#text"] && img["#text"].trim().length > 0
        );
        if (found?.["#text"]) {
          albumImageUrl = found["#text"];
          break;
        }
      }
      if (!albumImageUrl) {
        const anyImg = track.image.find(
          (img: { "#text"?: string }) => img["#text"] && img["#text"].trim().length > 0
        );
        if (anyImg?.["#text"]) {
          albumImageUrl = anyImg["#text"];
        }
      }
    }

    // Spotify search link for authentic Spotify experience
    const searchQuery = encodeURIComponent(`${title} ${artist}`.trim());
    const spotifyUrl = `https://open.spotify.com/search/result/${searchQuery}`;

    return NextResponse.json(
      {
        isPlaying,
        title,
        artist,
        album,
        albumImageUrl,
        spotifyUrl,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("Error fetching music data:", err);
    return NextResponse.json(
      { isPlaying: false, track: null },
      { status: 200 }
    );
  }
}
