# SciBitHub

**SciBitHub** is a collaborative web platform for launching, contributing to, and discussing citizen science projects.  
It connects researchers, contributors, and curious minds to engage in data collection, annotation tasks, and open scientific discussions.

![preview](screenshots/preview.jpeg)

---

## 🌍 Features

- 🧪 Create and manage research projects
- 🔉 Contribute to tasks by submitting annotations or files
- ✅ Validate task contributions
- 💬 Participate in open discussions, debates & dedicated project forums
- 👍 Upvote/downvote content and like projects
- 📈 Visualize project results with graphs and statistics
- 👤 Role-based access: visitors, contributors, researchers, admins
- 🔒 Content moderation and reporting system
- 📚 Bookmark projects and discussions for quick access
- 📊 Admin dashboard for monitoring platform activity
- 📥 Download collected data for research projects

---

## 🚀 Tech Stack

- **Frontend & Backend**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Storage**:
  - Profile/Project images → Supabase Storage
  - Datasets & file uploads (audio/images) → Local [MinIO](https://min.io/)
- **Styling**: Tailwind CSS + ShadCN UI
- **Realtime**: Supabase Realtime
- **Visualization**: Recharts
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Icons**: Lucide
- **Markdown support**: `@uiw/react-md-editor`

---

## 📸 Screenshots

#### Project overview

![](screenshots/project.jpeg)

#### Task page (data labelling task)

![](screenshots/task.jpeg)

#### Discussion page

![](screenshots/discussion.png)