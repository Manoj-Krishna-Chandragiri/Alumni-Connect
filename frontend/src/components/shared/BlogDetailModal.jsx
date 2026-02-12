import { useState, useEffect } from 'react';
import { FiX, FiUser, FiThumbsUp, FiMessageCircle, FiSend, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/student.api';
import alumniApi from '../../api/alumni.api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { formatRelativeTime, formatDate } from '../../utils/timeUtils';

const BlogDetailModal = ({ blog, isOpen, onClose }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(blog?.is_liked || false);
  const [likesCount, setLikesCount] = useState(blog?.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(blog?.comments_count || 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

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

  const contentMedia = blog ? extractMediaFromContent(blog.content) : [];

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

  useEffect(() => {
    if (isOpen && blog?.id) {
      fetchComments();
    }
  }, [isOpen, blog?.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await api.getBlogComments(blog.id);
      setComments(response.data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (likingPost) return;

    try {
      setLikingPost(true);
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      
      // Optimistic update
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      const response = await api.likeBlog(blog.id);
      
      // Update with server response if available
      if (response.data?.likes_count !== undefined) {
        setLikesCount(response.data.likes_count);
        setIsLiked(response.data.liked);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(likesCount);
      console.error('Failed to like blog:', error);
    } finally {
      setLikingPost(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const response = await api.addBlogComment(blog.id, { content: commentText });
      
      // Add new comment to list
      if (response.data) {
        setComments([response.data, ...comments]);
        setCommentsCount(prev => prev + 1);
      }
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
              {blog.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Author Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {blog.author?.avatar ? (
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {blog.author?.full_name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatRelativeTime(blog.created_at)} • <FiEye className="inline w-4 h-4" /> {blog.views_count} views
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="w-full">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Media Gallery - Below Cover Image */}
            {contentMedia.length > 0 && (
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

            {/* Blog Content - Rich Text with Markdown */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Hide all media - they're shown in gallery above
                    img: () => null,
                    video: () => null,
                    iframe: () => null,
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {getCleanContent(blog.content)}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-4 border-t border-gray-200">
              <div className="flex items-center gap-4 py-4">
                <button
                  onClick={handleLike}
                  disabled={likingPost}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isLiked
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-semibold">{likesCount}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  <FiMessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{commentsCount}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="px-6 pb-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-4">
                Comments ({commentsCount})
              </h3>

              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  disabled={submittingComment}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {loadingComments ? (
                  <div className="text-center py-4 text-gray-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {comment.author?.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg px-4 py-2">
                          <p className="font-semibold text-sm text-gray-900">
                            {comment.author?.full_name || 'Anonymous'}
                          </p>
                          <p className="text-gray-700 mt-1">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-4">
                          {formatRelativeTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
