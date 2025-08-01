"use client";
import { useState } from "react";
import SignupPopup from "./SignupPopup";
import LoginPopup from "./LoginPopup";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

interface AuthManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "forgot-password";
}

export default function AuthManager({ isOpen, onClose, initialMode = "login" }: AuthManagerProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password">(initialMode);

  const handleSwitchToSignup = () => {
    setMode("signup");
  };

  const handleSwitchToLogin = () => {
    setMode("login");
  };

  const handleSwitchToForgotPassword = () => {
    setMode("forgot-password");
  };

  const handleClose = () => {
    setMode(initialMode); // Reset to initial mode when closing
    onClose();
  };

  return (
    <>
      <LoginPopup
        isOpen={isOpen && mode === "login"}
        onClose={handleClose}
        onSwitchToSignup={handleSwitchToSignup}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />
      <SignupPopup
        isOpen={isOpen && mode === "signup"}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <ForgotPasswordPopup
        isOpen={isOpen && mode === "forgot-password"}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
} 