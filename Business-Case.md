# What Problem Are We Solving?

## The Situation

A small company wants to build a **blog website where many people can write**. The website needs to be safe and secure. It needs to work well as more people start using it. Different types of users should be able to do different things.

They want to build a **new website** that works correctly and safely, even if it takes a bit longer to make.

## What We Want to Build

The website must:

1. **Keep user accounts and private info safe**

   * Safe login system
   * Strong password rules
   * Safe way to reset passwords

2. **Let different types of users do different things**

   * Readers can look at blog posts
   * Writers can create and edit their own posts
   * Admins can manage everything and everyone

3. **Make it easy to manage blog posts**

   * Create, change, and delete blog posts
   * Change or delete many posts at once safely

4. **Let people talk about posts**

   * Comments under blog posts
   * People can reply to comments (like a conversation)
   * Search and organize comments easily

5. **Make sure data stays correct**

   * Users, posts, and comments stay connected properly
   * No lost or broken data
   * When changing many things, either everything works or nothing changes

6. **Prevent problems before they happen**

   * Check all data before saving it
   * Run tests to catch problems early
   * When things break, we know why

## Other Important Things

* **Safety First**: Never trust what users send - always check it
* **Track Everything**: Know who did what and when
* **Handle Growth**: Work well even with lots of users and posts
* **Easy to Change**: New programmers can add features safely
* **Always Works**: When something breaks, data stays safe

## Rules We Must Follow

To build what we want, we must:

* **Check data on the server** to stop bad or dangerous information
* **Control who can do what** at the main system level
* **Change many things safely** - if one fails, undo everything
* **Plan our data carefully** with clear connections
* **Write tests** for important features and tricky situations

(These rules explain why we use Next.js, Prisma, Zod, Vitest, and Postgres.)

## How We Know We Won

The project works when:

* People can only see and change what they're allowed to
* Bad data never gets saved
* When changing many things, everything works or nothing changes
* Comment replies show up correctly no matter how deep they go
* Tests cover all the important things users do
* We can add new features without breaking what already works

## Why This Helps Students Learn

This project is like **real programming jobs**:

* You solve *real problems*, not just write code for fun
* Every feature has a reason
* Every test prevents future problems
* Every safety check stops bad things from happening