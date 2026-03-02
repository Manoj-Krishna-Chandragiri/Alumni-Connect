import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiThumbsUp, FiMessageCircle, FiRepeat, FiSend, FiX, FiLink, FiTwitter, FiLinkedin, FiCheck, FiHeart, FiGlobe, FiBookmark, FiFlag } from 'react-icons/fi';
import { HiOutlineDotsHorizontal, HiOutlineLightBulb, HiOutlineHand } from 'react-icons/hi';
import { MdOutlineCelebration } from 'react-icons/md';
import { BsQuestionCircle } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/student.api';
import alumniApi from '../../api/alumni.api';
import { formatRelativeTime } from '../../utils/timeUtils';
import ReactionsPopup, { REACTIONS } from '../shared/ReactionsPopup';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const BlogCard = ({ blog, onRead, onViewDetail }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const shareMenuRef = useRef(null);
  const [isLiked, setIsLiked] = useState(blog.is_liked || false);
  const [userReaction, setUserReaction] = useState(blog.user_reaction || null);
  const [likesCount, setLikesCount] = useState(blog.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(blog.comments_count || 0);
  const [sharesCount, setSharesCount] = useState(blog.shares_count || 0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(blog.is_saved || false);
  const [savingPost, setSavingPost] = useState(false);
  const optionsMenuRef = useRef(null);

  // Use appropriate API based on user role
  const api = user?.role === 'alumni' ? alumniApi : studentApi;

  // Extract media from content
  const extractMediaFromContent = (content) => {
    if (!content) return [];
    const media = [];
    
    // Extract markdown images: ![alt](url)
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      media.push({ type: 'image', url: match[1] });
    }
    
    // Extract HTML images: <img src="url" />
    const htmlImageRegex = /<img[^>]+src="([^"]+)"/g;
    while ((match = htmlImageRegex.exec(content)) !== null) {
      media.push({ type: 'image', url: match[1] });
    }
    
    // Extract HTML videos: <video>...<source src="url" ...
    const videoRegex = /<source[^>]+src="([^"]+)"/g;
    while ((match = videoRegex.exec(content)) !== null) {
      media.push({ type: 'video', url: match[1] });
    }
    
    return media;
  };

  const contentMedia = isExpanded ? extractMediaFromContent(blog.content) : [];

  // Remove media from content for text display
  const getCleanContent = (content) => {
    if (!content) return '';
    let cleaned = content;
    // Remove markdown images
    cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '');
    // Remove HTML images
    cleaned = cleaned.replace(/<img[^>]*>/g, '');
    // Remove HTML videos
    cleaned = cleaned.replace(/<video[^>]*>.*?<\/video>/gs, '');
    return cleaned;
  };

  // Reaction icons map
  const REACTION_ICONS = {
    like: FiThumbsUp,
    heart: FiHeart,
    insightful: HiOutlineLightBulb,
    support: HiOutlineHand,
    celebrate: MdOutlineCelebration,
    curious: BsQuestionCircle,
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    if (showShareMenu || showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu, showOptionsMenu]);

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (blog.author) {
      const role = blog.author.role;
      if (role === 'alumni') {
        navigate(`/alumni/directory?profile=${blog.author.id}`);
      } else if (role === 'student') {
        navigate(`/student/profile/${blog.author.id}`);
      }
    }
  };

  const handleLikeButtonPress = (e) => {
    e.stopPropagation();
    // Toggle reactions menu
    setShowReactions(!showReactions);
  };

  const handleReaction = async (reactionType) => {
    if (likingPost) return;

    try {
      setLikingPost(true);
      const isSameReaction = userReaction === reactionType;
      const wasLiked = isLiked;
      const prevReaction = userReaction;
      const prevCount = likesCount;
      
      // Optimistic update
      if (isSameReaction) {
        // Remove reaction
        setUserReaction(null);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Add or change reaction
        setUserReaction(reactionType);
        setIsLiked(true);
        setLikesCount(prev => wasLiked ? prev : prev + 1);
      }
      setShowReactions(false);

      const response = await api.likeBlog(blog.id);
      
      // Force update with server response
      if (response?.data) {
        setLikesCount(response.data.likes_count || (isSameReaction ? prevCount - 1 : prevCount + 1));
        setIsLiked(response.data.liked !== undefined ? response.data.liked : !isSameReaction);
      }
    } catch (error) {
      // Revert on error
      setUserReaction(prevReaction);
      setIsLiked(wasLiked);
      setLikesCount(prevCount);
      console.error('Failed to react to blog:', error);
    } finally {
      setLikingPost(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    // If user already has a reaction, remove it. Otherwise add default 'like'
    if (isLiked) {
      await handleReaction(userReaction);
    } else {
      await handleReaction('like');
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setShowCommentBox(!showCommentBox);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const response = await api.addBlogComment(blog.id, { content: commentText });
      
      // Add new comment to list and update count
      if (response.data) {
        setComments([response.data, ...comments]);
        setCommentsCount(prev => prev + 1);
        setShowComments(true); // Show comments after posting
      }
      setCommentText('');
      setShowCommentBox(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleCommentsClick = async (e) => {
    e.stopPropagation();
    if (!showComments && comments.length === 0) {
      // Load comments
      try {
        setLoadingComments(true);
        const response = await api.getBlogComments(blog.id);
        const data = response.data;
        setComments(Array.isArray(data) ? data : (data?.results || []));
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  // Get unique reactions from blog (mock data - in real app this would come from backend)
  const getUniqueReactions = () => {
    if (likesCount === 0) return [];
    // For now, show the reactions based on the blog's reaction data
    // In a real app, the backend would return {reactions: [{type: 'like', count: 5}, {type: 'heart', count: 3}]}
    const reactions = [];
    if (userReaction) {
      const reactionConfig = REACTIONS.find(r => r.type === userReaction);
      if (reactionConfig) reactions.push(reactionConfig);
    }
    // Add default like if no user reaction but has likes
    if (reactions.length === 0 && likesCount > 0) {
      reactions.push(REACTIONS[0]); // Default to 'like'
    }
    return reactions;
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const blogUrl = `${window.location.origin}/blogs/${blog.id}`;
    
    try {
      await navigator.clipboard.writeText(blogUrl);
      setLinkCopied(true);
      setSharesCount(prev => prev + 1);
      
      // Call API to track share if available
      if (api.shareBlog) {
        try {
          await api.shareBlog(blog.id, { platform: 'link' });
        } catch (err) {
          console.log('Share tracking not available:', err);
        }
      }
      
      setTimeout(() => {
        setLinkCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = async (platform, e) => {
    e.stopPropagation();
    const blogUrl = `${window.location.origin}/blogs/${blog.id}`;
    const text = `Check out this blog: ${blog.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blogUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
        break;
      default:
        return;
    }
    
    // Update shares count
    setSharesCount(prev => prev + 1);
    
    // Call API to track share if available
    if (api.shareBlog) {
      try {
        await api.shareBlog(blog.id, { platform });
      } catch (error) {
        console.log('Share tracking not available:', error);
      }
    }
    
    // Open share window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  // Get reaction display info
  const getReactionDisplay = () => {
    if (!userReaction) return null;
    return REACTIONS.find(r => r.type === userReaction);
  };

  const handleSaveBlog = async (e) => {
    e.stopPropagation();
    if (savingPost) return;
    try {
      setSavingPost(true);
      const newSaved = !isSaved;
      setIsSaved(newSaved);
      await api.saveBlog(blog.id);
    } catch (error) {
      setIsSaved(isSaved); // revert
      console.error('Failed to save blog:', error);
    } finally {
      setSavingPost(false);
      setShowOptionsMenu(false);
    }
  };

  const currentReactionDisplay = getReactionDisplay();

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-3 hover:shadow-sm transition-shadow">
      {/* Author Header - Exact LinkedIn Style */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between relative">
          <div className="flex gap-2">
            <button
              onClick={handleAuthorClick}
              className="w-12 h-12 rounded-full flex-shrink-0 hover:opacity-80 transition-opacity overflow-hidden"
            >
              {blog.author?.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleAuthorClick}
                  className="font-semibold text-sm text-gray-900 hover:text-blue-600 hover:underline"
                >
                  {blog.author?.full_name || 'Anonymous'}
                </button>
                {blog.author?.verified && (
                  <span className="text-blue-600 text-xs">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {blog.author?.headline || (blog.author?.role === 'alumni' ? 'Alumni' : 'Student')}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{formatRelativeTime(blog.created_at)}</span>
                <span>•</span>
                <FiGlobe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(!showOptionsMenu); }}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            <HiOutlineDotsHorizontal className="w-5 h-5" />
          </button>
          {showOptionsMenu && (
            <div
              ref={optionsMenuRef}
              className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50 min-w-48"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleSaveBlog}
                disabled={savingPost}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
              >
                <FiBookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-primary-600' : ''}`} />
                <span>{isSaved ? 'Unsave post' : 'Save post'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.id}`);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
              >
                <FiLink className="w-4 h-4" />
                <span>Copy link</span>
              </button>
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-red-500"
              >
                <FiFlag className="w-4 h-4" />
                <span>Report post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content - Now shows full content with Read More */}
      <div className="px-4 pb-3">
        {/* Title and excerpt */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-sm text-gray-700 mb-2">{blog.excerpt}</p>
          )}
        </div>
      </div>

      {/* Cover Image - LinkedIn Style (Full Width, No Padding on Sides) */}
      {(blog.cover_image || blog.coverImage) && !isExpanded && (
        <div 
          className="cursor-pointer hover:opacity-95 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <img
            src={blog.cover_image || blog.coverImage}
            alt={blog.title}
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}
      
      {/* Expanded cover image */}
      {(blog.cover_image || blog.coverImage) && isExpanded && (
        <div className="w-full">
          <img
            src={blog.cover_image || blog.coverImage}
            alt={blog.title}
            className="w-full object-cover"
            style={{ maxHeight: '600px' }}
          />
        </div>
      )}

      {/* Media Gallery - Below Cover Image */}
      {isExpanded && contentMedia.length > 0 && (
        <div className="w-full">
          {contentMedia.length === 1 && (
            <div className="w-full">
              {contentMedia[0].type === 'image' ? (
                <img src={contentMedia[0].url} alt="Content" className="w-full object-cover" style={{ maxHeight: '500px' }} />
              ) : (
                <video src={contentMedia[0].url} autoPlay muted loop playsInline className="w-full" style={{ maxHeight: '500px' }} />
              )}
            </div>
          )}
          
          {contentMedia.length === 2 && (
            <div className="grid grid-cols-2 gap-1">
              {contentMedia.map((item, idx) => (
                <div key={idx} className="w-full" style={{ height: '300px' }}>
                  {item.type === 'image' ? (
                    <img src={item.url} alt={`Content ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {contentMedia.length === 3 && (
            <div className="grid grid-cols-2 gap-1">
              <div className="row-span-2" style={{ height: '400px' }}>
                {contentMedia[0].type === 'image' ? (
                  <img src={contentMedia[0].url} alt="Content 1" className="w-full h-full object-cover" />
                ) : (
                  <video src={contentMedia[0].url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                )}
              </div>
              <div style={{ height: '199px' }}>
                {contentMedia[1].type === 'image' ? (
                  <img src={contentMedia[1].url} alt="Content 2" className="w-full h-full object-cover" />
                ) : (
                  <video src={contentMedia[1].url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                )}
              </div>
              <div style={{ height: '199px' }}>
                {contentMedia[2].type === 'image' ? (
                  <img src={contentMedia[2].url} alt="Content 3" className="w-full h-full object-cover" />
                ) : (
                  <video src={contentMedia[2].url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          )}
          
          {contentMedia.length === 4 && (
            <div className="grid grid-cols-2 gap-1">
              {contentMedia.map((item, idx) => (
                <div key={idx} style={{ height: '250px' }}>
                  {item.type === 'image' ? (
                    <img src={item.url} alt={`Content ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {contentMedia.length > 4 && (
            <div className="grid grid-cols-2 gap-1">
              {contentMedia.slice(0, 4).map((item, idx) => (
                <div key={idx} className="relative" style={{ height: '250px' }}>
                  {item.type === 'image' ? (
                    <img src={item.url} alt={`Content ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  )}
                  {idx === 3 && contentMedia.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">+{contentMedia.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Text Content */}
      <div className="px-4 pb-3">
        {/* Full Content */}
        {blog.content && (
          <div className="mt-3">
            <div 
              className={`prose prose-sm max-w-none text-gray-800 ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Hide all media - they're shown in gallery above
                  img: () => null,
                  video: () => null,
                  iframe: () => null,
                  h1: ({node, ...props}) => <h1 className="text-base font-bold" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-sm font-bold" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-semibold" {...props} />,
                  p: ({node, ...props}) => <p className="text-sm leading-relaxed" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                }}
              >
                {isExpanded ? getCleanContent(blog.content) : blog.content}
              </ReactMarkdown>
            </div>
            {!isExpanded && blog.content.length > 300 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="text-sm text-gray-600 font-semibold hover:text-gray-900 mt-2"
              >
                ...see more
              </button>
            )}
          </div>
        )}

        {/* Tags at the end */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {blog.tags.map((tag, index) => (
              <span key={index} className="text-xs text-blue-600 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Section - Exact LinkedIn Style */}
      <div className="px-4 py-2">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 pb-2">
          <div className="flex items-center gap-1 hover:underline hover:text-blue-600 cursor-pointer">
            {likesCount > 0 && (
              <>
                <div className="flex items-center -space-x-1">
                  {getUniqueReactions().slice(0, 3).map((reaction, idx) => {
                    const Icon = reaction.icon;
                    return (
                      <div 
                        key={idx}
                        className={`w-4 h-4 ${reaction.bgColor} rounded-full flex items-center justify-center text-white border-2 border-white`}
                      >
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                    );
                  })}
                </div>
                <span>{likesCount}</span>
              </>
            )}
            {likesCount === 0 && <span>0</span>}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCommentsClick}
              className="hover:underline hover:text-blue-600 cursor-pointer"
            >
              {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </button>
            <span className="hover:underline hover:text-blue-600 cursor-pointer">
              {sharesCount} reposts
            </span>
          </div>
        </div>

        {/* Action Buttons - LinkedIn Style */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-200">
          <div className="flex-1 relative">
            <button 
              onClick={handleLikeButtonPress}
              disabled={likingPost}
              className={`w-full flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded transition-colors ${
                isLiked ? `${currentReactionDisplay?.color || 'text-blue-600'} font-semibold` : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {currentReactionDisplay ? (
                <currentReactionDisplay.icon className="w-5 h-5" />
              ) : (
                <FiThumbsUp className="w-5 h-5" />
              )}
              <span className="text-sm font-semibold">
                {currentReactionDisplay ? currentReactionDisplay.label : 'Like'}
              </span>
            </button>
            {showReactions && (
              <ReactionsPopup
                isOpen={showReactions}
                onSelect={handleReaction}
                onClose={() => setShowReactions(false)}
                currentReaction={userReaction}
              />
            )}
          </div>
          <button 
            onClick={handleComment}
            className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiMessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Comment</span>
          </button>
          <div className="flex-1 relative">
            <button 
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiRepeat className="w-5 h-5" />
              <span className="text-sm font-semibold">Repost</span>
            </button>
            
            {/* Share Menu Dropdown */}
            {showShareMenu && (
              <div 
                ref={shareMenuRef}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 min-w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  {linkCopied ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Link copied!</span>
                    </>
                  ) : (
                    <>
                      <FiLink className="w-4 h-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => handleSocialShare('linkedin', e)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  <FiLinkedin className="w-4 h-4 text-blue-600" />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={(e) => handleSocialShare('twitter', e)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  <FiTwitter className="w-4 h-4 text-sky-500" />
                  <span>Share on Twitter</span>
                </button>
              </div>
            )}
          </div>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 rounded text-gray-600 hover:text-gray-900 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Open email client with blog link
              const blogUrl = `${window.location.origin}/blogs/${blog.id}`;
              const subject = encodeURIComponent(`Check out: ${blog.title}`);
              const body = encodeURIComponent(`I thought you might find this interesting:\n\n${blog.title}\n${blogUrl}`);
              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}
          >
            <FiSend className="w-5 h-5" />
            <span className="text-sm font-semibold">Send</span>
          </button>
        </div>

        {/* Comments List */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-3 mb-4">
              {loadingComments ? (
                <div className="text-center py-4 text-gray-500 text-sm">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No comments yet. Be the first to comment!</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {comment.author?.avatar ? (
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm text-gray-900">
                          {comment.author?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-3">
                        {formatRelativeTime(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Comment Box */}
        {showCommentBox && (
          <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  disabled={submittingComment}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCommentBox(false);
                      setCommentText('');
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    disabled={submittingComment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingComment ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
