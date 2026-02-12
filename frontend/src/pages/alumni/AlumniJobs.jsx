import { useState, useEffect } from 'react';
import alumniApi from '../../api/alumni.api';
import { JobForm, JobList } from '../../components/alumni';
import { JobCard } from '../../components/student';
import { Modal, SearchBar, Loader, ErrorAlert, ConfirmModal } from '../../components/shared';
import JobDetailModal from '../../components/shared/JobDetailModal';
import { FiPlus, FiBriefcase } from 'react-icons/fi';

const AlumniJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [allJobsRes, myJobsRes] = await Promise.all([
        alumniApi.getJobs(),
        alumniApi.getMyJobs(),
      ]);
      // Handle paginated response (results array) or direct array
      const allJobsData = Array.isArray(allJobsRes.data) 
        ? allJobsRes.data 
        : allJobsRes.data?.results || [];
      const myJobsData = Array.isArray(myJobsRes.data) 
        ? myJobsRes.data 
        : myJobsRes.data?.results || [];
      setJobs(allJobsData);
      setMyJobs(myJobsData);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      setSaving(true);
      await alumniApi.createJob(jobData);
      setShowJobForm(false);
      fetchJobs();
    } catch (err) {
      setError('Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      setSaving(true);
      await alumniApi.updateJob(editingJob.id, jobData);
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      setError('Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await alumniApi.deleteJob(deleteJob.id);
      setDeleteJob(null);
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const response = await alumniApi.saveJob(jobId);
      console.log('Save response:', response);
      // Optionally refresh jobs to update saved status
      // fetchJobs();
    } catch (err) {
      console.error('Failed to save job:', err);
      // Show user-friendly error message
      const errorMsg = err.response?.data?.message || 'Failed to bookmark job. Please try refreshing the page.';
      alert(errorMsg);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs & Internships</h1>
          <p className="text-gray-500">
            Post and manage job opportunities for students
          </p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Post New Job
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
          All Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Jobs ({myJobs.length})
        </button>
      </div>

      {/* Search */}
      {activeTab === 'all' && (
        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search jobs..."
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onSave={handleSaveJob} />
          ))}
        </div>
      ) : (
        <JobList
          jobs={myJobs}
          onEdit={(job) => setEditingJob(job)}
          onView={(job) => setViewingJob(job)}
        />
      )}

      {/* Job Detail Modal */}
      <JobDetailModal
        job={viewingJob}
        isOpen={!!viewingJob}
        onClose={() => setViewingJob(null)}
      />

      {/* Create Job Modal */}
      <Modal
        isOpen={showJobForm}
        onClose={() => setShowJobForm(false)}
        title="Post New Job"
        size="lg"
      >
        <JobForm
          onSubmit={handleCreateJob}
          onCancel={() => setShowJobForm(false)}
          loading={saving}
        />
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title="Edit Job"
        size="lg"
      >
        <JobForm
          job={editingJob}
          onSubmit={handleUpdateJob}
          onCancel={() => setEditingJob(null)}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteJob?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AlumniJobs;
