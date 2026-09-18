import { cn } from "@/lib/cn";

export default function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea className={cn(className, 'w-full h-32 bg-shark-100 dark:bg-shark-900 border border-shark-200 dark:border-shark-800 rounded-md focus:outline-2 focus:outline-primary-500 dark:focus:outline-primary-400 text-gray-900 dark:text-white p-2 mt-1 transition-colors')} {...props} ></textarea>
    )
}