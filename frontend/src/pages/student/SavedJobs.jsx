import { useState, useEffect } from 'react';
import studentApi from '../../api/student.api';
import { JobCard } from '../../components/student';
import { SearchBar, Loader, ErrorAlert, EmptyState } from '../../components/shared';
import { FiBookmark, FiFilter } from 'react-icons/fi';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getSavedJobs();
      console.log('Saved jobs response:', response);
      setSavedJobs(response.data.jobs || []);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await studentApi.unsaveJob(jobId);
      // Remove from local state
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      const errorMsg = err.response?.data?.message || 'Failed to remove bookmark. Please try again.';
      alert(errorMsg);
    }
  };

  const filteredJobs = savedJobs.filter((job) => {
    const matchesSearch = !searchQuery || 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills_required?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !filterType || job.job_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const jobTypes = ['All', 'full_time', 'part_time', 'internship', 'contract'];
  const jobTypeLabels = {
    'All': 'All',
    'full_time': 'Full-time',
    'part_time': 'Part-time',
    'internship': 'Internship',
    'contract': 'Contract'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FiBookmark className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        </div>
        <p className="text-gray-500">
          Jobs you've bookmarked for later review
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{savedJobs.length}</p>
          <p className="text-sm text-gray-500">Total Saved</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {savedJobs.filter((j) => j.job_type === 'full_time').length}
          </p>
          <p className="text-sm text-gray-500">Full-time</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">
            {savedJobs.filter((j) => j.job_type === 'internship').length}
          </p>
          <p className="text-sm text-gray-500">Internships</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-600">
            {savedJobs.filter((j) => j.is_remote || j.location?.toLowerCase().includes('remote')).length}
          </p>
          <p className="text-sm text-gray-500">Remote</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search saved jobs..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === 'All' ? '' : type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (filterType === '' && type === 'All') || filterType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {jobTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Saved Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No saved jobs yet"
          description="Bookmark jobs you're interested in to find them here later"
          actionText="Browse Jobs"
          actionLink="/student/jobs"
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={FiFilter}
          title="No jobs match your filters"
          description="Try adjusting your search criteria"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onSave={handleUnsaveJob}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
