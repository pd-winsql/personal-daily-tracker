# Daily Performance Tracker

## Overview

**Daily Performance Tracker** is a personal productivity and habit-building web application that I built primarily for my own daily use. The core goal of this project is to help me stay consistent with my daily activities by tracking progress in a simple, visual, and motivating way.

The idea came from a recurring challenge I face: losing motivation and consistency with daily routines. Instead of relying on existing productivity apps that don’t fully align with my needs, I decided to build my own solution—one that I can control, improve, and evolve alongside my growth as a developer.

While this project currently exists as a frontend web application, it is intentionally designed in a way that allows future expansion into backend integration and potential cross-platform deployment.

---

## Project Purpose

The main purpose of this project is to **encourage daily action through structure, visibility, and consistency**, rather than relying on motivation alone.

By converting daily routines into a checklist and tracking performance over time, the app aims to:

- Encourage habit formation through repetition
- Provide accountability via visible progress
- Reinforce consistency using positive feedback
- Gamify self-improvement without pressure or punishment

This project is tailored to my personal workflow and challenges, making it practical, meaningful, and sustainable for everyday use.

---

## How It Works

- Users define a set of daily tasks or activities
- Each day presents the same checklist
- Tasks can be marked as completed or incomplete
- Completion progress is calculated dynamically
- Tasks automatically reset at the start of a new day
- Daily completion streaks reward consistency

The system is designed to be simple, predictable, and encouraging.

---

## Current Features (Working)

### Task Management
- Add new daily tasks
- Mark tasks as completed or incomplete
- Delete tasks
- Tasks persist using browser `localStorage`

### Daily Reset Logic
- Tasks automatically reset once per day
- Reset is based on date comparison (not timers)
- Works even if the app is opened later in the day

### Progress Tracking
- Real-time completion percentage
- Visual progress ring using SVG
- Progress updates immediately on task changes

### Streak System
- Streak increases when all tasks are completed for the day
- Streak increments only once per day
- Missing a day resets the streak
- Streak data persists across page refreshes

### UI & Layout
- Clean and minimalist design
- Logical grouping of checkbox, task text, and delete button
- Flexbox-based layout for better spacing and readability

---

## Gamification Approach

Gamification in this project is intentionally **lightweight and supportive**.

The goal is encouragement, not pressure.

Current and planned elements include:

- Daily completion streaks
- Visual progress indicators
- Simple reward-based feedback
- No penalties for missed days—only positive reinforcement

---

## Tech Stack

### Frontend
- HTML5
- CSS3 (Flexbox)
- Vanilla JavaScript

### Data Storage
- Browser `localStorage`

Frameworks were intentionally avoided to strengthen JavaScript fundamentals and simplify future backend integration.

---

## Learning Approach (Using ChatGPT as a Mentor)

This project was built using **ChatGPT as a learning mentor**, not as a copy-paste code generator.

The development process focused on:

- Understanding *why* solutions work
- Building features incrementally from scratch
- Refactoring messy logic into clean, readable code
- Debugging errors before asking for guidance
- Applying real-world programming concepts such as:
  - State management
  - Derived state (progress and streaks)
  - Date-based logic
  - Separation of concerns
  - DOM manipulation patterns

ChatGPT was used to:
- Break problems into manageable steps
- Explain unfamiliar JavaScript concepts
- Guide refactoring decisions
- Encourage best practices and clean structure

This mentorship-style approach significantly improved my confidence in JavaScript and frontend development.

---

## Why I Built This

I built this project to solve two problems:

1. Staying consistent with daily habits
2. Learning how to build a real, usable application

By creating something I actually use, I stay motivated both as a user and as a developer. The project reinforces discipline, problem-solving, and incremental learning.

---

## Current Status

The project is currently at a **stable MVP stage**.

Completed focus areas:
- Core functionality
- Clean and maintainable code structure
- Daily usability

The application is functional and usable on a daily basis.

---

## Future Plans

Planned improvements include:

- Backend integration (PHP or Supabase)
- Cloud synchronization across devices
- Authentication
- Task history and analytics
- Longest streak tracking
- Badges or milestones
- Cross-platform deployment

Features will be added based on actual usage and necessity.

---

## Disclaimer

This is a personal project built for self-improvement and learning. While others are welcome to explore or adapt it, the design decisions primarily reflect my own needs and goals.

---

## Author

**Winjemelron Corpuz**

Aspiring developer building practical projects focused on consistency, discipline, and continuous learning.
