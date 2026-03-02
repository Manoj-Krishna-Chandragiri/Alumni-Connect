import { useState, useEffect } from 'react';
import alumniApi from '../../api/alumni.api';
import { BlogList } from '../../components/student';
import { JobCard } from '../../components/student';
import { BlogDetailModal, SearchBar, Loader, ErrorAlert, EmptyState } from '../../components/shared';
import JobDetailModal from '../../components/shared/JobDetailModal';
import { FiBookmark, FiBriefcase, FiFileText } from 'react-icons/fi';

const AlumniSavedItems = () => {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('blogs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const [blogsRes, jobsRes] = await Promise.all([
        alumniApi.getSavedBlogs(),
        alumniApi.getSavedJobs().catch(() => ({ data: { jobs: [] } })),
      ]);
      const blogsData = Array.isArray(blogsRes.data) ? blogsRes.data : (blogsRes.data?.results || []);
      const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.jobs || jobsRes.data?.results || []);
      setSavedBlogs(blogsData);
      setSavedJobs(jobsData);
    } catch (err) {
      setError('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveBlog = async (blogId) => {
    try {
      await alumniApi.saveBlog(blogId); // toggles save
      setSavedBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (err) {
      console.error('Failed to unsave blog:', err);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await alumniApi.saveJob(jobId); // toggles save
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  const filteredBlogs = savedBlogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = savedJobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FiBookmark className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
        </div>
        <p className="text-gray-500">Blogs and jobs you've bookmarked for later</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <FiFileText className="w-6 h-6 text-primary-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary-600">{savedBlogs.length}</p>
          <p className="text-sm text-gray-500">Saved Blogs</p>
        </div>
        <div className="card text-center">
          <FiBriefcase className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-600">{savedJobs.length}</p>
          <p className="text-sm text-gray-500">Saved Jobs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'blogs'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Blogs ({savedBlogs.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Jobs ({savedJobs.length})
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`Search saved ${activeTab}...`}
        />
      </div>

      {/* Error */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : activeTab === 'blogs' ? (
        filteredBlogs.length === 0 ? (
          <EmptyState
            icon={FiBookmark}
            title="No saved blogs yet"
            description="Save blogs from the Blogs page to find them here later"
            actionText="Browse Blogs"
            actionLink="/alumni/blogs"
          />
        ) : (
          <BlogList blogs={filteredBlogs} onViewDetail={setSelectedBlog} />
        )
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No saved jobs yet"
          description="Save jobs you're interested in to review them later"
          actionText="Browse Jobs"
          actionLink="/alumni/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={handleUnsaveJob}
              isSaved={true}
              onViewDetail={setSelectedJob}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BlogDetailModal
        blog={selectedBlog}
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

export default AlumniSavedItems;
