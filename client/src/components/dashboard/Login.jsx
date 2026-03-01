import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [state, setState] = React.useState("login");
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(120);

  const [formData, setFormData] = React.useState({
    name: "",
    aadhaar: "",
    phone: "+91 ",
    otp: "",
  });

  const API_URL = "http://localhost:5000/api";

  // ⏳ OTP Timer
  React.useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!value.startsWith("+91 ")) return;
      if (value.length > 14) return;
    }

    if (name === "aadhaar" && (isNaN(value) || value.length > 12)) return;
    if (name === "otp" && (isNaN(value) || value.length > 6)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📩 Send OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    if (state === "register" && formData.aadhaar.length !== 12) {
      toast.error(t("Invalid Aadhaar number"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phone.replace(/\s/g, ""),
          aadhaar: formData.aadhaar,
          type: state,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t("OTP sent successfully"));
        setOtpSent(true);
        setTimer(120);
        setFormData((prev) => ({ ...prev, otp: "" }));
      } else {
        toast.error(data.error || t("Error sending OTP"));
      }
    } catch (err) {
      toast.error(t("Server error. Check your connection."));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP & Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phone.replace(/\s/g, ""),
          code: formData.otp,
          name: formData.name,
          aadhaar: formData.aadhaar,
          type: state,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t("Login successful"));

        // Save token + user
        onLoginSuccess(data.token, data.user);
        localStorage.setItem("userPhone", data.user.phoneNumber);
        navigate("/", { replace: true });

        // 🔥 IMPORTANT FIX: Always go to Home page
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || t("Invalid OTP"));
      }
    } catch (err) {
      toast.error(t("Verification failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <form
        onSubmit={otpSent ? handleSubmit : handleSendOTP}
        className="z-10 w-full sm:w-96 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6 shadow-2xl"
      >
        <h1 className="text-white text-3xl mt-4 font-medium">
          {state === "login"
            ? t("Login to account")
            : t("Create an account")}
        </h1>

        {state !== "login" && !otpSent && (
          <>
            <div className="mt-6 flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full px-4">
              <input
                type="text"
                name="name"
                placeholder={t("Full name")}
                className="w-full bg-transparent text-white outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4 flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full px-4">
              <input
                type="text"
                name="aadhaar"
                placeholder={t("Aadhaar number")}
                className="w-full bg-transparent text-white outline-none"
                value={formData.aadhaar}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {!otpSent && (
          <div className="mt-4 flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full px-4">
            <input
              type="tel"
              name="phone"
              className="w-full bg-transparent text-white outline-none"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {otpSent && (
          <>
            <div className="mt-4 flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full px-4">
              <input
                type="text"
                name="otp"
                placeholder={t("Enter OTP")}
                className="w-full bg-transparent text-white outline-none text-center font-bold tracking-[0.5em]"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>

            <p className="text-gray-400 text-xs mt-3">
              {timer > 0
                ? `${t("Resend OTP in")} ${formatTime(timer)}`
                : t("Didn't receive code?")}
            </p>

            {timer === 0 && (
              <button
                type="button"
                onClick={handleSendOTP}
                className="text-indigo-400 text-sm font-medium hover:underline mt-1"
              >
                {t("Resend now")}
              </button>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition font-semibold disabled:opacity-50"
        >
          {loading
            ? t("Processing...")
            : otpSent
            ? t("Verify and login")
            : t("Send OTP")}
        </button>

        {!otpSent && (
          <p
            onClick={() => {
              setState(state === "login" ? "register" : "login");
              setOtpSent(false);
            }}
            className="text-gray-400 text-sm mt-6 cursor-pointer"
          >
            {state === "login"
              ? t("Don't have an account?")
              : t("Already have an account?")}{" "}
            <span className="text-indigo-400 hover:underline ml-1">
              {t("Click here")}
            </span>
          </p>
        )}
      </form>

      <div className="absolute left-1/2 top-20 -translate-x-1/2 w-96 h-64 bg-indigo-800/20 rounded-full blur-[120px]" />
    </div>
  );
};

export default Login;