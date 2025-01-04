import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  About,
  Appointment,
  Contact,
  Doctor,
  Home,
  Login,
  MyAppointment,
  Profile,
} from "./pages";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Helmet>
        <title>MedPoint</title>
      </Helmet>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Home - MedPoint</title>
              </Helmet>
              <Home />
            </>
          }
        />
        <Route
          path="/doctor"
          element={
            <>
              <Helmet>
                <title>Doctors - MedPoint</title>
              </Helmet>
              <Doctor />
            </>
          }
        />
        <Route
          path="/doctor/:speciality"
          element={
            <>
              <Helmet>
                <title>Specialist Doctors - MedPoint</title>
              </Helmet>
              <Doctor />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Helmet>
                <title>Login - MedPoint</title>
              </Helmet>
              <Login />
            </>
          }
        />
        <Route
          path="/about-us"
          element={
            <>
              <Helmet>
                <title>About Us - MedPoint</title>
              </Helmet>
              <About />
            </>
          }
        />
        <Route
          path="/contact-us"
          element={
            <>
              <Helmet>
                <title>Contact Us - MedPoint</title>
              </Helmet>
              <Contact />
            </>
          }
        />
        <Route
          path="/my-profile"
          element={
            <>
              <Helmet>
                <title>My Profile - MedPoint</title>
              </Helmet>
              <Profile />
            </>
          }
        />
        <Route
          path="/my-appointment"
          element={
            <>
              <Helmet>
                <title>My Appointments - MedPoint</title>
              </Helmet>
              <MyAppointment />
            </>
          }
        />
        <Route
          path="/appointment/:docId"
          element={
            <>
              <Helmet>
                <title>Book Appointment - MedPoint</title>
              </Helmet>
              <Appointment />
            </>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
