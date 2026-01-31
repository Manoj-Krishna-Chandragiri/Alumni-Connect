import { useState, useEffect } from 'react';
import studentApi from '../../api/student.api';
import { JobCard } from '../../components/student';
import { SearchBar, Loader, ErrorAlert, EmptyState } from '../../components/shared';
import { FiBriefcase, FiFilter } from 'react-icons/fi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getJobs(filters);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jobs & Internships</h1>
        <p className="text-gray-500">
          Explore opportunities posted by alumni
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{jobs.length}</p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {jobs.filter((j) => j.type === 'Full-time').length}
          </p>
          <p className="text-sm text-gray-500">Full-time</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">
            {jobs.filter((j) => j.type === 'Internship').length}
          </p>
          <p className="text-sm text-gray-500">Internships</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-orange-600">
            {jobs.filter((j) => j.type === 'Remote' || j.location === 'Remote').length}
          </p>
          <p className="text-sm text-gray-500">Remote</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value })}
            placeholder="Search jobs, companies, skills..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() =>
                setFilters({ ...filters, type: type === 'All' ? '' : type })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (filters.type === '' && type === 'All') ||
                filters.type === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No jobs found"
          description="No jobs match your search criteria"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs
            .filter(
              (job) =>
                (!filters.type || job.type === filters.type) &&
                (!filters.search ||
                  job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                  job.company.toLowerCase().includes(filters.search.toLowerCase()))
            )
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
