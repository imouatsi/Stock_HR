# Toast System Documentation

## Overview
The toast system provides a clean, accessible way to show notifications to users. It's built on top of Radix UI and follows Shadcn/UI patterns.

## Setup
1. Add the `Toaster` component to your root layout:
```tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
```

## Basic Usage
```tsx
import { toast } from "@/components/ui/use-toast"

// Simple toast
toast({
  title: "Success",
  description: "Operation completed successfully",
})

// Toast with action
toast({
  title: "Item deleted",
  description: "The item has been removed from the system",
  action: (
    <ToastAction altText="Undo">Undo</ToastAction>
  ),
})

// Destructive toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong. Please try again.",
})
```

## Features
- **Variants**: `default` and `destructive`
- **Actions**: Add interactive buttons to toasts
- **Auto-dismiss**: Toasts automatically dismiss after a delay
- **Accessibility**: Built with ARIA attributes and keyboard navigation
- **Responsive**: Adapts to mobile and desktop layouts
- **Animations**: Smooth enter/exit animations

## API Reference

### `toast()`
```tsx
toast({
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  duration?: number
})
```

### `useToast()`
```tsx
const { toast, dismiss } = useToast()

// Dismiss a specific toast
dismiss(toastId)

// Dismiss all toasts
dismiss()
```

## Best Practices
1. Use descriptive titles and clear descriptions
2. Keep toast messages concise
3. Use destructive variant for errors
4. Add actions for undoable operations
5. Don't overwhelm users with too many toasts

## Examples

### Success Message
```tsx
toast({
  title: "Success",
  description: "Your changes have been saved",
})
```

### Error Message
```tsx
toast({
  variant: "destructive",
  title: "Error",
  description: "Failed to save changes. Please try again.",
})
```

### With Action
```tsx
toast({
  title: "Item moved to trash",
  description: "The item has been moved to the trash bin",
  action: (
    <ToastAction altText="Undo" onClick={handleUndo}>
      Undo
    </ToastAction>
  ),
})
```

### Custom Duration
```tsx
toast({
  title: "Auto-dismissing toast",
  description: "This toast will dismiss in 5 seconds",
  duration: 5000,
})
``` 