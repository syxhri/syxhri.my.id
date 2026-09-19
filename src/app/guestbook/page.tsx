import type { Metadata } from "next";
import Guestbook from "./guestbook";

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Sign the guestbook and leave a message or feedback for Alfisyahri Amrun A. (Asa).',
  alternates: {
    canonical: '/guestbook',
  },
  openGraph: {
    title: 'Guestbook — asa',
    description: 'Sign the guestbook and leave a message or feedback for Alfisyahri Amrun A. (Asa).',
    url: 'https://syxhri.my.id/guestbook',
  },
}

export default function GuestbookPage() {
    return <Guestbook />
}