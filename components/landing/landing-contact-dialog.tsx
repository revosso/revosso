"use client"

import type React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { LandingLocaleMessages } from "@/lib/landing-translations/types"

type LandingContactDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  copy: LandingLocaleMessages["contact"]
  selectedInterest: string
  onSelectedInterestChange: (value: string) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function LandingContactDialog({
  open,
  onOpenChange,
  title,
  copy,
  selectedInterest,
  onSelectedInterestChange,
  isSubmitting,
  onSubmit,
}: LandingContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">{title}</DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-300">{copy.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium">
                {copy.fields.name} *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="h-12 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">
                {copy.fields.email} *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@company.com"
                required
                className="h-12 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-700 dark:text-slate-200 font-medium">
              {copy.fields.company}
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="Your Company"
              className="h-12 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productInterest" className="text-slate-700 dark:text-slate-200 font-medium">
              {copy.fields.need} *
            </Label>
            <Select name="productInterest" value={selectedInterest} onValueChange={onSelectedInterestChange}>
              <SelectTrigger className="h-12 bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400">
                <SelectValue placeholder={copy.fields.needPlaceholder} className="text-slate-500 dark:text-slate-400" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600">
                <SelectItem value="NEW_PLATFORM" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.newPlatform}
                </SelectItem>
                <SelectItem value="PLATFORM_TAKEOVER" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.takeover}
                </SelectItem>
                <SelectItem value="PLATFORM_MAINTENANCE" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.maintenance}
                </SelectItem>
                <SelectItem value="INFRASTRUCTURE_HOSTING" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.hosting}
                </SelectItem>
                <SelectItem value="PARTNERSHIP" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.partnership}
                </SelectItem>
                <SelectItem value="GENERAL_INQUIRY" className="text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                  {copy.options.general}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-700 dark:text-slate-200 font-medium">
              {copy.fields.message} *
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder={copy.fields.messagePlaceholder}
              required
              className="min-h-[120px] resize-none bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>

          <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              disabled={isSubmitting}
            >
              {copy.buttons.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              disabled={isSubmitting || !selectedInterest}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {copy.buttons.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {copy.buttons.send}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
