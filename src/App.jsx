import { Route, Routes } from "react-router-dom";
import AppInitializer from "./components/AppInitializer";
import MaintenancePage from "./components/common/MaintenancePage";
import MemberForm from "./components/MemberList/MemberForm";
import ProtectedLayout from "./components/ProtectedLayout";
import VersionCheck from "./components/VersionCheck";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignIn from "./pages/auth/SignIn";
import EventAttendMember from "./pages/event/EventAttendMember";
import EventList from "./pages/event/EventList";
import EvenRegisterList from "./pages/eventregister/EventRegisterList";
import EventDetailsPage from "./pages/eventtrack/EventDetailsPage";
import EventTrackList from "./pages/eventtrack/EventTrackList";
import Dashboard from "./pages/home/Dashboard";
import DyPatronPage from "./pages/member/DyPatronPage";
import LifeMembersPage from "./pages/member/LifeMembersPage";
import PatronPage from "./pages/member/PatronPage";
import Profile from "./pages/profile/Profile";
import EventDetailsReport from "./pages/report/EventDetailsReport/EventDetailsReport";
import EventReport from "./pages/report/EventReport/EventReport";
import DyPatronReport from "./pages/report/MemberReport/DyPatron";
import LifeMemberReport from "./pages/report/MemberReport/LifeMemberReport";
import PatronReport from "./pages/report/MemberReport/PatronReport";
import NotRegisterNotScanned from "./pages/report/NotregisteredNotScanned/NotRegisterNotScanned";
import RegisteredNotScanned from "./pages/report/registerednotscanned/RegisteredNotScanned";
import OldUsers from "./pages/oldusers/OldUsers";
import NotFoundPage from "./components/common/not-found";
import MIDIssued from "./pages/midissued/MIDIssued";
import NewUsers from "./pages/newusers/NewUsers";
import ShiftedDiedUsers from "./pages/shifteddiedusers/ShiftedDiedUsers";

function App() {
  return (
    <AppInitializer>
      <VersionCheck />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/maintenance" element={<MaintenancePage />} />

        <Route
          path="*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/event" element={<EventList />} />
                <Route
                  path="/event-attend-member/:id"
                  element={<EventAttendMember />}
                />
                <Route path="/event-register" element={<EvenRegisterList />} />
                <Route path="/event-track" element={<EventTrackList />} />

                <Route path="/life-member" element={<LifeMembersPage />} />
                <Route path="/patron" element={<PatronPage />} />
                <Route path="/dy-patron" element={<DyPatronPage />} />
                <Route path="/old-users" element={<OldUsers />} />
                <Route path="/new-users" element={<NewUsers />} />
                <Route
                  path="/shifted-died-users"
                  element={<ShiftedDiedUsers />}
                />
                <Route
                  path="/members/edit/:memberId"
                  element={<MemberForm />}
                />
                <Route path="/event-details" element={<EventDetailsPage />} />
                <Route
                  path="/report-life-member"
                  element={<LifeMemberReport />}
                />
                <Route path="/report-patron" element={<PatronReport />} />
                <Route path="/report-dy-patron" element={<DyPatronReport />} />
                <Route path="/report-event" element={<EventReport />} />
                <Route
                  path="/report-event-details"
                  element={<EventDetailsReport />}
                />
                <Route
                  path="/report-register-notscanned"
                  element={<RegisteredNotScanned />}
                />
                <Route
                  path="/report-notregister-notscanned"
                  element={<NotRegisterNotScanned />}
                />
                <Route path="/mid-issued" element={<MIDIssued />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ProtectedLayout>
          }
        />
      </Routes>
    </AppInitializer>
  );
}
export default App;
