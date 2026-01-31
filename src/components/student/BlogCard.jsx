import { FiCalendar, FiUser, FiClock, FiBookmark, FiShare2 } from 'react-icons/fi';

const BlogCard = ({ blog, onRead }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card-hover overflow-hidden">
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="h-48 -mx-6 -mt-6 mb-4">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category */}
      {blog.category && (
        <span className="badge-primary mb-3">{blog.category}</span>
      )}

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
        {blog.title}
      </h3>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>

      {/* Author & Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            {blog.author?.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-4 h-4 text-primary-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {blog.author?.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(blog.createdAt)}</span>
              <span>•</span>
              <FiClock className="w-3 h-3" />
              <span>{blog.readTime || '5 min read'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <FiBookmark className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Read More */}
      <button
        onClick={() => onRead && onRead(blog)}
        className="w-full mt-4 py-2 text-center text-primary-600 font-medium hover:text-primary-700"
      >
        Read More →
      </button>
    </div>
  );
};

export default BlogCard;
