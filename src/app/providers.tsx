"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Next13ProgressBar from "next13-progressbar";

export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            {children}
            <Next13ProgressBar color="#7993B7" />
        </SessionProvider>
    )
}