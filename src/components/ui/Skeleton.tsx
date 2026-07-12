interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-40" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function LectureSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 glass rounded-xl">
      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {i <= 2 && (
            <div className="pl-4 space-y-2">
              <Skeleton className="h-8 w-5/6" />
              <Skeleton className="h-8 w-4/6" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
