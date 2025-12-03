"use client";

import { Button } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import TypewriterText from "~/components/typewriter";

const roles =[
    'Every Dream Begins With a List',
    'Dream It. Plan It. Live It.',
    'Turn your Dreams Into Adventures',
    'Make Your Bucket List Breathe'

]
//Hero section component //

export function HeroSection() {
    return (
        <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 z-30">
                <img
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1950&q=80"
                    alt="Coastal view"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Text Content */}
            <div className="relative z-40 flex flex-col justify-center items-center text-center h-full px-4 sm:px-6 md:px-10">
                <TypewriterText roles={roles} style="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-500 mb-4 leading-tight" />
               {/* <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Turn <span className="text-amber-500">your Dreams</span> Into Adventures
                </h2>*/}

                <p className="text-base sm:text-lg md:text-xl text-gray-100 font-medium mb-8 max-w-2xl">
                    Create your Wander list, share with friends, and start checking off your dreams today!
                    Connect with a community of adventurers and make every moment count.
                </p>

                <Button
                    href="/signup"
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
                >
                    Start your journey
                </Button>
            </div>
        </section>
    );
}



export function SidebarChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, user: "Alice", text: "Hey! Ready for your next adventure?" },
        { id: 2, user: "You", text: "Absolutely! Any ideas?" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { id: Date.now(), user: "You", text: input }]);
        setInput("");
    };

    return (
        <>
            {/* Chat toggle button */}
            <button
                className="fixed bottom-6 right-6 z-50 bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition"
                onClick={toggleSidebar}>
                {isOpen ? <FaTimes size={20} /> : <FaComments size={20} />}
            </button>

            {/* Sidebar chat panel */}
            <div
                className={`fixed bottom-25 right-40 h-[600px] w-80 bg-white shadow-lg rounded-xl z-40 transform transition-all duration-300 origin-bottom-right ${
                    isOpen ? "scale-100  opacity- 100" : "scale-0 opacity-0  pointer-events-none"}`}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Wanderlist Chat</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-700">
                        <FaTimes />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg max-w-[75%] ${
                                msg.user === "You" ? "bg-amber-100 ml-auto" : "bg-gray-200"
                            }`}
                        >
                            <p className="text-sm font-medium text-gray-700">{msg.user}</p>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-gray-200 flex gap-2">
                    <input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-amber-400"/>
                    <Button onClick={sendMessage} className="bg-amber-400">
                        Send
                    </Button>
                </footer>
            </div>
        </>
    );
}

