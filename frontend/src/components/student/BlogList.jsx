import BlogCard from './BlogCard';

const BlogList = ({ blogs, onRead, onViewDetail, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-48 bg-gray-200 rounded-lg mb-3" />
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blogs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onRead={onRead} onViewDetail={onViewDetail} />
      ))}
    </div>
  );
};

export default BlogList;
