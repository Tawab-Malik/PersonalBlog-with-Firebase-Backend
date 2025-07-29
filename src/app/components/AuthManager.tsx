"use client";
import { useState } from "react";
import SignupPopup from "./SignupPopup";
import LoginPopup from "./LoginPopup";

interface AuthManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthManager({ isOpen, onClose, initialMode = "login" }: AuthManagerProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const handleSwitchToSignup = () => {
    setMode("signup");
  };

  const handleSwitchToLogin = () => {
    setMode("login");
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
      />
      <SignupPopup
        isOpen={isOpen && mode === "signup"}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
} 