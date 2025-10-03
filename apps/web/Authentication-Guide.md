# Authentication System - Frontend Implementation Guide

## 📋 Overview

This guide covers the complete authentication system implementation for the frontend, including user registration, email verification, login, and password reset functionality.

## 🔄 Authentication Flow

### **1. User Registration Flow**
```
1. User fills registration form
2. Submit → "Registration submitted successfully" ✅
3. User receives email with OTP
4. User MUST verify email with OTP
5. After verification → User can login ✅
```

### **2. Forgot Password Flow**
```
1. User enters email → "OTP sent to your email" ✅
2. User enters OTP → "OTP verified successfully" ✅
3. User enters new password → "Password reset successfully" ✅
4. User can login with new password ✅
```

## 🚀 API Endpoints

### **Base URL**: `http://localhost:3001/api/v1/auth`

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/register` | POST | Register new user | ❌ |
| `/login` | POST | Login user | ❌ |
| `/logout` | POST | Logout user | ✅ |
| `/forgot-password` | POST | Send OTP for password reset | ❌ |
| `/verify-otp` | POST | Verify OTP for password reset | ❌ |
| `/reset-password` | POST | Reset password with OTP | ❌ |
| `/verify-email` | POST | Verify email with OTP | ❌ |
| `/resend-verification` | POST | Resend email verification | ❌ |

## 📝 Request/Response Examples

### **1. Register User**
```typescript
// Request
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "username": "username123",
  "password": "StrongP@ssw0rd",
  "firstname": "John",
  "lastname": "Doe",
  "biography": "I am a software developer."
}

// Response (201)
{
  "success": true,
  "message": "Registration submitted successfully",
  "userId": "64f2a7b9e0c0f123456789ab",
  "email": "user@example.com"
}
```

### **2. Verify Email**
```typescript
// Request
POST /api/v1/auth/verify-email
{
  "email": "user@example.com",
  "otp": "123456"
}

// Response (200)
{
  "success": true,
  "message": "Email verified successfully",
  "verified": true
}
```

### **3. Login**
```typescript
// Request
POST /api/v1/auth/login
{
  "username": "username123",
  "password": "StrongP@ssw0rd"
}

// Response (200)
{
  "success": true,
  "message": "User logged in successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "64f2a7b9e0c0f123456789ab"
}
```

### **4. Forgot Password**
```typescript
// Request
POST /api/v1/auth/forgot-password
{
  "email": "user@example.com"
}

// Response (200)
{
  "success": true,
  "message": "OTP sent to your email",
  "expiresIn": "5 minutes"
}
```

### **5. Verify OTP**
```typescript
// Request
POST /api/v1/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}

// Response (200)
{
  "success": true,
  "message": "OTP verified successfully",
  "valid": true,
  "userId": "64bfc67e2b3c5a001e9e8c11"
}
```

### **6. Reset Password**
```typescript
// Request
POST /api/v1/auth/reset-password
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewP@ssw0rd"
}

// Response (200)
{
  "success": true,
  "message": "Password reset successfully"
}
```

### **7. Resend Verification**
```typescript
// Request
POST /api/v1/auth/resend-verification
{
  "email": "user@example.com"
}

// Response (200)
{
  "success": true,
  "message": "Verification email sent successfully",
  "expiresIn": "5 minutes"
}
```

### **8. Logout**
```typescript
// Request
POST /api/v1/auth/logout
// Headers: Cookie with accessToken

// Response (200)
{
  "code": "LOGOUT_SUCCESSFUL",
  "message": "User logged out successfully"
}
```

## 🎯 Frontend Implementation

### **1. API Service**
```typescript
// src/services/auth.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1/auth';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResendVerificationData {
  email: string;
}

class AuthService {
  async register(data: RegisterData) {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    return response.data;
  }

  async verifyEmail(data: VerifyEmailData) {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, data);
    return response.data;
  }

  async login(data: LoginData) {
    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      withCredentials: true // Important for cookies
    });
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordData) {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, data);
    return response.data;
  }

  async verifyOTP(data: VerifyOTPData) {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordData) {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
    return response.data;
  }

  async resendVerification(data: ResendVerificationData) {
    const response = await axios.post(`${API_BASE_URL}/resend-verification`, data);
    return response.data;
  }

  async logout() {
    const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
      withCredentials: true
    });
    return response.data;
  }
}

