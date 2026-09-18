import Image from "next/image";

export default function ProfileAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-primary-500/20 dark:border-primary-400/20 bg-shark-100 dark:bg-shark-900 shadow-sm transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <Image
        src="/pfp.svg"
        alt="Alfisyahri Amrun A."
        width={160}
        height={160}
        priority
        className="w-full h-full object-cover"
      />
    </div>
  );
}
