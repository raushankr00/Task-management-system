export default function TaskSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
    >
      <div className="flex items-start gap-2.5">
        <div className="skeleton w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded w-3/4" />
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
