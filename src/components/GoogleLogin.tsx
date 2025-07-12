import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleUser = {
  name: string;
  email: string;
  picture: string;
};

interface GoogleLoginProps {
  onLogin: (user: GoogleUser) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLogin }) => {
  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
  if (!response?.credential) return;

  try {
    const googleToken = response.credential;
    
    // Optional: Decode locally for preview (not for security!)
    const decoded: any = jwtDecode(googleToken);
    console.log("Google user:", decoded);

    // ✅ Send to backend
    const res = await fetch('https://cert-submit.onrender.com/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: googleToken }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      // Save JWT in localStorage
      localStorage.setItem('token', data.token);

      const user: any = jwtDecode(data.token);
      onLogin({
        name: user.name,
        email: user.email,
        picture: decoded.picture, // Or use from JWT if you store it
      });

      console.log("✅ Logged in and token stored");
    } else {
      console.error("❌ Backend error:", data.message);
    }
  } catch (err) {
    console.error("❌ Google login failed:", err);
  }
};


    const initializeGSI = () => {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      
      window.google.accounts.id.initialize({
        client_id: '319314674536-fq5ha9ltheldhm376k54keo35hhbdmfq.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv')!,
        { theme: 'outline', size: 'large' }
      );

      window.google.accounts.id.prompt();
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGSI();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGSI;
      document.body.appendChild(script);
    }
  }, [onLogin]);

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLogin;
