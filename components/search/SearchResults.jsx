import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, MessageSquare, User } from 'lucide-react';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');

  // Mock search results
  const allResults = [
    {
      id: '1',
      type: 'post',
      title: 'Getting Started with React',
      excerpt: 'A comprehensive guide to building modern web applications with React...',
      author: 'John Doe',
      date: '2026-01-12',
    },
    {
      id: '2',
      type: 'post',
      title: 'Understanding TypeScript',
      excerpt: 'Learn how TypeScript can improve your development workflow...',
      author: 'Jane Smith',
      date: '2026-01-11',
    },
    {
      id: '3',
      type: 'comment',
      title: 'Great article! Really helped me understand React hooks better.',
      excerpt: 'Comment by Jane Smith on "Getting Started with React"',
      author: 'Jane Smith',
      postTitle: 'Getting Started with React',
    },
    {
      id: '4',
      type: 'user',
      title: 'John Doe',
      excerpt: 'Editor • 15 posts • Joined 2025-05-10',
    },
    {
      id: '5',
      type: 'comment',
      title: 'Could you do a follow-up article on useEffect?',
      excerpt: 'Comment by Alice Brown on "Getting Started with React"',
      author: 'Alice Brown',
      postTitle: 'Getting Started with React',
    },
  ];

  const filteredResults = activeTab === 'all' 
    ? allResults 
    : allResults.filter(r => r.type === (activeTab === 'users' ? 'user' : activeTab.slice(0, -1)));

  const getResultIcon = (type) => {
    switch (type) {
      case 'post':
        return <FileText className="w-5 h-5 text-neutral-500" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-neutral-500" />;
      case 'user':
        return <User className="w-5 h-5 text-neutral-500" />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Results', count: allResults.length },
    { id: 'posts', label: 'Posts', count: allResults.filter(r => r.type === 'post').length },
    { id: 'comments', label: 'Comments', count: allResults.filter(r => r.type === 'comment').length },
    { id: 'users', label: 'Users', count: allResults.filter(r => r.type === 'user').length },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6" />
            <h1 className="text-3xl font-bold text-neutral-900">Search Results</h1>
          </div>
          <p className="text-neutral-600">
            Found {filteredResults.length} result(s) for "<strong>{query}</strong>"
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-2 border-neutral-300 mb-6">
          <div className="flex border-b-2 border-neutral-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'hover:bg-neutral-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="bg-white border-2 border-neutral-300 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-200 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-neutral-600">
              Try adjusting your search terms or browse all posts
            </p>
            <Link
              to="/posts"
              className="inline-block mt-6 px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700"
            >
              Browse All Posts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="bg-white border-2 border-neutral-300 p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getResultIcon(result.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-neutral-200 text-xs uppercase font-medium">
                        {result.type}
                      </span>
                    </div>
                    {result.type === 'post' ? (
                      <Link to={`/posts/${result.id}`}>
                        <h3 className="text-xl font-bold text-neutral-900 hover:underline mb-2">
                          {result.title}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {result.title}
                      </h3>
                    )}
                    <p className="text-neutral-600 mb-3">{result.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      {result.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {result.author}
                        </span>
                      )}
                      {result.date && <span>{result.date}</span>}
                      {result.postTitle && (
                        <span>Posted on: {result.postTitle}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredResults.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <button className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-neutral-900 text-white border-2 border-neutral-900">
              1
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50">
              2
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50">
              3
            </button>
            <button className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