export const authService = new AuthService();
```

### **2. React Hook for Authentication**
```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // You can implement a "me" endpoint to check auth status
      // For now, we'll check localStorage or cookies
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Validate token or get user info
        setUser({ isAuthenticated: true });
      }
    } catch (error) {
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (data: VerifyEmailData) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmail(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Email verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      setUser({ 
        isAuthenticated: true, 
        userId: response.userId,
        accessToken: response.accessToken 
      });
      localStorage.setItem('accessToken', response.accessToken);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Forgot password failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (data: VerifyOTPData) => {
    try {
      setLoading(true);
      const response = await authService.verifyOTP(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (data: ResendVerificationData) => {
    try {
      setLoading(true);
      const response = await authService.resendVerification(data);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Resend verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      localStorage.removeItem('accessToken');
    } catch (error) {
      setError(error.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    register,
    verifyEmail,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    resendVerification,
    logout,
    setError
  };
};
```

### **3. Registration Component**
```typescript
// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm: React.FC = () => {
  const { register, loading, error, setError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    biography: ''
  });
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        biography: formData.biography
      });
      
      setRegisteredEmail(formData.email);
      setStep('verify');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { verifyEmail } = useAuth();
      await verifyEmail({
        email: registeredEmail,
        otp: otp
      });
      
      // Redirect to login or show success message
      alert('Email verified successfully! You can now login.');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
        <p className="mb-4">We've sent a 6-digit code to {registeredEmail}</p>
        
        <form onSubmit={handleVerifyEmail}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <button
          onClick={() => setStep('register')}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to Registration
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must contain uppercase, lowercase, number, and special character
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Confirm Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstname}
            onChange={(e) => setFormData({...formData, firstname: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastname}
            onChange={(e) => setFormData({...formData, lastname: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Biography</label>
          <textarea
            value={formData.biography}
            onChange={(e) => setFormData({...formData, biography: e.target.value})}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};
```

### **4. Forgot Password Component**
```typescript
// src/components/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, verifyOTP, resetPassword, loading, error, setError } = useAuth();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPassword({ email });
      setStep('otp');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await verifyOTP({ email, otp });
      setStep('reset');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword });
      alert('Password reset successfully! You can now login with your new password.');
      // Redirect to login
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      
      {step === 'email' && (
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit code to {email}
            </p>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('email')}
            className="mt-4 text-blue-500 hover:underline"
          >
            Back
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain uppercase, lowercase, number, and special character
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('otp')}
            className="mt-4 text-blue-500 hover:underline"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};
```

## 🧪 Testing Guide

### **1. Test Registration Flow**
1. Open Swagger UI: `http://localhost:3001/api-docs`
2. Test `POST /api/v1/auth/register`
3. Check email for OTP
4. Test `POST /api/v1/auth/verify-email`
5. Test `POST /api/v1/auth/login`

### **2. Test Forgot Password Flow**
1. Test `POST /api/v1/auth/forgot-password`
2. Check email for OTP
3. Test `POST /api/v1/auth/verify-otp`
4. Test `POST /api/v1/auth/reset-password`
5. Test login with new password

### **3. Test Error Cases**
- Invalid email format
- Weak password
- Wrong OTP
- Expired OTP
- Non-existent user

## 🔧 Configuration

### **Axios Configuration**
```typescript
// src/config/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  withCredentials: true, // Important for cookies
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📱 Mobile Considerations

### **OTP Input Component**
```typescript
// src/components/OTPInput.tsx
import React, { useState, useRef } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  React.useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      onComplete(otp.join(''));
    }
  }, [otp, onComplete]);

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          maxLength={1}
          value={data}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};
```

## 🎯 Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely (HttpOnly cookies preferred)**
3. **Implement proper error handling**
4. **Add loading states for better UX**
5. **Validate forms on both client and server**
6. **Implement rate limiting for OTP requests**
7. **Add proper TypeScript types**
8. **Test all error scenarios**

## 🚀 Production Checklist

- [ ] Update API base URL to production
- [ ] Configure email service (SMTP/SendGrid)
- [ ] Set up Redis for OTP storage
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Test all flows end-to-end
- [ ] Configure SSL certificates
- [ ] Set up backup and recovery

This guide provides everything needed to implement the complete authentication system on the frontend! 🎉
