'use client'

import { cn } from "@/lib/cn";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import ThemeSwitch from "./theme-switch";

type page = 'home' | 'achievements' | 'projects' | 'guestbook';

export default function Navbar({ page }: { page?: page }) {
    let [open, setOpen] = useState(false);
    return (
        <nav className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">alfi<span className="text-primary-500 dark:text-primary-400">.ndyou</span></Link>
            <div className="sm:flex gap-6 hidden">
                <Link href={'/'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'home' && "underline text-gray-900 dark:text-white")}>home</Link>
                {/* <Link href={'/achievements'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'achievements' && "underline text-gray-900 dark:text-white")}>achievements</Link> */}
                <Link href={'/projects'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'projects' && "underline text-gray-900 dark:text-white")}>projects</Link>
                <Link href={'/guestbook'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'guestbook' && "underline text-gray-900 dark:text-white")}>guestbook</Link>
                <ThemeSwitch />
            </div>
            <div className="sm:hidden flex gap-4 items-center">
                <ThemeSwitch iconSize={24} />
                <button onClick={() => setOpen(true)} className="text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <IconMenu2 className="w-6 h-6" />
                </button>
            </div>
            <div className={cn("fixed top-0 left-0 w-full h-full bg-gray-900/50 dark:bg-gray-800/50 p-4", open ? '' : 'hidden')}>
                <div className="bg-white dark:bg-shark-900 rounded p-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">alfi<span className="text-primary-500 dark:text-primary-400">.ndyou</span></Link>
                        <button onClick={() => setOpen(false)} className="cursor-pointer">
                            <IconX className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                        </button>
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                        <Link href={'/'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'home' && "underline text-gray-900 dark:text-white")}>home</Link>
                        {/* <Link href={'/achievements'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'achievements' && "underline text-gray-900 dark:text-white")}>achievements</Link> */}
                        <Link href={'/projects'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'projects' && "underline text-gray-900 dark:text-white")}>projects</Link>
                        <Link href={'/guestbook'} className={cn("text-neutral-700 dark:text-neutral-300", page === 'guestbook' && "underline text-gray-900 dark:text-white")}>guestbook</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}