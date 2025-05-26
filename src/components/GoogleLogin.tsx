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
    const handleCredentialResponse = (response: any) => {
      const decoded: any = jwtDecode(response.credential);
      onLogin({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
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
