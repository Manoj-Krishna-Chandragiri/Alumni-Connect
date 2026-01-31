import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import aiApi from '../../api/ai.api';
import {
  RecommendationCard,
  MatchProgressBar,
  ReasonList,
  SuggestedAlumniCard,
} from '../../components/student';
import { Loader, ErrorAlert, StatsCard } from '../../components/shared';
import { FiTarget, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const AICareer = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [suggestedAlumni, setSuggestedAlumni] = useState([]);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [recResponse, alumniResponse, skillResponse] = await Promise.all([
        aiApi.getCareerRecommendations(user?.id),
        aiApi.getSuggestedAlumni(user?.id),
        aiApi.getSkillAnalysis(user?.id),
      ]);

      setRecommendations(recResponse.data);
      setSuggestedAlumni(alumniResponse.data);
      setSkillAnalysis(skillResponse.data);
    } catch (err) {
      setError('Failed to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <FiTarget className="w-6 h-6" />
          <h1 className="text-2xl font-bold">AI Career Recommendations</h1>
        </div>
        <p className="text-purple-100">
          Personalized career paths based on your skills, interests, and profile
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Top Match Score"
          value={`${recommendations[0]?.matchScore || 0}%`}
          icon={FiTarget}
          color="purple"
        />
        <StatsCard
          title="Career Paths"
          value={recommendations.length}
          icon={FiTrendingUp}
          color="blue"
        />
        <StatsCard
          title="Skills Matched"
          value={skillAnalysis?.matchedSkills || 0}
          icon={FiAward}
          color="green"
        />
        <StatsCard
          title="Alumni Mentors"
          value={suggestedAlumni.length}
          icon={FiUsers}
          color="orange"
        />
      </div>

      {/* Skill Analysis */}
      {skillAnalysis && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Skill Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <MatchProgressBar
                label="Technical Skills"
                value={skillAnalysis.technicalScore || 75}
                color="primary"
              />
              <MatchProgressBar
                label="Soft Skills"
                value={skillAnalysis.softSkillsScore || 80}
                color="green"
              />
              <MatchProgressBar
                label="Industry Knowledge"
                value={skillAnalysis.industryScore || 60}
                color="blue"
              />
              <MatchProgressBar
                label="Leadership"
                value={skillAnalysis.leadershipScore || 55}
                color="yellow"
              />
            </div>
            <div className="space-y-4">
              <ReasonList
                type="positive"
                reasons={
                  skillAnalysis.strengths || [
                    'Strong programming fundamentals',
                    'Good problem-solving abilities',
                    'Active participation in projects',
                  ]
                }
              />
              <ReasonList
                type="negative"
                reasons={
                  skillAnalysis.improvements || [
                    'Consider learning cloud technologies',
                    'Enhance communication skills',
                    'Gain more industry exposure',
                  ]
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Career Recommendations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recommended Career Paths
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Suggested Alumni */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Alumni Who Can Guide You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedAlumni.map((alumni, index) => (
            <SuggestedAlumniCard
              key={index}
              alumni={alumni}
              matchReason={alumni.matchReason}
            />
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recommended Next Steps
        </h2>
        <div className="space-y-3">
          {[
            'Complete your profile to get better recommendations',
            'Connect with suggested alumni for mentorship',
            'Enroll in recommended courses to fill skill gaps',
            'Attend upcoming networking events',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                {index + 1}
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AICareer;
