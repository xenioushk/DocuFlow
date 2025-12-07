# DocuFlow 📚

A modern, full-stack knowledge base SaaS application built with Next.js 15, TypeScript, and PostgreSQL. Create, organize, and share documentation with a beautiful rich text editor and powerful search capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15.0.7-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.1.0-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🔐 **Authentication** - Secure user registration and login with NextAuth.js
- 📝 **Rich Text Editor** - Powered by Tiptap with markdown support
- 🏢 **Multi-tenant Architecture** - Separate workspaces for organizations
- 📂 **Categories** - Organize articles with custom categories
- 🔍 **Full-text Search** - Find content instantly across all articles
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Server-side Rendering** - Fast page loads with Next.js 15
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS
- 🔄 **Loading States** - Skeleton loaders for better UX
- 🛡️ **Error Handling** - Comprehensive error boundaries

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js v5
- **Editor**: Tiptap with extensions
- **Deployment**: Vercel
- **Validation**: Zod, React Hook Form

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/xenioushk/DocuFlow.git
cd DocuFlow
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Add your environment variables:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Seed demo data (optional)**

```bash
npm run seed
```

## 🏃 Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

**Demo credentials** (if seeded):

- Email: `demo@docuflow.com`
- Password: `demo123`

## 🏗️ Project Structure

```
docuflow/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API routes
│   └── components/          # Reusable components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   └── validations.ts      # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
└── public/                 # Static assets
```

## 📸 Screenshots

### Dashboard

Modern dashboard with workspace overview and quick actions.

### Rich Text Editor

Powerful editor with formatting, links, code blocks, and more.

### Article Management

Create, edit, and organize articles with categories.

### Search

Fast full-text search across all your documentation.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed demo data
- `npm run lint` - Run ESLint

## 🌐 Deployment

This application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (your Vercel URL)
4. Deploy!

## 📝 Environment Variables

| Variable       | Description                   | Required |
| -------------- | ----------------------------- | -------- |
| `DATABASE_URL` | PostgreSQL connection string  | Yes      |
| `AUTH_SECRET`  | Random secret for NextAuth.js | Yes      |
| `AUTH_URL`     | Base URL of your application  | Yes      |

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mahbub Alam Khan**

- GitHub: [@xenioushk](https://github.com/xenioushk)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [Tiptap](https://tiptap.dev) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [NextAuth.js](https://next-auth.js.org) - Authentication

---

Built with ❤️ using Next.js 15 and TypeScript
