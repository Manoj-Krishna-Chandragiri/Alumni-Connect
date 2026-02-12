import { useState, useRef, useEffect } from 'react';
import { FiThumbsUp, FiHeart } from 'react-icons/fi';
import { HiOutlineLightBulb, HiOutlineHand } from 'react-icons/hi';
import { MdOutlineCelebration } from 'react-icons/md';
import { BsQuestionCircle } from 'react-icons/bs';

const REACTIONS = [
  { type: 'like', icon: FiThumbsUp, label: 'Like', color: 'text-blue-600', bgColor: 'bg-blue-600', hoverBg: 'hover:bg-blue-50' },
  { type: 'heart', icon: FiHeart, label: 'Love', color: 'text-red-500', bgColor: 'bg-red-500', hoverBg: 'hover:bg-red-50' },
  { type: 'insightful', icon: HiOutlineLightBulb, label: 'Insightful', color: 'text-yellow-500', bgColor: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-50' },
  { type: 'support', icon: HiOutlineHand, label: 'Support', color: 'text-purple-600', bgColor: 'bg-purple-600', hoverBg: 'hover:bg-purple-50' },
  { type: 'celebrate', icon: MdOutlineCelebration, label: 'Celebrate', color: 'text-green-600', bgColor: 'bg-green-600', hoverBg: 'hover:bg-green-50' },
  { type: 'curious', icon: BsQuestionCircle, label: 'Curious', color: 'text-gray-600', bgColor: 'bg-gray-600', hoverBg: 'hover:bg-gray-50' },
];

const ReactionsPopup = ({ isOpen, onSelect, onClose, currentReaction }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-2xl border border-gray-200 px-3 py-2 z-50 flex items-center gap-2"
      style={{ animation: 'slideUp 0.2s ease-out' }}
      onClick={(e) => e.stopPropagation()}
    >
      {REACTIONS.map((reaction) => {
        const Icon = reaction.icon;
        return (
          <button
            key={reaction.type}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(reaction.type);
            }}
            className={`flex flex-col items-center p-2.5 rounded-lg transition-all transform hover:scale-125 ${
              currentReaction === reaction.type ? reaction.hoverBg : 'hover:bg-gray-50'
            }`}
            title={reaction.label}
          >
            <Icon className={`w-5 h-5 ${currentReaction === reaction.type ? reaction.color : 'text-gray-600'}`} />
          </button>
        );
      })}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReactionsPopup;
export { REACTIONS };
