import { useState } from 'react';
import { useAuth } from '../../App';
import { MessageSquare, Edit, Trash2, Reply } from 'lucide-react';

export function Comments({ postId }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Mock nested comments data
  const [comments, setComments] = useState([
    {
      id: '1',
      postId,
      author: 'Jane Smith',
      authorId: '2',
      content: 'Great article! Really helped me understand React hooks better.',
      timestamp: '2 hours ago',
      parentId: null,
      replies: [
        {
          id: '2',
          postId,
          author: 'John Doe',
          authorId: '1',
          content: 'Thanks! Glad you found it helpful.',
          timestamp: '1 hour ago',
          parentId: '1',
        },
        {
          id: '3',
          postId,
          author: 'Bob Johnson',
          authorId: '3',
          content: 'I agree, this is one of the clearest explanations I\'ve seen.',
          timestamp: '1 hour ago',
          parentId: '1',
          replies: [
            {
              id: '4',
              postId,
              author: 'Jane Smith',
              authorId: '2',
              content: 'Absolutely! The examples really make it easy to understand.',
              timestamp: '45 minutes ago',
              parentId: '3',
            },
          ],
        },
      ],
    },
    {
      id: '5',
      postId,
      author: 'Alice Brown',
      authorId: '4',
      content: 'Could you do a follow-up article on useEffect? That would be amazing!',
      timestamp: '3 hours ago',
      parentId: null,
    },
  ]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Math.random().toString(36),
      postId,
      author: user?.name || 'Anonymous',
      authorId: user?.id || '0',
      content: newComment,
      timestamp: 'Just now',
      parentId: null,
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleSubmitReply = (parentId) => {
    if (!replyContent.trim()) return;

    const reply = {
      id: Math.random().toString(36),
      postId,
      author: user?.name || 'Anonymous',
      authorId: user?.id || '0',
      content: replyContent,
      timestamp: 'Just now',
      parentId,
    };

    // In a real app, this would be handled with proper nested data structure
    setReplyTo(null);
    setReplyContent('');
  };

  const handleEdit = (commentId, content) => {
    setEditingId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = (commentId) => {
    // Mock edit - in real app would update via API
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      // Mock delete - in real app would delete via API
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  const canEdit = (authorId) => {
    return user && (user.role === 'admin' || user.id === authorId);
  };

  const renderComment = (comment, depth = 0) => {
    const isEditing = editingId === comment.id;
    const isReplying = replyTo === comment.id;
    const maxDepth = 4;
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 16)} pl-6 border-l-2 border-neutral-300` : '';

    return (
      <div key={comment.id} className={`${indentClass}`}>
        <div className="bg-neutral-50 border-2 border-neutral-300 p-4 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-neutral-400 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author}</span>
                <span className="text-xs text-neutral-500">{comment.timestamp}</span>
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="px-3 py-1 bg-neutral-900 text-white text-sm hover:bg-neutral-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border-2 border-neutral-300 text-sm hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-700">{comment.content}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {depth < maxDepth && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            )}
            {canEdit(comment.authorId) && !isEditing && (
              <>
                <button
                  onClick={() => handleEdit(comment.id, comment.content)}
                  className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>

          {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-neutral-400">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none mb-2"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="px-4 py-2 bg-neutral-900 text-white text-sm hover:bg-neutral-700"
                >
                  Submit Reply
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border-2 border-neutral-300 text-sm hover:bg-neutral-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-neutral-300 p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" />
        <h2 className="font-bold text-xl">Comments ({comments.length})</h2>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Add a comment
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => renderComment(comment, 0))
        )}
      </div>
    </div>
  );
}
