import { type VariantProps, cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:relative",
  {
    variants: {
      variant: {
        default: "bg-ring text-popover text-sm font-extrabold ",
        dark: "bg-foreground text-background text-sm font-extrabold ",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-sm font-extrabold border border-input bg-background ",
        "outline-white":
          "text-text-primary-foreground text-sm font-extrabold border border-input-foreground bg-foreground",
        secondary:
          "bg-secondary text-secondary-foreground font-extrabold hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        yellow: "bg-yellow text-primary-foreground text-sm font-bold ",
        "outline-yellow":
          "text-yellow text-sm font-bold border border-yellow bg-transparent",
        "outline-green":
          "text-[#428318] text-sm font-bold border border-[#428318] bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
