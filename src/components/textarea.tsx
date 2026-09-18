import { cn } from "@/lib/cn";

export default function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea className={cn(className, 'w-full h-32 bg-primary-100 dark:bg-shark-900 rounded-md focus:outline-2 focus:outline-primary-200 dark:focus:outline-shark-700 dark:text-white p-2 mt-1')} {...props} ></textarea>
    )
}