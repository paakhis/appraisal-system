export const Spinner = ({ size = 'md' }: { size?: 'sm'|'md'|'lg' }) => {
  const s = { sm:'w-4 h-4', md:'w-7 h-7', lg:'w-10 h-10' }[size];
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`${s} border-2 border-[#D6E4FF] border-t-[#0E4CB7] rounded-full animate-spin`} />
    </div>
  );
};
