import React, { useState } from 'react';
import { Ship, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Demo credentials - Replace with real authentication later
        if (email === 'admin@flashlink.com' && password === 'admin123') {
            setTimeout(() => {
                localStorage.setItem('adminToken', 'flash_link_admin_token_' + Date.now());
                localStorage.setItem('adminEmail', email);
                onLogin();
            }, 1000);
        } else {
            setLoading(false);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-blue-900 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Ship className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="text-orange-500">FLASH</span>{' '}
                        <span className="text-blue-900">LINK</span>
                    </h1>
                    <p className="text-gray-600">Admin Dashboard Login</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Demo Credentials Info */}
                <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 text-sm font-semibold mb-2">Demo Credentials:</p>
                    <p className="text-blue-700 text-xs">Email: admin@flashlink.com</p>
                    <p className="text-blue-700 text-xs">Password: admin123</p>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@flashlink.com"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-semibold">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <a href="https://wa.me/8618202076473" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-semibold">
                            Contact Support
                        </a>
                    </p>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="h-3 w-3" />
                        <span>Secure encrypted connection</span>
                    </div>
                </div>
            </div>
        </div>
    );
}