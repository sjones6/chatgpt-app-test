'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. You can try again or view error details for more information.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full justify-between"
              >
                <span>Error Details</span>
                {showDetails ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>

              {showDetails && (
                <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 space-y-2 transition-all">
                  <div>
                    <p className="text-xs font-semibold text-destructive mb-1">Error Message:</p>
                    <p className="text-sm font-mono text-foreground break-words">
                      {error.message || 'No error message available'}
                    </p>
                  </div>
                  {error.digest && (
                    <div>
                      <p className="text-xs font-semibold text-destructive mb-1">Digest:</p>
                      <p className="text-sm font-mono text-muted-foreground break-all">
                        {error.digest}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button onClick={() => reset()} className="w-full">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}