import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { Loader, ErrorAlert, Pagination, ConfirmModal, Modal } from '../../components/shared';
import {
  FiUsers, FiCheckCircle, FiBriefcase, FiMapPin,
  FiSearch, FiEye, FiTrash2, FiChevronDown,
} from 'react-icons/fi';
import { DEPARTMENTS_LIST, BRANCH_FULL_NAMES } from '../../utils/rollNumberUtils';

const DEPT_LABEL = (code) => {
  if (!code) return '\u2013';
  const upper = code.toUpperCase();
  if (BRANCH_FULL_NAMES[upper]) return BRANCH_FULL_NAMES[upper];
  const found = DEPARTMENTS_LIST.find((d) => d.value === code.toLowerCase() || d.short === upper);
  return found ? found.label : upper;
};

const StatCard = ({ icon: Icon, label, value, colorClass, bgClass, borderClass }) => (
  <div className={`rounded-xl border ${borderClass} ${bgClass} p-5 flex items-center gap-4 shadow-sm`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 shadow-sm flex-shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wide opacity-80 ${colorClass}`}>{label}</p>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

const AlumniAvatar = ({ alumni }) => {
  const name = alumni.name || 'Alumni';
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const deptKey = (alumni.department || '').toLowerCase();
  const gradient = {
    cse: 'from-blue-400 to-blue-600', csm: 'from-indigo-400 to-indigo-600',
    ece: 'from-purple-400 to-purple-600', eee: 'from-yellow-400 to-yellow-600',
    mec: 'from-orange-400 to-orange-600', civ: 'from-stone-400 to-stone-600',
    it: 'from-pink-400 to-pink-600', aid: 'from-rose-400 to-rose-600',
    aiml: 'from-violet-400 to-violet-600', cso: 'from-cyan-400 to-cyan-600',
    cic: 'from-teal-400 to-teal-600',
  }[deptKey] || 'from-green-400 to-emerald-600';

  if (alumni.avatar) {
    return (
      <img
        src={alumni.avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm flex-shrink-0`}>
      {initials}
    </div>
  );
};

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [deleteAlumni, setDeleteAlumni] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => { fetchAlumni(); }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAlumni();
      const raw = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      const transformed = raw.map((profile) => ({
        id: profile.id,
        userId: profile.user?.id || profile.user?.uid,
        name: profile.user?.full_name || `${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`.trim() || 'Unknown',
        email: profile.user?.email || '',
        avatar: profile.user?.avatar || null,
        department: profile.department || '',
        company: profile.current_company || '',
        position: profile.current_position || '',
        graduationYear: profile.graduation_year,
        location: profile.location || '',
        verified: profile.is_verified,
        active: profile.user?.is_active !== false,
        roll_number: profile.roll_no || '',
        skills: profile.skills || [],
      }));

      setAlumni(transformed);
    } catch (err) {
      setError('Failed to load alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setProcessing(true);
      const id = deleteAlumni.userId || deleteAlumni.id;
      await adminApi.deactivateAlumni(id);
      setDeleteAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError('Failed to update alumni status');
    } finally {
      setProcessing(false);
    }
  };

  const filteredAlumni = alumni.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q);
    const matchDept = !deptFilter || a.department?.toLowerCase() === deptFilter;
    const matchVerified =
      !verifiedFilter ||
      (verifiedFilter === 'verified' && a.verified) ||
      (verifiedFilter === 'pending' && !a.verified);
    return matchSearch && matchDept && matchVerified;
  });

  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const verifiedCount = alumni.filter((a) => a.verified).length;
  const companiesCount = new Set(alumni.map((a) => a.company).filter(Boolean)).size;
  const activeCount = alumni.filter((a) => a.active !== false).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#A8422F] via-[#C4503A] to-[#E77E69] rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">Manage Alumni</h1>
        <p className="text-rose-100 mt-1 text-sm">View and manage all alumni accounts and verifications</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiUsers}       label="Total Alumni" value={alumni.length}  colorClass="text-emerald-700" bgClass="bg-emerald-50" borderClass="border-emerald-200" />
        <StatCard icon={FiCheckCircle} label="Verified"     value={verifiedCount}  colorClass="text-teal-700"   bgClass="bg-teal-50"   borderClass="border-teal-200" />
        <StatCard icon={FiBriefcase}   label="Companies"    value={companiesCount} colorClass="text-cyan-700"   bgClass="bg-cyan-50"   borderClass="border-cyan-200" />
        <StatCard icon={FiUsers}       label="Active"       value={activeCount}    colorClass="text-indigo-700" bgClass="bg-indigo-50" borderClass="border-indigo-200" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, email, company..."
              className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-9 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS_LIST.map((d) => (
                <option key={d.value} value={d.value}>{d.short} - {d.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={verifiedFilter}
              onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-3 pr-9 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {(searchQuery || deptFilter || verifiedFilter) && (
            <button
              onClick={() => { setSearchQuery(''); setDeptFilter(''); setVerifiedFilter(''); setCurrentPage(1); }}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium px-3 py-2.5 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
          <div className="sm:ml-auto flex items-center text-sm text-gray-500 px-1 whitespace-nowrap">
            <span className="font-semibold text-gray-700">{filteredAlumni.length}</span>&nbsp;alumni
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumni</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dept / Batch</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedAlumni.map((alum) => (
                  <tr key={alum.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <AlumniAvatar alumni={alum} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-gray-900 truncate">{alum.name}</p>
                            {alum.verified && <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{alum.roll_number || alum.email}</p>
                          {alum.roll_number && <p className="text-xs text-gray-400 truncate">{alum.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {alum.company ? (
                        <>
                          <div className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
                            <FiBriefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[160px]">{alum.company}</span>
                          </div>
                          {alum.position && <p className="text-xs text-gray-400 mt-0.5 ml-5 truncate">{alum.position}</p>}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-200">
                        {alum.department?.toUpperCase() || '-'}
                      </span>
                      {alum.graduationYear && (
                        <p className="text-xs text-gray-400 mt-0.5">Class of {alum.graduationYear}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {alum.location ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FiMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{alum.location}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${alum.verified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${alum.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {alum.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedAlumni(alum)}
                          title="View details"
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteAlumni(alum)}
                          title="Toggle status"
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedAlumni.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <FiSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No alumni found</p>
                {(searchQuery || deptFilter || verifiedFilter) && (
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {!loading && filteredAlumni.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAlumni.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteAlumni}
        onClose={() => setDeleteAlumni(null)}
        onConfirm={handleDeactivate}
        title="Toggle Alumni Status"
        message={`Are you sure you want to ${deleteAlumni?.active ? 'deactivate' : 'reactivate'} ${deleteAlumni?.name}'s account?`}
        confirmText={processing ? 'Processing...' : deleteAlumni?.active ? 'Deactivate' : 'Reactivate'}
        variant="danger"
      />

      {selectedAlumni && (
        <Modal
          isOpen={!!selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
          title="Alumni Details"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <AlumniAvatar alumni={selectedAlumni} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedAlumni.name}</h3>
                  {selectedAlumni.verified && <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <p className="text-sm text-gray-500 truncate">{selectedAlumni.email}</p>
                {selectedAlumni.roll_number && (
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedAlumni.roll_number}</p>
                )}
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${selectedAlumni.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${selectedAlumni.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {selectedAlumni.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Department</p>
                <p className="text-sm font-bold text-gray-900">{selectedAlumni.department?.toUpperCase() || '-'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{DEPT_LABEL(selectedAlumni.department)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Graduation</p>
                <p className="text-sm font-bold text-gray-900">{selectedAlumni.graduationYear ? `Class of ${selectedAlumni.graduationYear}` : '-'}</p>
              </div>
              {selectedAlumni.company && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Company</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{selectedAlumni.company}</p>
                  {selectedAlumni.position && <p className="text-xs text-gray-500 mt-0.5 truncate">{selectedAlumni.position}</p>}
                </div>
              )}
              {selectedAlumni.location && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Location</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAlumni.location}</p>
                </div>
              )}
            </div>

            {selectedAlumni.skills?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAlumni.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setDeleteAlumni(selectedAlumni); setSelectedAlumni(null); }}
                className="flex-1 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
              >
                {selectedAlumni.active ? 'Deactivate Account' : 'Reactivate Account'}
              </button>
              <button
                onClick={() => setSelectedAlumni(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageAlumni;
