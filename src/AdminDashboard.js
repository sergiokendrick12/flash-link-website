import React, { useState, useEffect } from 'react';
import { Package, Users, Mail, TrendingUp, Ship, Clock, CheckCircle, AlertCircle, Eye, Edit, Trash2, Search, Filter, Download, Menu, X, Home, BarChart3, Settings, LogOut } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({});
    const [contacts, setContacts] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        window.location.reload();
    };

    // Fetch all data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [statsRes, contactsRes, shipmentsRes, quotesRes] = await Promise.all([
                fetch(`${API_URL}/stats`),
                fetch(`${API_URL}/contacts`),
                fetch(`${API_URL}/shipments`),
                fetch(`${API_URL}/quotes`)
            ]);

            const statsData = await statsRes.json();
            const contactsData = await contactsRes.json();
            const shipmentsData = await shipmentsRes.json();
            const quotesData = await quotesRes.json();

            setStats(statsData.data || {});
            setContacts(contactsData.data || []);
            setShipments(shipmentsData.data || []);
            setQuotes(quotesData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateContactStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchAllData();
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const updateShipmentStatus = async (id, status, location, note) => {
        try {
            await fetch(`${API_URL}/shipment/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, location, note })
            });
            fetchAllData();
        } catch (error) {
            console.error('Error updating shipment:', error);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, trend }) => (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend && (
                    <span className="text-green-600 text-sm font-semibold flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );

    const Sidebar = () => (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-500 to-blue-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold">FLASH LINK</h1>
                            <p className="text-xs text-orange-200">Admin Panel</p>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        {sidebarOpen && <span>Dashboard</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('shipments')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'shipments' ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                    >
                        <Package className="h-5 w-5" />
                        {sidebarOpen && <span>Shipments</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'contacts' ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                    >
                        <Mail className="h-5 w-5" />
                        {sidebarOpen && <span>Contacts</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'quotes' ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                    >
                        <BarChart3 className="h-5 w-5" />
                        {sidebarOpen && <span>Quotes</span>}
                    </button>
                </nav>
            </div>

            <div className="absolute bottom-6 left-0 right-0 px-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                >
                    <LogOut className="h-5 w-5" />
                    {sidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    const DashboardView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <button
                    onClick={fetchAllData}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Package}
                    title="Total Shipments"
                    value={stats.totalShipments || 0}
                    color="bg-blue-500"
                    trend="+12%"
                />
                <StatCard
                    icon={Ship}
                    title="In Transit"
                    value={stats.inTransitShipments || 0}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={CheckCircle}
                    title="Delivered"
                    value={stats.deliveredShipments || 0}
                    color="bg-green-500"
                    trend="+8%"
                />
                <StatCard
                    icon={Mail}
                    title="New Contacts"
                    value={stats.newContacts || 0}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Shipments</h3>
                    <div className="space-y-3">
                        {shipments.slice(0, 5).map((shipment) => (
                            <div key={shipment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900">{shipment.orderNumber}</p>
                                    <p className="text-sm text-gray-600">{shipment.customerName}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {shipment.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Contacts</h3>
                    <div className="space-y-3">
                        {contacts.slice(0, 5).map((contact) => (
                            <div key={contact._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900">{contact.name}</p>
                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contact.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                    contact.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {contact.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const ShipmentsView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Shipments Management</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search shipments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order #</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Weight</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {shipments
                                .filter(s => {
                                    const searchLower = searchTerm.toLowerCase();
                                    const orderNum = (s.orderNumber || '').toLowerCase();
                                    const custName = (s.customerName || '').toLowerCase();
                                    return orderNum.includes(searchLower) || custName.includes(searchLower);
                                })
                                .map((shipment) => (
                                    <tr key={shipment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{shipment.orderNumber}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{shipment.customerName}</p>
                                                <p className="text-sm text-gray-500">{shipment.customerEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight} kg</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                {shipment.shippingType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={shipment.status}
                                                onChange={(e) => updateShipmentStatus(shipment._id, e.target.value, 'Updated', 'Status changed')}
                                                className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:border-orange-500 focus:outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="picked_up">Picked Up</option>
                                                <option value="in_transit">In Transit</option>
                                                <option value="customs">Customs</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${shipment.cost}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ContactsView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Contact Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {contacts
                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((contact) => (
                        <div key={contact._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <Users className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                                        <p className="text-gray-600">{contact.email}</p>
                                        <p className="text-gray-600">{contact.phone}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <select
                                    value={contact.status}
                                    onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${contact.status === 'resolved' ? 'bg-green-100 text-green-700 border-green-300' :
                                        contact.status === 'contacted' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                            'bg-yellow-100 text-yellow-700 border-yellow-300'
                                        }`}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Message:</p>
                                <p className="text-gray-700">{contact.message}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    const QuotesView = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Shipping Quotes</h2>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Weight</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {quotes.map((quote) => (
                                <tr key={quote._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(quote.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{quote.customerName || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{quote.customerEmail || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{quote.weight} kg</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                            {quote.shippingType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">${quote.estimatedCost}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{quote.deliveryTime}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${quote.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            quote.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-8`}>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, Admin 👋
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your business today.</p>
                </div>

                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'shipments' && <ShipmentsView />}
                {activeTab === 'contacts' && <ContactsView />}
                {activeTab === 'quotes' && <QuotesView />}
            </div>
        </div>
    );
}