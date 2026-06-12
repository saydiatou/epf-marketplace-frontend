export function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
