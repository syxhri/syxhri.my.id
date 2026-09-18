import { Icon, IconBrandCpp, IconBrandJavascript, IconBrandNextjs, IconBrandNpm, IconBrandPython, IconProps } from "@tabler/icons-react";
import { IconPostgresql } from "../components/postgresql";

type projectsData = Array<{
    name: string;
    description: string;
    technologies: React.ComponentType<{ className?: string }>[];
    links: {
        github?: string;
        demo?: string;
    };
}>;

const projects: projectsData = [
    {
        name: 'Jokiwi (Joki Wizee)',
        description: 'A simple web app to manage joki orders, payments, deadlines, and receipts.',
        technologies: [IconBrandJavascript, IconBrandNpm, IconBrandNextjs, IconPostgresql],
        links: {
            github: 'https://github.com/syxhri/jokiwi',
            demo: 'https://www.jokiwi.app'
        }
    },
    {
        name: 'NIK Parser',
        description: 'A CLI tool that parses NIK and displays information about the person using C++.',
        technologies: [IconBrandCpp],
        links: {
            github: 'https://github.com/syxhri/nikparser',
        }
    },
    {
        name: 'Cryptid',
        description: 'A simple Python tool for encrypt and decrypt most of Python object using Pickle and PyCryptodome.',
        technologies: [IconBrandPython],
        links: {
            github: 'https://github.com/syxhri/cryptid',
        }
    },
    {
        name: 'Hand Tracking',
        description: 'Trend TikTok Hand Tracking using Python and MediaPipe.',
        technologies: [IconBrandPython],
        links: {
            github: 'https://github.com/syxhri/handtracking-trend',
        }
    },
];

export default projects;