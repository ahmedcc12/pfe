import { useScrollToTop } from './hooks/use-scroll-to-top';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

import PersistLogin from 'src/utils/PersistLogin';
import AdminSections from 'src/routes/adminSections';
import UserSections from 'src/routes/userSections';
import Login from './pages/shared/login';
import ForgotPasswordPage from './pages/shared/forgotPassword';
import ResetPasswordPage from './pages/shared/resetPassword';
import PublicRoute from './routes/publicRoute';
import NotFound from 'src/pages/shared/page-not-found';

function App() {
  useScrollToTop();

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route element={<RequireAuth allowedRoles={['user', 'admin']} />}>
          <Route path="/*" element={<UserSections />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminSections />} />
        </Route>
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="resetpassword/:token" element={<ResetPasswordPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
