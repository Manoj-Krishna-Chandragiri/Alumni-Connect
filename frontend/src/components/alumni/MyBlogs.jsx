import { FiEdit2, FiTrash2, FiEye, FiCalendar } from 'react-icons/fi';
import { formatShortDate } from '../../utils/timeUtils';

const MyBlogs = ({ blogs, onEdit, onDelete, onView }) => {
  const formatDate = formatShortDate;

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No blogs published yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="card flex gap-4">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge-primary text-xs">{blog.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {formatDate(blog.created_at)}
                  </span>
                  <span>{blog.read_time || blog.readTime || '5 min read'}</span>
                  <span
                    className={`badge ${
                      blog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {blog.status || 'Published'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView && onView(blog)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  title="View"
                >
                  <FiEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit && onEdit(blog)}
                  className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(blog)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBlogs;
