import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RoleBasedRedirect from '../components/RoleBasedRedirect';

// Common pages

// Admin pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserManagement from '../pages/Admin/UserManagement';
// import SystemSettings from '../pages/Admin/SystemSettings';

// FMC pages
import FMCDashboard from '../pages/FMC/FMCDashboard';
import Contributions from '../pages/FMC/Contributions';
import ContributionDetail from '../pages/FMC/ContributionDetail';

// Guest pages
import GuestDashboard from '../pages/Guest/GuestDashboard';

// Student pages
import StudentDashboard from '../pages/Student/StudentDashboard';
import SubmitContribution from '../pages/Student/SubmitContribution';
import TermsAndConditions from '../pages/Student/TermsAndConditions';

// UMM pages
import UMMDashboard from '../pages/UMM/UMMDashboard';
import DownloadContributions from '../pages/UMM/DownloadContributions';
import LandingPage from '../pages/public/LandingPage';
import SignUpPage from '../pages/public/SignUpPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import ResetPasswordSuccess from '../pages/public/ResetPasswordSuccess';
import Unauthorized from '../pages/public/Unauthorized';
import NotFound from '../pages/public/NotFound';
import LoginPage from '../pages/public/LoginPage';
import AdminLayout from '../pages/Admin/AdminLayout';
import FMCLayout from '../pages/FMC/FMCLayout';
import StudentLayout from '../pages/Student/StudentLayout';
import UMMLayout from '../pages/UMM/UMMLayout';
// import CreateUser from '../pages/Admin/CreateUser';
import Profile from '../pages/public/Profile';
import FacultiesManagement from '../pages/UMM/faculties/FacultiesManagement';
import FacultyDetailView from '../pages/UMM/faculties/FacultyDetail';
import ContributionsInFaculty from '../pages/UMM/faculties/contributions/Contributions';
import TopicDetail from '../pages/Student/topics/topicDetail';
import CreateSubmission from '../pages/Student/topics/Submission/createSubmission';

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
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        {/* <Route path="create-users" element={<CreateUser />} /> */}
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* UMM Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.UMM]} />}>
                    <Route path="/umm" element={<UMMLayout />}>
                        <Route index element={<UMMDashboard />} />
                        <Route path="faculties" element={<FacultiesManagement />} />
                        <Route path="faculty/:facultyId/:facultyName" element={<FacultyDetailView />} />
                        <Route path="topic/:topicId/:topicName/contributions" element={<ContributionsInFaculty />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="downloads" element={<DownloadContributions />} />
                    </Route>
                </Route>

                {/* FMC Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.FMC]} />}>
                    <Route path="/fmc" element={<FMCLayout />}>
                        <Route index element={<FMCDashboard />} />
                        <Route path="contributions" element={<Contributions />} />
                        <Route path="contributions/:id" element={<ContributionDetail />} />
                    </Route>
                </Route>

                {/* Student Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.Student]} />}>
                    <Route path="/student" element={<StudentLayout />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path="topic/:topicId/:topicName" element={<TopicDetail />} />
                        <Route path="topic/:topicId/:topicName/create-submission" element={<CreateSubmission />} />
                        <Route path="submit" element={<SubmitContribution />} />
                        <Route path="terms" element={<TermsAndConditions />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>



                {/* Guest Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLE_IDS.Guest]} />}>
                    <Route path="/guest" element={<GuestDashboard />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
