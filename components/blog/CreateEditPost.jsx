import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { Save, X } from 'lucide-react';

export function CreateEditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState(isEditing ? 'Getting Started with React' : '');
  const [content, setContent] = useState(
    isEditing
      ? 'React is a JavaScript library for building user interfaces...'
      : ''
  );
  const [tags, setTags] = useState(isEditing ? 'React, JavaScript, Frontend' : '');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock save - in real app this would call an API
    navigate('/posts');
  };

  const handleCancel = () => {
    navigate('/posts');
  };

  if (user?.role === 'reader') {
    return (
      <div className="p-8">
        <div className="bg-white border-2 border-neutral-300 p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-neutral-600">You don't have permission to create or edit posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? 'Update your blog post' : 'Write and publish a new blog post'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none text-xl"
                required
              />
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here... Supports markdown formatting."
                className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none min-h-[400px] font-mono text-sm"
                required
              />
              <p className="text-xs text-neutral-500 mt-2">
                Tip: Use markdown syntax for formatting (##, ###, **, *, ```)
              </p>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="guide">Guide</option>
                  <option value="news">News</option>
                  <option value="opinion">Opinion</option>
                  <option value="review">Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Comma-separated tags"
                  className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Example: React, JavaScript, Frontend
                </p>
              </div>
            </div>

            {/* Featured Image Placeholder */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-neutral-300 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-200 mx-auto mb-4"></div>
                <p className="text-neutral-600 mb-2">Upload featured image</p>
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50"
                >
                  Choose File
                </button>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="p-4 bg-neutral-50 border-2 border-neutral-300 mb-6">
              <h3 className="font-medium mb-4">SEO Metadata (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    placeholder="Brief description for search engines..."
                    className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="Primary SEO keyword"
                    className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Publication Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span>Save as Draft</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="published"
                    checked={status === 'published'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span>Publish Now</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {status === 'published' ? 'Publish Post' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-neutral-300 font-medium hover:bg-neutral-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
