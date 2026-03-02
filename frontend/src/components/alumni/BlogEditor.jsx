import { useState } from 'react';
import { FiImage, FiBold, FiItalic, FiLink, FiList, FiUpload, FiX } from 'react-icons/fi';
import { Loader } from '../../components/shared';
import alumniApi from '../../api/alumni.api';

const BlogEditor = ({ blog, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    category: blog?.category || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.cover_image || blog?.coverImage || '',
    tags: blog?.tags?.join(', ') || '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const handleFileUpload = async (e, type = 'cover') => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (type === 'cover' && !validImageTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'alumni-connect/blogs');
      
      const response = await alumniApi.uploadImage(formDataUpload);
      
      if (response.data?.url) {
        if (type === 'cover') {
          setFormData((prev) => ({ ...prev, coverImage: response.data.url }));
        } else {
          // Add to uploaded files for content insertion
          const fileUrl = response.data.url;
          const markdown = file.type.startsWith('video/') 
            ? `\n\n<video controls width="100%">\n  <source src="${fileUrl}" type="${file.type}">\n</video>\n\n`
            : `\n\n![${file.name}](${fileUrl})\n\n`;
          
          // Insert at cursor position in content
          setFormData((prev) => ({
            ...prev,
            content: prev.content + markdown
          }));
          
          setUploadedFiles((prev) => [...prev, { url: fileUrl, type: file.type, name: file.name }]);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
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
            Cover Image
          </label>
          <div className="space-y-2">
            {/* Image URL Input */}
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            <div className="text-xs text-gray-500 text-center">OR</div>
            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'cover')}
                className="hidden"
                id="coverImageUpload"
                disabled={uploading}
              />
              <label
                htmlFor="coverImageUpload"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <FiUpload className="w-4 h-4" />
                <span className="text-sm">
                  {uploading ? 'Uploading...' : 'Upload Cover Image'}
                </span>
              </label>
            </div>
            {/* Preview */}
            {formData.coverImage && (
              <div className="relative">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
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
        <p className="text-xs text-gray-500 mb-2">
          Supports Markdown formatting. You can add images, videos, code blocks, and more.
        </p>
        {/* Upload buttons for content */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'content')}
            className="hidden"
            id="contentImageUpload"
            disabled={uploading}
          />
          <label
            htmlFor="contentImageUpload"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer text-sm"
          >
            <FiImage className="w-4 h-4" />
            <span>Add Image</span>
          </label>
          
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, 'content')}
            className="hidden"
            id="contentVideoUpload"
            disabled={uploading}
          />
          <label
            htmlFor="contentVideoUpload"
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 cursor-pointer text-sm"
          >
            <FiUpload className="w-4 h-4" />
            <span>Add Video</span>
          </label>
          
          {uploading && (
            <span className="text-xs text-gray-500">Uploading...</span>
          )}
        </div>
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
          className="input rounded-t-none font-mono text-sm"
          placeholder={`Write your blog content here...

Markdown examples:
# Heading
## Subheading

**Bold text** or *Italic text*

- List item 1
- List item 2

[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

\`\`\`python
# Code block
print("Hello World")
\`\`\`

For YouTube videos, use:
[![Video Title](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

Or embed with iframe tag (paste directly in markdown)`}
          required
        />
        <div className="text-xs text-gray-500 mt-1 px-2">
          Tip: You can paste image URLs directly. For videos, paste YouTube/Vimeo embed codes.
        </div>
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
