import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-x-4">
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

export default LoadingSkeleton;
