import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { Calendar, Clock, User, Edit, Trash2 } from 'lucide-react';
import { Comments } from '../comments/Comments';

export function BlogPostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock post data
  const post = {
    id: id || '1',
    title: 'Getting Started with React',
    author: 'John Doe',
    authorId: '1',
    date: '2026-01-12',
    readingTime: '5 min',
    content: `React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular tools for frontend development.

In this article, we'll explore the fundamental concepts of React and how to get started with building your first application.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

## Key Concepts

### Components
Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

### Props
Props are arguments passed into React components. They are passed to components via HTML attributes.

### State
State is a built-in object that is used to contain data or information about the component.

### Hooks
Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Getting Started

To get started with React, you'll need Node.js installed on your computer. Then you can use Create React App to set up a new project:

\`\`\`
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will create a new React application and start the development server.

## Conclusion

React has revolutionized the way we build web applications. Its component-based architecture and virtual DOM make it both powerful and efficient. Whether you're building a simple website or a complex web application, React provides the tools you need to succeed.`,
    tags: ['React', 'JavaScript', 'Frontend'],
  };

  const canEdit = user && (user.role === 'admin' || user.id === post.authorId);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      navigate('/posts');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link to="/posts" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
          ← Back to Posts
        </Link>

        {/* Post Header */}
        <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-neutral-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} read</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-neutral-200 text-sm">{tag}</span>
            ))}
          </div>

          {canEdit && (
            <div className="flex gap-3 pt-6 border-t-2 border-neutral-200">
              <Link
                to={`/posts/${post.id}/edit`}
                className="px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border-2 border-neutral-300 hover:bg-red-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete Post
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
          <div className="prose max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-8 mb-4 first:mt-0">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              } else if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```/g, '').trim();
                return (
                  <pre key={i} className="bg-neutral-100 border border-neutral-300 p-4 my-4 overflow-x-auto">
                    <code className="text-sm">{code}</code>
                  </pre>
                );
              } else {
                return (
                  <p key={i} className="mb-4 text-neutral-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Comments Section */}
        <Comments postId={post.id} />
      </div>
    </div>
  );
}
