import Navbar from "@/components/navbar";
import projects from "@/data/projects";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

export default function Projects() {
    return (
        <>
            <Navbar page="projects" />
            <div className="mt-20">
                <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white font-bold">Some of My Projects</h1>
                <div className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((x, idx) => (
                        <div className="border border-primary-200 dark:border-shark-500 rounded p-4" key={idx}>
                            <h1 className="text-gray-900 dark:text-white">{x.name}</h1>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{x.description}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex gap-2 items-center">
                                    {x.technologies.map((Tech, idtech) => (
                                        <Tech key={idtech} className="w-5 h-5" />
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center">
                                    {x.links.github && <Link href={x.links.github} target="_blank" className="hover:text-primary-600 dark:hover:text-neutral-100"><IconBrandGithub className="w-5 h-5" /></Link>}
                                    {x.links.demo && <Link href={x.links.demo} target="_blank" className="hover:text-primary-600 dark:hover:text-neutral-100"><IconExternalLink className="w-5 h-5" /></Link>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}