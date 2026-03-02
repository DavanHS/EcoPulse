// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import Loader from './Loader';

export default function ProtectedRoute({ children }) {
    // ── AUTH CHECKER TEMPORARILY DISABLED FOR UI TESTING ── //
    // const { isAuthenticated, loading } = useAuth();

    // if (loading) {
    //   return (
    //     <div className="flex items-center justify-center py-28">
    //       <Loader size="lg" text="Checking authentication..." />
    //     </div>
    //   );
    // }

    // if (!isAuthenticated) {
    //   return <Navigate to="/login" replace />;
    // }

    return children;
}
