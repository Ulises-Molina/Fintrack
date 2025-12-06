function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-primary/10 ${className}`}
      {...props}
    />
  )
}

function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl bg-white/60 p-4 border border-white/50"
        >
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-3 w-14 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="relative h-[240px] w-[240px]">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      
      <div className="flex-1 w-full space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl px-4 py-3 bg-primary/10 border border-white/50"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="relative p-6 border border-white/60 bg-white/80 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function FinancialSummarySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      <div className="relative h-24 w-24">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      <div className="space-y-2 text-center">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  )
}

export { Skeleton }
export { TransactionSkeleton }
export { CategorySkeleton }
export { SummaryCardsSkeleton }
export { FinancialSummarySkeleton }
