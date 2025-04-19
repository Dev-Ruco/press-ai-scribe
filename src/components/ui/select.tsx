
// Update the existing SelectLabel import and definition
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "block py-1.5 px-2 text-xs font-medium text-muted-foreground", 
      "select-none cursor-default tracking-wider uppercase", 
      "border-b border-border/50",
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Label>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName
