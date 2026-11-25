import { createBrowserRouter, Navigate } from "react-router";
import Layout from "@/components/Layout";
import AkadKpr from "@/pages/AkadKpr";
import AdminChats from "@/pages/admin/AdminChats";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLessons from "@/pages/admin/AdminLessons";
import AdminQuiz from "@/pages/admin/AdminQuiz";
import AdminUsers from "@/pages/admin/AdminUsers";
import Calculate from "@/pages/Calculate";
import Home from "@/pages/Home";
import InvestmentChapter from "@/pages/InvestmentChapter";
import Learn from "@/pages/Learn";
import LessonDetail from "@/pages/LessonDetail";
import Profile from "@/pages/Profile";
import ScBtn from "@/pages/ScBtn";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "learn", element: <Learn /> },
        {
          path: "learn/investasi/:chapterSlug",
          element: <InvestmentChapter />,
        },
        { path: "learn/sc-btn", element: <ScBtn /> },
        { path: "learn/kpr-di-btn", element: <AkadKpr /> },
        { path: "learn/:slug", element: <LessonDetail /> },
        { path: "calculate", element: <Calculate /> },
        { path: "profile", element: <Profile /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "pengguna", element: <AdminUsers /> },
        { path: "materi", element: <AdminLessons /> },
        { path: "kuis", element: <AdminQuiz /> },
        { path: "chat", element: <AdminChats /> },
        { path: "*", element: <Navigate to="/admin" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
