"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SendClassLinkSheetProps = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  classLink: string;
  setClassLink: (value: string) => void;
  sendLink: (classLink: string) => void;
};

export default function SendClassLinkSheet({
  sheetOpen,
  setSheetOpen,
  classLink,
  setClassLink,
  sendLink,
}: SendClassLinkSheetProps) {
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side="bottom"
        className="inset-auto left-1/2 top-1/2 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border"
      >
        <SheetHeader>
          <SheetTitle>Send Class Link</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <Label htmlFor="link" className="cursor-pointer">
              Send class link
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-link">Class Link</Label>
            <Input
              id="class-link"
              placeholder="https://meet.google.com/..."
              value={classLink}
              onChange={(e) => setClassLink(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-white hover:bg-brand-strong"
              disabled={classLink.trim() === ""}
              onClick={() => sendLink(classLink)}
            >
              Send Link
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
