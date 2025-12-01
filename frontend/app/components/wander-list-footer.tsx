import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin } from "react-icons/bs";
import { MapPin, Mail, Phone } from "lucide-react";

export function WanderListFooter(){
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 mt-16">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🌍</span>
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                WanderList
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Discover, explore, and share your bucket list adventures with a vibrant community of travelers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="flex flex-col gap-3">
                            <li><a href="/home" className="text-gray-400 hover:text-blue-400 transition">Home</a></li>
                            <li><a href="/community" className="text-gray-400 hover:text-blue-400 transition">Community</a></li>
                            <li><a href="/dashboard" className="text-gray-400 hover:text-blue-400 transition">Dashboard</a></li>
                            <li><a href="/settings" className="text-gray-400 hover:text-blue-400 transition">Profile</a></li>
                        </ul>
                    </div>



                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center gap-2 text-gray-400">
                                <Mail size={16} className="text-blue-400" />
                                <a href="mailto:info@wanderlist.com" className="hover:text-blue-400 transition">info@wanderlist.com</a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Phone size={16} className="text-blue-400" />
                                <a href="tel:+1234567890" className="hover:text-blue-400 transition">+1 (234) 567-890</a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <MapPin size={16} className="text-blue-400" />
                                <span>123 Travel St, ALBUQUERQUE, NM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Copyright */}
                    <div className="text-gray-400 text-sm">
                        <p>&copy; 2025 WanderList. All rights reserved.</p>
                        <p className="mt-2">Made with <span className="text-red-500">❤️</span> by travel enthusiasts.</p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110 duration-200">
                            <BsFacebook size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-400 transition transform hover:scale-110 duration-200">
                            <BsInstagram size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-300 transition transform hover:scale-110 duration-200">
                            <BsTwitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110 duration-200">
                            <BsGithub size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition transform hover:scale-110 duration-200">
                            <BsLinkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

