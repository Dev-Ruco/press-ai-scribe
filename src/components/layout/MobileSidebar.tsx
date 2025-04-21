
import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <DialogContent className="fixed top-0 left-0 bottom-0 w-64 bg-[#34393f] text-white shadow-lg z-50 p-4 flex flex-col">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X size={20} />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        {/* Menu or content can be added here or can be passed as children */}
        {/* But currently, usage just needs the sidebar toggle */}
      </DialogContent>
    </Dialog>
  );
}
