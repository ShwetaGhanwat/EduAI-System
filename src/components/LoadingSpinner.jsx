export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`animate-spin rounded-full border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent ${sizes[size]}`}></div>
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-dark-800 rounded-lg mb-4"></div>
      <div className="h-6 bg-dark-800 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-dark-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-dark-800 rounded w-2/3"></div>
    </div>
  );
};
