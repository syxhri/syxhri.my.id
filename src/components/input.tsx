import { cn } from "@/lib/cn";

export default function Input({ className, ...props }: React.ComponentProps<"input">) {
    return <input className={cn(className, 'w-full bg-primary-100 dark:bg-shark-900 rounded-md focus:outline-2 focus:outline-primary-200 dark:focus:outline-shark-700 dark:text-white p-2 mt-1')} {...props} />
}