import React, { useState } from 'react';
import { Package, Ship, Truck, Globe, DollarSign, Clock, Shield, Star, Menu, X, ArrowRight, CheckCircle2, Phone, Mail, MapPin, Calculator, MessageCircle } from 'lucide-react';
import PaymentForm from './PaymentForm';

export default function ShippingWebsite() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [weight, setWeight] = useState('');
    const [shippingType, setShippingType] = useState('air');
    const [estimate, setEstimate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [clients, setClients] = useState(0);
    const [shipments, setShipments] = useState(0);
    const [showPayment, setShowPayment] = useState(false);

    React.useEffect(() => {
        const clientInterval = setInterval(() => {
            setClients(prev => {
                if (prev >= 2000) {
                    clearInterval(clientInterval);
                    return 2000;
                }
                return prev + 50;
            });
        }, 30);

        const shipmentInterval = setInterval(() => {
            setShipments(prev => {
                if (prev >= 5000) {
                    clearInterval(shipmentInterval);
                    return 5000;
                }
                return prev + 100;
            });
        }, 30);

        return () => {
            clearInterval(clientInterval);
            clearInterval(shipmentInterval);
        };
    }, []);

    const calculateCost = () => {
        const w = parseFloat(weight);
        if (!w || w <= 0) {
            alert('Please enter a valid weight');
            return;
        }

        const rates = { sea: 2.5, air: 9.0, express: 15.0 };
        const times = { sea: '25-35 days', air: '7-12 days', express: '3-5 days' };

        setEstimate({
            cost: (w * rates[shippingType]).toFixed(2),
            time: times[shippingType],
            method: shippingType
        });
    };

    const handleContactSubmit = async () => {
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert('Thank you! We will contact you within 24 hours.');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Connection error. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://i.imgur.com/YourImageId.png"
                                alt="Flash Link Logo"
                                className="h-14 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl">
                                <Ship className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    <span className="text-orange-500">FLASH</span>{' '}
                                    <span className="text-blue-900">LINK</span>
                                </div>
                                <div className="text-xs text-cyan-500 font-medium">Logistic & Trading Company</div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-10">
                            <a href="#home" className="text-gray-700 hover:text-orange-500 font-medium transition">Home</a>
                            <a href="#services" className="text-gray-700 hover:text-orange-500 font-medium transition">Services</a>
                            <a href="#quote" className="text-gray-700 hover:text-orange-500 font-medium transition">Get Quote</a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-500 font-medium transition">Contact</a>
                            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
                                Track Order
                            </button>
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t">
                        <div className="px-6 py-4 space-y-4">
                            <a href="#home" className="block text-gray-700 font-medium">Home</a>
                            <a href="#services" className="block text-gray-700 font-medium">Services</a>
                            <a href="#quote" className="block text-gray-700 font-medium">Get Quote</a>
                            <a href="#contact" className="block text-gray-700 font-medium">Contact</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <Star className="h-4 w-4 fill-current" />
                                Trusted by {clients.toLocaleString()}+ Businesses
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Ship Smarter from <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-900">China to Burundi</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Fast, reliable, and affordable international shipping. From door pickup in China to final delivery in Burundi—we handle it all.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#quote" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition flex items-center gap-2">
                                    Get Free Quote <ArrowRight className="h-5 w-5" />
                                </a>
                                <a href="#contact" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition">
                                    Contact Sales
                                </a>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">3-35</div>
                                    <div className="text-sm text-gray-600">Days Delivery</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{clients.toLocaleString()}+</div>
                                    <div className="text-sm text-gray-600">Happy Clients</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">24/7</div>
                                    <div className="text-sm text-gray-600">Support</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Package className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Order #{(12000 + shipments).toLocaleString()}</div>
                                                <div className="text-sm text-gray-500">Electronics</div>
                                            </div>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            In Transit
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">Picked up in Guangzhou</div>
                                                <div className="text-xs text-gray-500">Nov 28, 2024</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">Customs cleared</div>
                                                <div className="text-xs text-gray-500">Nov 30, 2024</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 border-2 border-blue-500 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">En route to Bujumbura</div>
                                                <div className="text-xs text-gray-500">Estimated Dec 5, 2024</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-white text-center">
                                    <div className="text-sm font-medium mb-2">Real-time tracking included</div>
                                    <div className="text-xs opacity-80">Monitor your shipment every step of the way</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Shipping Solutions</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the perfect shipping method for your business needs</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition border border-blue-100">
                            <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Ship className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Sea Freight</h3>
                            <p className="text-gray-600 mb-6">Perfect for large shipments and cost-conscious businesses</p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <span>25-35 days delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <span>Best rates for bulk</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <span>Full container loads</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <span>Customs clearance</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">$2.50<span className="text-lg text-gray-600">/kg</span></div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition border-2 border-purple-200 relative">
                            <div className="absolute -top-4 right-6 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                Popular
                            </div>
                            <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Package className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Air Freight</h3>
                            <p className="text-gray-600 mb-6">Balanced speed and cost for regular shipments</p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                    <span>7-12 days delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                    <span>Real-time tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                    <span>Priority handling</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                    <span>Insurance included</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-purple-600">$9.00<span className="text-lg text-gray-600">/kg</span></div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 hover:shadow-xl transition border border-orange-100">
                            <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Truck className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Express</h3>
                            <p className="text-gray-600 mb-6">Fastest option for urgent and time-sensitive cargo</p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                    <span>3-5 days delivery</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                    <span>Express clearance</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                    <span>Door-to-door</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                    <span>Premium insurance</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-orange-600">$15.00<span className="text-lg text-gray-600">/kg</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Calculator */}
            <section id="quote" className="py-24 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-12">
                        <div className="text-center mb-10">
                            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Calculator className="h-8 w-8 text-orange-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Instant Quote</h2>
                            <p className="text-lg text-gray-600">Calculate your shipping cost in seconds</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Method</label>
                                    <select
                                        value={shippingType}
                                        onChange={(e) => setShippingType(e.target.value)}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none bg-white text-gray-900"
                                    >
                                        <option value="sea">🚢 Sea Freight - Most Economic</option>
                                        <option value="air">✈️ Air Freight - Balanced</option>
                                        <option value="express">⚡ Express - Fastest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="Enter weight"
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={calculateCost}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition"
                            >
                                Calculate Cost
                            </button>

                            {estimate && (
                                <div className="mt-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-8 border-2 border-orange-200">
                                    <div className="grid md:grid-cols-3 gap-6 text-center">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-600 mb-2">Estimated Cost</div>
                                            <div className="text-4xl font-bold text-orange-600">${estimate.cost}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-600 mb-2">Delivery Time</div>
                                            <div className="text-2xl font-bold text-gray-900">{estimate.time}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-600 mb-2">Method</div>
                                            <div className="text-2xl font-bold text-gray-900 capitalize">{estimate.method}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => setShowPayment(true)}
                                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                                        >
                                            Book & Pay Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
                        <p className="text-xl text-gray-600">Your trusted logistics partner</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Network</h3>
                            <p className="text-gray-600">Established routes between China and Burundi</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Insured</h3>
                            <p className="text-gray-600">Complete protection for your cargo</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">On-Time Delivery</h3>
                            <p className="text-gray-600">98% on-time delivery rate</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Best Rates</h3>
                            <p className="text-gray-600">Competitive pricing guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-24 px-6 lg:px-8 bg-gradient-to-br from-orange-500 to-blue-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Ship?</h2>
                            <p className="text-xl mb-8 text-orange-100">Get in touch with our team and we'll handle the rest</p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Phone</div>
                                        <div className="text-orange-100">+86 182 0207 6473 (China)</div>
                                        <div className="text-orange-100">+257 61 49 0746 (Burundi)</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Email</div>
                                        <div className="text-orange-100">info@flashlink.com</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Offices</div>
                                        <div className="text-orange-100">Guangzhou, China</div>
                                        <div className="text-orange-100">Bujumbura, Burundi</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                                ></textarea>
                                <button
                                    onClick={handleContactSubmit}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition"
                                >

                                </button>
                                <button
                                    onClick={handleContactSubmit}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-orange-500 to-blue-900 p-2 rounded-xl">
                            <Ship className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">
                            <span className="text-orange-500">FLASH</span>{' '}
                            <span className="text-white">LINK</span>
                        </span>
                    </div>
                    <p className="text-gray-400 mb-2">Connecting businesses across all continents</p>
                    <p className="text-gray-500 text-sm">© 2025 Flash Link Logistic & Trading Company. All rights reserved.</p>
                </div>
            </footer>

            {/* Payment Modal */}
            {showPayment && estimate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
                            <button
                                onClick={() => setShowPayment(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-gray-900 mb-4">Shipment Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Weight</p>
                                    <p className="font-semibold">{weight} kg</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Method</p>
                                    <p className="font-semibold capitalize">{estimate.method}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Delivery Time</p>
                                    <p className="font-semibold">{estimate.time}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Total Cost</p>
                                    <p className="font-semibold text-orange-600 text-xl">${estimate.cost}</p>
                                </div>
                            </div>
                        </div>

                        <PaymentForm
                            amount={parseFloat(estimate.cost)}
                            orderData={{
                                name: 'Customer Name',
                                email: 'customer@example.com',
                                weight: weight,
                                shippingType: estimate.method
                            }}
                            onSuccess={(paymentIntent) => {
                                alert('Payment successful! Order confirmed.');
                                setShowPayment(false);
                                setEstimate(null);
                                setWeight('');
                            }}
                        />
                    </div>
                </div>
            )}

            {/* WhatsApp Floating Button */}

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/8618202076473"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group z-50"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="hidden group-hover:inline-block text-sm font-semibold whitespace-nowrap pr-2">
                    Need help? Talk to us on WhatsApp
                </span>
            </a>
        </div>
    );
}