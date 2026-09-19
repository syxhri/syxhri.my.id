import type { Metadata } from "next";
import Achievements from "./achievements";

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Academic milestones, certifications, and competition achievements by Alfisyahri Amrun A. (Asa).',
  alternates: {
    canonical: '/achievements',
  },
  openGraph: {
    title: 'Achievements — asa',
    description: 'Academic milestones, certifications, and competition achievements by Alfisyahri Amrun A. (Asa).',
    url: 'https://syxhri.my.id/achievements',
  },
}

export default function AchievementsPage() {
    return <Achievements />
}