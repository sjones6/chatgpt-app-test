'use client'

import { useIsChatGptApp } from '@/app/hooks/use-is-chatgpt-app'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ChatGptOnlyProps {
  children: React.ReactNode
}

export function ChatGptOnly({ children }: ChatGptOnlyProps) {
  const isChatGptApp = useIsChatGptApp()

  if (!isChatGptApp) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ChatGPT Only</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                This area is only designed for ChatGPT.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

