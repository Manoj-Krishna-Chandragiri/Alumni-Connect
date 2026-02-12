import BlogCard from './BlogCard';

const BlogList = ({ blogs, onRead, onViewDetail, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
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
