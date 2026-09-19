'use client'

import { cn } from "@/lib/cn";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MuteToggle from "./mute-toggle";
import ThemeSwitch from "./theme-switch";

type page = 'home' | 'achievements' | 'projects' | 'guestbook';

export default function Navbar({ page }: { page?: page }) {
    let [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        if (open) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <nav className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">alfi<span className="text-primary-500 dark:text-primary-400">.syahri</span></Link>
            <div className="sm:flex gap-6 hidden items-center">
                <Link href={'/'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'home' && "underline text-gray-900 dark:text-white")}>home</Link>
                {/* <Link href={'/achievements'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'achievements' && "underline text-gray-900 dark:text-white")}>achievements</Link> */}
                <Link href={'/projects'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'projects' && "underline text-gray-900 dark:text-white")}>projects</Link>
                <Link href={'/guestbook'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'guestbook' && "underline text-gray-900 dark:text-white")}>guestbook</Link>
                <div className="flex items-center gap-4">
                    <MuteToggle iconSize={18} />
                    <ThemeSwitch />
                </div>
            </div>
            <div className="sm:hidden flex gap-4 items-center">
                <MuteToggle iconSize={24} />
                <ThemeSwitch iconSize={24} />
                <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <IconMenu2 className="w-6 h-6" />
                </button>
            </div>
            <div
                onClick={() => setOpen(false)}
                className={cn("fixed inset-0 z-50 w-full h-full bg-gray-900/50 dark:bg-gray-800/50 p-4 backdrop-blur-xs transition-opacity", open ? 'block' : 'hidden')}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-shark-900 rounded p-4 shadow-xl border border-shark-200/40 dark:border-shark-800/40"
                >
                    <div className="flex items-center justify-between">
                        <Link href="/" onClick={() => setOpen(false)} className="font-bold text-xl text-gray-900 dark:text-white">alfi<span className="text-primary-500 dark:text-primary-400">.syahri</span></Link>
                        <button onClick={() => setOpen(false)} aria-label="Close menu" className="cursor-pointer p-1">
                            <IconX className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                        </button>
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                        <Link href={'/'} onClick={() => setOpen(false)} className={cn("text-neutral-700 dark:text-neutral-300 py-1", page === 'home' && "underline text-gray-900 dark:text-white")}>home</Link>
                        {/* <Link href={'/achievements'} onClick={() => setOpen(false)} className={cn("text-neutral-700 dark:text-neutral-300 py-1", page === 'achievements' && "underline text-gray-900 dark:text-white")}>achievements</Link> */}
                        <Link href={'/projects'} onClick={() => setOpen(false)} className={cn("text-neutral-700 dark:text-neutral-300 py-1", page === 'projects' && "underline text-gray-900 dark:text-white")}>projects</Link>
                        <Link href={'/guestbook'} onClick={() => setOpen(false)} className={cn("text-neutral-700 dark:text-neutral-300 py-1", page === 'guestbook' && "underline text-gray-900 dark:text-white")}>guestbook</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}