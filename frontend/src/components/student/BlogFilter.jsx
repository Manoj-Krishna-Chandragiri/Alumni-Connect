const BlogFilter = ({ filters, onChange }) => {
  const categories = [
    'All',
    'Career',
    'Technology',
    'Industry Insights',
    'Success Stories',
    'Tips & Advice',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            onChange({ ...filters, category: category === 'All' ? '' : category })
          }
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            (filters.category === '' && category === 'All') ||
            filters.category === category
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default BlogFilter;
