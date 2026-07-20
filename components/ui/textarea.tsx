import * as React from "react";

import { cn } from "@/lib/utils";

import { formControlClassName } from "@/components/ui/form-control-styles";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(formControlClassName("resize-y"), className)}
      {...props}
    />
  );
}

export { Textarea };
