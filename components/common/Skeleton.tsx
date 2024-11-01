interface SkeletonProps {
  height: string;
}

export default function Skeleton({ height }: SkeletonProps) {
  return (
    <div
      class="animate-pulse bg-gray-200 rounded"
      style={{ height }}
      aria-hidden="true"
    ></div>
  );
}
