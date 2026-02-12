import { useState, useEffect } from 'react';
import alumniApi from '../../api/alumni.api';
import { BlogEditor, MyBlogs } from '../../components/alumni';
import { BlogList } from '../../components/student';
import { Modal, SearchBar, Loader, ErrorAlert, ConfirmModal, BlogDetailModal } from '../../components/shared';
import { FiPlus } from 'react-icons/fi';

const AlumniBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteBlog, setDeleteBlog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const [allBlogsRes, myBlogsRes] = await Promise.all([
        alumniApi.getBlogs(),
        alumniApi.getMyBlogs(),
      ]);
      // Handle paginated response (results array) or direct array
      const allBlogsData = Array.isArray(allBlogsRes.data) 
        ? allBlogsRes.data 
        : allBlogsRes.data?.results || [];
      const myBlogsData = Array.isArray(myBlogsRes.data) 
        ? myBlogsRes.data 
        : myBlogsRes.data?.results || [];
      setBlogs(allBlogsData);
      setMyBlogs(myBlogsData);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    try {
      setSaving(true);
      await alumniApi.createBlog(blogData);
      setShowEditor(false);
      fetchBlogs();
    } catch (err) {
      setError('Failed to create blog');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBlog = async (blogData) => {
    try {
      setSaving(true);
      await alumniApi.updateBlog(editingBlog.id, blogData);
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      setError('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async () => {
    try {
      await alumniApi.deleteBlog(deleteBlog.id);
      setDeleteBlog(null);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500">
            Share your knowledge and experiences with students
          </p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Write New Blog
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Blogs ({blogs.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Blogs ({myBlogs.length})
        </button>
      </div>

      {/* Search */}
      {activeTab === 'all' && (
        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search blogs..."
          />
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : activeTab === 'all' ? (
        <BlogList blogs={filteredBlogs} onViewDetail={setSelectedBlog} />
      ) : (
        <MyBlogs
          blogs={myBlogs}
          onEdit={(blog) => setEditingBlog(blog)}
          onDelete={(blog) => setDeleteBlog(blog)}
          onView={setSelectedBlog}
        />
      )}

      {/* Blog Detail Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />

      {/* Create Blog Modal */}
      <Modal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title="Write New Blog"
        size="xl"
      >
        <BlogEditor
          onSubmit={handleCreateBlog}
          onCancel={() => setShowEditor(false)}
          loading={saving}
        />
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        isOpen={!!editingBlog}
        onClose={() => setEditingBlog(null)}
        title="Edit Blog"
        size="xl"
      >
        <BlogEditor
          blog={editingBlog}
          onSubmit={handleUpdateBlog}
          onCancel={() => setEditingBlog(null)}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteBlog}
        onClose={() => setDeleteBlog(null)}
        onConfirm={handleDeleteBlog}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteBlog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AlumniBlogs;
