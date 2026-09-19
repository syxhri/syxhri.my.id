import type { Metadata } from "next";
import Projects from "./projects";

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore software engineering projects, backend architectures, web applications, and repositories built by Alfisyahri Amrun A. (Asa).',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects — asa',
    description: 'Explore software engineering projects, backend architectures, web applications, and repositories built by Alfisyahri Amrun A. (Asa).',
    url: 'https://syxhri.my.id/projects',
  },
}

export default function ProjectsPage() {
    return <Projects />
}