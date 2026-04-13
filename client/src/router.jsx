import { createBrowserRouter } from 'react-router-dom';
import { LayoutPage } from './components/layout/layout.jsx';
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import BlogCard from './components/ui/BlogCard.jsx';
import BlogDetails from './pages/Blog_Details.jsx';
import Contact from './pages/ContactUs.jsx';
import HowItWorksPage from './pages/HowItWorks.jsx';
import Services from './pages/Service.jsx';
import Login from "./pages/Login.jsx"
import Register from './pages/register.jsx';
import ProctectedRoutes from './routes/ProctectedRoutes.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'blog/:id',
        element: <BlogCard />,
      },
      {
        path: 'blog/details/:id',
        element: <BlogDetails />,
      },  
      {
        path: 'contact-us',
        element: <Contact />,
      },
      {
        path: 'services',
        element: <Services />,  
      },
      {
        element: <ProctectedRoutes />, // Ye check karega authentication
        children: [
          // Jo bhi routes is block ke andar hongi, wo protect ho jayengi!
          {
             path: 'dashboard',
             element: <div>My Dashboard</div>, // Example: Tumhara Dashboard page
          },
          {
             path: 'create-cv',
             element: <div>CV Builder</div>,   // Example: CV bananay wala page
          }
        ]
      }
    ],
  },
]);

export default router;
