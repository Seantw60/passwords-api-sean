import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { Calendar, User, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export function BlogPostList() {
  const { user } = useAuth();
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const mockPosts = [
    {
      id: '1',
      title: 'Getting Started with React',
      author: 'John Doe',
      authorId: '1',
      date: '2026-01-12',
      readingTime: '5 min',
      excerpt: 'A comprehensive guide to building modern web applications with React...',
      status: 'published',
      tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
      id: '2',
      title: 'Understanding TypeScript',
      author: 'Jane Smith',
      authorId: '2',
      date: '2026-01-11',
      readingTime: '8 min',
      excerpt: 'Learn how TypeScript can improve your development workflow...',
      status: 'published',
      tags: ['TypeScript', 'JavaScript'],
    },
    {
      id: '3',
      title: 'Advanced CSS Techniques',
      author: 'Bob Johnson',
      authorId: '3',
      date: '2026-01-10',
      readingTime: '6 min',
      excerpt: 'Explore advanced CSS features like Grid, Flexbox, and animations...',
      status: 'published',
      tags: ['CSS', 'Design', 'Frontend'],
    },
    {
      id: '4',
      title: 'JavaScript Best Practices',
      author: 'Alice Brown',
      authorId: '4',
      date: '2026-01-09',
      readingTime: '7 min',
      excerpt: 'Essential patterns and practices every JavaScript developer should know...',
      status: 'published',
      tags: ['JavaScript', 'Best Practices'],
    },
    {
      id: '5',
      title: 'Web Performance Optimization',
      author: 'Charlie Wilson',
      authorId: '5',
      date: '2026-01-08',
      readingTime: '10 min',
      excerpt: 'Techniques for making your web applications faster and more efficient...',
      status: 'published',
      tags: ['Performance', 'Optimization'],
    },
  ];

  const canEdit = user && (user.role === 'admin' || user.role === 'editor');

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPosts(mockPosts.map(p => p.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId, checked) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const totalPages = Math.ceil(mockPosts.length / postsPerPage);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Blog Posts</h1>
          <p className="text-neutral-600">Manage and view all blog posts</p>
        </div>
        {canEdit && (
          <Link
            to="/posts/create"
            className="px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700"
          >
            Create New Post
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-neutral-300 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h2 className="font-bold">Filters</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Author</label>
            <input
              type="text"
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              placeholder="Filter by author..."
              className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Keyword</label>
            <input
              type="text"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Date Range</label>
            <select className="w-full px-3 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none">
              <option>All time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {canEdit && selectedPosts.length > 0 && (
        <div className="bg-neutral-100 border-2 border-neutral-300 p-4 mb-6 flex items-center justify-between">
          <span className="font-medium">{selectedPosts.length} post(s) selected</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 border-2 border-neutral-300 bg-white hover:bg-neutral-50">
              Bulk Edit
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 bg-white hover:bg-neutral-50">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Post List */}
      <div className="bg-white border-2 border-neutral-300">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b-2 border-neutral-300 bg-neutral-50 font-medium">
          {canEdit && (
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedPosts.length === mockPosts.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          )}
          <div className={canEdit ? 'col-span-5' : 'col-span-6'}>Title</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Post Rows */}
        {mockPosts.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b-2 border-neutral-200 last:border-b-0 hover:bg-neutral-50"
          >
            {canEdit && (
              <div className="col-span-1 flex items-start pt-1">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            )}
            <div className={canEdit ? 'col-span-5' : 'col-span-6'}>
              <Link to={`/posts/${post.id}`} className="font-medium text-neutral-900 hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-neutral-600 mt-1">{post.excerpt}</p>
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-neutral-200 text-xs">{tag}</span>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-2 pt-1">
              <User className="w-4 h-4 text-neutral-400 mt-0.5" />
              <span className="text-sm">{post.author}</span>
            </div>
            <div className="col-span-2 flex items-start gap-2 pt-1">
              <Calendar className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div>
                <div className="text-sm">{post.date}</div>
                <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime}
                </div>
              </div>
            </div>
            <div className="col-span-2 pt-1">
              <span className={`px-3 py-1 text-xs font-medium ${
                post.status === 'published' ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-700'
              }`}>
                {post.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          Showing {(currentPage - 1) * postsPerPage + 1} to {Math.min(currentPage * postsPerPage, mockPosts.length)} of {mockPosts.length} posts
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border-2 ${
                currentPage === i + 1
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
