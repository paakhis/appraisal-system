export const EmptyState = ({ message = 'No data found.', icon = '' }: { message?: string; icon?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <span className="text-4xl mb-3">{icon}</span>
    <p className="text-sm">{message}</p>
  </div>
);
