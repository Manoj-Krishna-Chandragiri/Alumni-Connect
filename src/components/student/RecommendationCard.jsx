import { FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';

const RecommendationCard = ({ recommendation }) => {
  const matchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <FiTarget className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recommendation.career}</h3>
            <p className="text-sm text-gray-500">{recommendation.industry}</p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-bold ${matchColor(
            recommendation.matchScore
          )}`}
        >
          {recommendation.matchScore}% Match
        </div>
      </div>

      {/* Match Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Career Match</span>
          <span className="font-medium">{recommendation.matchScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${recommendation.matchScore}%` }}
          />
        </div>
      </div>

      {/* Key Reasons */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Why this is a good fit:
        </h4>
        <ul className="space-y-1">
          {recommendation.reasons?.slice(0, 3).map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <FiTrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Required Skills */}
      {recommendation.requiredSkills && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Key Skills Required:
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendation.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className={`badge ${
                  skill.hasSkill
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {skill.name}
                {skill.hasSkill && ' ✓'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Salary Range */}
      {recommendation.salaryRange && (
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
          <FiAward className="w-4 h-4 text-gray-400" />
          <span>Expected Salary: {recommendation.salaryRange}</span>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
