import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RoleBasedRedirect from '../components/RoleBasedRedirect';

// Admin pages
import AdminLayout from '../pages/Admin/AdminLayout';
import UserManagement from '../pages/Admin/UserManagement';

// UMM pages
import UMMLayout from '../pages/UMM/UMMLayout';
import FacultiesManagement from '../pages/UMM/faculties/FacultiesManagement';
import FacultyDetailView from '../pages/UMM/faculties/FacultyDetail';
import ContributionsInFaculty from '../pages/UMM/faculties/facultyDetail/topic/contributions/Contributions';

// FMC pages
import FMCLayout from '../pages/FMC/FMCLayout';
import FMCDashboard from '../pages/FMC/FMCDashboard';
import ContributionsInTopic from '../pages/FMC/topic/submission/ContributionsInTopic';

// Guest pages
import GuestLayout from '../pages/Guest/GuestLayout';
import GuestDashboard from '../pages/Guest/GuestDashboard';

// Student pages
import StudentDashboard from '../pages/Student/StudentDashboard';
import StudentLayout from '../pages/Student/StudentLayout';
import TopicDetail from '../pages/Student/topics/topicDetail';
import CreateSubmission from '../pages/Student/topics/Submission/CreateSubmission';

//Auth pages
import SignUpPage from '../pages/public/SignUpPage';
import LoginPage from '../pages/public/LoginPage';

// Public pages
import TermsAndConditions from '../pages/Student/TermsAndConditions';
import LandingPage from '../pages/public/LandingPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import ResetPasswordSuccess from '../pages/public/ResetPasswordSuccess';
import Unauthorized from '../pages/public/Unauthorized';
import NotFound from '../pages/public/NotFound';
import Profile from '../pages/public/Profile';

const AppRouter = () => {
    const ROLE_IDS = {
        Admin: "64f000000000000000000011",
        UMM: "64f000000000000000000012",
        FMC: "64f000000000000000000013",
        Student: "64f000000000000000000014",
        Guest: "64f000000000000000000015"
    };
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/reset-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Role-based redirect */}
                <Route path="/redirect" element={<RoleBasedRedirect />} />

                {/* Admin Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.Admin]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<UserManagement />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* UMM Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.UMM]} />}>
                    <Route path="/umm" element={<UMMLayout />}>
                        <Route index element={<FacultiesManagement />} />
                        <Route path="faculty/:facultyId/:facultyName" element={<FacultyDetailView />} />
                        <Route path="topic/:topicId/:topicName/contributions" element={<ContributionsInFaculty />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* FMC Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.FMC]} />}>
                    <Route path="/fmc" element={<FMCLayout />}>
                        <Route index element={<FMCDashboard />} />
                        <Route path="topic/:topicId/:topicName/:endDate" element={<ContributionsInTopic />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Student Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.Student]} />}>
                    <Route path="/student" element={<StudentLayout />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path="topic/:topicId/:topicName/:endDate" element={<TopicDetail />} />
                        <Route path="topic/:topicId/:topicName/create-submission" element={<CreateSubmission />} />
                        <Route path="terms" element={<TermsAndConditions />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Guest Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.Guest]} />}>
                    <Route path="/guest" element={<GuestLayout />}>
                        <Route index element={<GuestDashboard />} />
                        <Route path="/guest/profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
