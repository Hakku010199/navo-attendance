export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="p-4 rounded-2xl bg-[#2e3038] text-gray-500 mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-gray-300 font-medium mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
