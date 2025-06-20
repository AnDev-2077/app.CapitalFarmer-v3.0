import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const FullscreenDialog = DialogPrimitive.Root

const FullscreenDialogTrigger = DialogPrimitive.Trigger

const FullscreenDialogPortal = DialogPrimitive.Portal

const FullscreenDialogClose = DialogPrimitive.Close

const FullscreenDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
FullscreenDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const FullscreenDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <FullscreenDialogPortal>
    <FullscreenDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </FullscreenDialogPortal>
))
FullscreenDialogContent.displayName = DialogPrimitive.Content.displayName

const FullscreenDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-6 p-6 pb-0", className)} {...props} />
)
FullscreenDialogHeader.displayName = "FullscreenDialogHeader"

const FullscreenDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)} {...props} />
)
FullscreenDialogFooter.displayName = "FullscreenDialogFooter"

const FullscreenDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
FullscreenDialogTitle.displayName = DialogPrimitive.Title.displayName

const FullscreenDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
FullscreenDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  FullscreenDialog,
  FullscreenDialogPortal,
  FullscreenDialogOverlay,
  FullscreenDialogClose,
  FullscreenDialogTrigger,
  FullscreenDialogContent,
  FullscreenDialogHeader,
  FullscreenDialogFooter,
  FullscreenDialogTitle,
  FullscreenDialogDescription,
}
