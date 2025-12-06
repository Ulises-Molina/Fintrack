import { Skeleton } from "./skeleton"

export function PageLoaderSkeleton({ label }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    </div>
  )
}
