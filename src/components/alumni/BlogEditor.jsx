import { useState } from 'react';
import { FiImage, FiBold, FiItalic, FiLink, FiList } from 'react-icons/fi';
import { Loader } from '../../components/shared';

const BlogEditor = ({ blog, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    category: blog?.category || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    tags: blog?.tags?.join(', ') || '',
  });

  const categories = [
    'Career',
    'Technology',
    'Industry Insights',
    'Success Stories',
    'Tips & Advice',
    'Personal Growth',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blog Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input text-lg font-medium"
          placeholder="Enter an engaging title..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Excerpt *
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={2}
          className="input"
          placeholder="A brief summary of your blog (displayed in previews)..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        {/* Simple toolbar */}
        <div className="flex items-center gap-2 p-2 border border-b-0 border-gray-300 rounded-t-lg bg-gray-50">
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Bold"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Italic"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Link"
          >
            <FiLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="List"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200"
            title="Image"
          >
            <FiImage className="w-4 h-4" />
          </button>
        </div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={12}
          className="input rounded-t-none"
          placeholder="Write your blog content here... (Markdown supported)"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="input"
          placeholder="e.g., career, technology, tips (comma separated)"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <Loader size="sm" color="white" />
          ) : blog ? (
            'Update Blog'
          ) : (
            'Publish Blog'
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
