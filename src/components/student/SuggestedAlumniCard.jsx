import { FiMapPin, FiBriefcase, FiMail, FiMessageCircle } from 'react-icons/fi';

const SuggestedAlumniCard = ({ alumni, matchReason }) => {
  return (
    <div className="card-hover">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {alumni.avatar ? (
            <img
              src={alumni.avatar}
              alt={alumni.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary-600">
              {alumni.firstName?.[0]}{alumni.lastName?.[0]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">
            {alumni.firstName} {alumni.lastName}
          </h3>
          <p className="text-sm text-primary-600 font-medium">
            {alumni.currentPosition}
          </p>

          <div className="mt-2 space-y-1">
            {alumni.company && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiBriefcase className="w-4 h-4" />
                <span className="truncate">{alumni.company}</span>
              </div>
            )}
            {alumni.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiMapPin className="w-4 h-4" />
                <span className="truncate">{alumni.location}</span>
              </div>
            )}
          </div>

          {/* Match Reason */}
          {matchReason && (
            <div className="mt-3 p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700">
                <span className="font-medium">Why suggested: </span>
                {matchReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2">
          <FiMail className="w-4 h-4" />
          <span>Email</span>
        </button>
        <button className="flex-1 btn-primary flex items-center justify-center gap-2 py-2">
          <FiMessageCircle className="w-4 h-4" />
          <span>Connect</span>
        </button>
      </div>
    </div>
  );
};

export default SuggestedAlumniCard;
