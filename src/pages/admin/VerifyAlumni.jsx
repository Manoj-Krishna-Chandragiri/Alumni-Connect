import { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { AlumniVerificationTable } from '../../components/admin';
import { Modal, Loader, ErrorAlert, ConfirmModal } from '../../components/shared';

const VerifyAlumni = () => {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [verifyAlumni, setVerifyAlumni] = useState(null);
  const [rejectAlumni, setRejectAlumni] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingAlumni();
  }, []);

  const fetchPendingAlumni = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPendingAlumni();
      setPendingAlumni(response.data);
    } catch (err) {
      setError('Failed to load pending alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setProcessing(true);
      await adminApi.verifyAlumni(verifyAlumni.id);
      setVerifyAlumni(null);
      fetchPendingAlumni();
    } catch (err) {
      setError('Failed to verify alumni');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await adminApi.rejectAlumni(rejectAlumni.id);
      setRejectAlumni(null);
      fetchPendingAlumni();
    } catch (err) {
      setError('Failed to reject alumni');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verify Alumni</h1>
        <p className="text-gray-500">
          Review and verify alumni registration requests
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Stats */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-orange-800">
          <span className="font-semibold">{pendingAlumni.length}</span> alumni pending verification
        </p>
      </div>

      {/* Verification Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <AlumniVerificationTable
          alumni={pendingAlumni}
          onView={(alum) => setSelectedAlumni(alum)}
          onVerify={(alum) => setVerifyAlumni(alum)}
          onReject={(alum) => setRejectAlumni(alum)}
        />
      )}

      {/* View Alumni Modal */}
      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title="Alumni Details"
        size="lg"
      >
        {selectedAlumni && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedAlumni.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlumni.name)}&background=6366f1&color=fff&size=128`}
                alt={selectedAlumni.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedAlumni.name}
                </h3>
                <p className="text-gray-500">{selectedAlumni.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{selectedAlumni.department}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Graduation Year</p>
                <p className="font-medium text-gray-900">{selectedAlumni.graduationYear}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-medium text-gray-900">{selectedAlumni.rollNo || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Applied On</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedAlumni.appliedOn).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Verification Documents */}
            {selectedAlumni.documents && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAlumni.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setSelectedAlumni(null);
                  setRejectAlumni(selectedAlumni);
                }}
                className="btn-secondary text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedAlumni(null);
                  setVerifyAlumni(selectedAlumni);
                }}
                className="btn-primary"
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Verify Confirmation */}
      <ConfirmModal
        isOpen={!!verifyAlumni}
        onClose={() => setVerifyAlumni(null)}
        onConfirm={handleVerify}
        title="Verify Alumni"
        message={`Are you sure you want to verify ${verifyAlumni?.name}? They will gain access to alumni features.`}
        confirmText={processing ? 'Verifying...' : 'Verify'}
        variant="primary"
      />

      {/* Reject Confirmation */}
      <ConfirmModal
        isOpen={!!rejectAlumni}
        onClose={() => setRejectAlumni(null)}
        onConfirm={handleReject}
        title="Reject Alumni"
        message={`Are you sure you want to reject ${rejectAlumni?.name}'s application? This action cannot be undone.`}
        confirmText={processing ? 'Rejecting...' : 'Reject'}
        variant="danger"
      />
    </div>
  );
};

export default VerifyAlumni;
