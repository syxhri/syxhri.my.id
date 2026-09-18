import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";

const variants = cva('cursor-pointer transition rounded-md py-2 px-4 disabled:pointer-events-none disabled:opacity-50', {
    variants: {
        variant: {
            primary: 'bg-primary-400 hover:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 text-neutral-950 font-medium',
            danger: 'bg-red-400 hover:bg-red-500 text-white',
            blank: ''
        }
    },
    defaultVariants: {
        variant: 'primary'
    }
});

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof variants>

export default function Button({ className, variant, ...props }: ButtonProps) {
    return <button className={cn(variants({ variant, className }))} {...props} />
}