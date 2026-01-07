import { Skeleton } from "./ui/skeleton";

export function FlightSkeleton() {
  return (
    <div className="flex items-center justify-between bg-gray-200 p-4 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}
