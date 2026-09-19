"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Next13ProgressBar from "next13-progressbar";
import { AudioProvider } from "@/context/audio-context";

export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            <AudioProvider>
                {children}
            </AudioProvider>
            <Next13ProgressBar color="#0284c7" height="2.5px" options={{ showSpinner: false }} showOnShallow={true} />
        </SessionProvider>
    )
}