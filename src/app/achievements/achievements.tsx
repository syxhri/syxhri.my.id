import Navbar from "@/components/navbar";
import achievements from "@/data/achievements";

export default function Achievements() {
    return (
        <>
            <Navbar page="achievements" />
            <div className="mt-20">
                <h1 className="text-xl md:text-2xl text-gray-900 dark:text-white font-bold">My Achievements!</h1>
                <div className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">
                    <ul className="pl-5">
                        {achievements.map((d, idx) => (
                            <li key={idx} className="pl-1 mb-6" style={{ listStyle: '"' + d.listStyle + '"' }}>
                                <h1 className="text-gray-900 dark:text-white">{d.name}</h1>
                                <ul className="list-disc list-inside text-neutral-500 dark:text-neutral-400">
                                    {d.tasks.map((t, idxt) => (
                                        <li key={idxt}>{t}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}