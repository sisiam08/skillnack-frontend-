"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SendClassLinkSheetProps = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  linkOption: "default" | "new";
  setLinkOption: (option: "default" | "new") => void;
  defaultClassLink: string;
  newClassLink: string;
  setNewClassLink: (value: string) => void;
  sendLink: (classLink: string) => void;
};

export default function SendClassLinkSheet({
  sheetOpen,
  setSheetOpen,
  linkOption,
  setLinkOption,
  defaultClassLink,
  newClassLink,
  setNewClassLink,
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
          <RadioGroup
            value={linkOption}
            onValueChange={(value) =>
              setLinkOption(value === "new" ? "new" : "default")
            }
            className="gap-3"
          >
            <div className="flex items-center gap-3 rounded-md border p-3">
              <RadioGroupItem id="default-link" value="default" />
              <Label htmlFor="default-link" className="cursor-pointer">
                Send default saved link
              </Label>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <RadioGroupItem id="new-link" value="new" />
              <Label htmlFor="new-link" className="cursor-pointer">
                Send a new link
              </Label>
            </div>
          </RadioGroup>

          {linkOption === "default" ? (
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              {defaultClassLink
                ? defaultClassLink
                : "No default class link saved. Please save first or enter a new link."}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="new-class-link">New Class Link</Label>
              <Input
                id="new-class-link"
                placeholder="https://meet.google.com/..."
                value={newClassLink}
                onChange={(e) => setNewClassLink(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand text-white hover:bg-brand-strong"
              disabled={
                linkOption === "new" ? !newClassLink : !defaultClassLink
              }
              onClick={() =>
                sendLink(
                  linkOption === "new" ? newClassLink : defaultClassLink,
                )
              }
            >
              Send Link
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

