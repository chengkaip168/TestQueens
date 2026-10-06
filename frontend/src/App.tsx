import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { ReactNode, useContext, useEffect, useRef } from 'react'
import LoginPage from './pages/loginpage'
import HomePage from './pages/homepage'
import MockTest from './pages/mocktest'
import SignUpPage from './pages/signUpPage'
import AdminPage from './pages/adminpage'
import TutorPage from './pages/tutorpage'
import ResultsPage from './pages/resultsPage'
import ParentPage from './pages/parentPage'
import PerformancePage from './pages/performancePage'
import ResetPasswordPage from './pages/resetPasswordPage'
import PrivacyPage from './pages/privacyPage'
import TermsPage from './pages/termsPage'
import { UserContext } from './components/userContext'
import { supabase } from './supabase-client'
import { useState } from 'react'
import { User } from './components/types'

// Listens for Supabase PASSWORD_RECOVERY event and redirects to the reset page.
// Must live inside <Router> to use useNavigate.
function AuthChangeHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  return null;
}

const ROUTE_TITLES: [RegExp, string][] = [
  [/^\/$/,                 'Sign in'],
  [/^\/signUp/,            'Create an account'],
  [/^\/reset-password/,    'Reset your password'],
  [/^\/privacy/,           'Privacy Policy'],
  [/^\/terms/,             'Terms of Service'],
  [/^\/home/,              'Home'],
  [/^\/performance/,       'Performance'],
  [/^\/mock\//,            'Test in progress'],
  [/^\/results\//,         'Results'],
  [/^\/admin/,             'Admin'],
  [/^\/tutor/,             'Tutor'],
  [/^\/parent/,            'Parent portal'],
];

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const match = ROUTE_TITLES.find(([pattern]) => pattern.test(pathname));
    document.title = match ? `${match[1]} | TestQueens` : 'TestQueens | SHSAT Practice Tests';
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children, adminOnly = false, tutorOnly = false, parentOnly = false, studentOnly = false }: {
  children: ReactNode; adminOnly?: boolean; tutorOnly?: boolean; parentOnly?: boolean; studentOnly?: boolean;
}) {
  const user = useContext(UserContext);
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user === null) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/home" replace />;
  if (tutorOnly && user.role !== 'tutor') return <Navigate to="/home" replace />;
  if (parentOnly && user.role !== 'parent') return <Navigate to="/home" replace />;
  if (studentOnly && user.role === 'admin') return <Navigate to="/admin" replace />;
  if (studentOnly && user.role === 'tutor') return <Navigate to="/tutor" replace />;
  if (studentOnly && user.role === 'parent') return <Navigate to="/parent" replace />;
  return <>{children}</>;
}

// Supabase needs a moment to pull a recovery/magic-link token out of the URL hash, and
// during that window the router sees an unmatched path. Wait it out before calling it a 404.
function UnknownRoute() {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSettled(true), 1500);
    return () => clearTimeout(id);
  }, []);

  if (!settled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-500">That link doesn't lead anywhere.</p>
      <a href="#/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
        Go to sign in
      </a>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  // Tracks the auth uid of the currently loaded user profile.
  // Used to suppress auth events that fire for the same user (e.g. SIGNED_IN
  // after a background token refresh when the tab regains focus).
  const loadedUserIdRef = useRef<string | null>(null);

  async function getUser() {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      setUser(null);
      loadedUserIdRef.current = null;
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', authUser.id)
      .single();
    if (profileError || !profile) {
      setUser(null);
      loadedUserIdRef.current = null;
      return;
    }
    setUser({
      id: authUser.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
    });
    loadedUserIdRef.current = authUser.id;
  }

  useEffect(() => {
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Silent background events, never disrupt the current page:
      // TOKEN_REFRESHED: JWT silently renewed; session user is unchanged.
      // Any event for the same user (SIGNED_IN, USER_UPDATED, etc.): the profile hasn't
      //   changed, so re-fetching is unnecessary and dangerous, the RLS SELECT uses
      //   auth.uid() which can transiently return null during JWT exchange, causing
      //   getUser() to find zero rows and call setUser(null), logging the user out mid-test.
      if (event === 'TOKEN_REFRESHED') return;
      if (session && loadedUserIdRef.current === session.user.id) return;

      if (session) {
        setUser(undefined); // show loading spinner while profile fetch completes
        getUser();
      } else {
        setUser(null);
        loadedUserIdRef.current = null;
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={user}>
        <AuthChangeHandler />
        <RouteTitle />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected routes, require authentication */}
          <Route path="/home" element={<ProtectedRoute studentOnly><HomePage /></ProtectedRoute>} />
          <Route path="/performance" element={<ProtectedRoute studentOnly><PerformancePage /></ProtectedRoute>} />
          <Route path="/performance/:studentId" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
          <Route path="/mock/:testID" element={<ProtectedRoute studentOnly><MockTest /></ProtectedRoute>} />
          <Route path="/results/:testID" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />

          {/* Admin-only route */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

          {/* Tutor-only route */}
          <Route path="/tutor" element={<ProtectedRoute tutorOnly><TutorPage /></ProtectedRoute>} />

          {/* Parent-only route */}
          <Route path="/parent" element={<ProtectedRoute parentOnly><ParentPage /></ProtectedRoute>} />

          <Route path="*" element={<UnknownRoute />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
