import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
export default function Home() {


  

    return (
        <div className="bg-black min-h-screen flex justify-center text-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Roboto, Helvetica, Arial, sans-serif" }}>
            {/* Mobile Frame */}
            <div className="w-full max-w-[screen] text-white">



                {/* Navbar */}
                <Navbar />

                {/* Hero */}
                <div className="text-center pt-6 pb-6 max-w-[500px] mx-auto">
                    <h1 className="text-[28px] font-semibold tracking-tight">GestureGym</h1>
                    <p className="!text-yellow-400 text-[13px] mt-1 tracking-tight">gesture based fitness at home</p>
                </div>

                {/* Section */}
                <div className="px-4 max-w-[1000px] mx-auto">
                    <h2 className="text-[16px] font-medium mb-3">Ladders</h2>

                    {/* Pushup Card */}
                    <div className="relative mb-4">
                       <Link to="/Leaderboard"> <img
                            src="https://images.unsplash.com/photo-1764426445448-95103b0024a6?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="pushups"
                            className="w-full h-[300px] md:h-auto object-cover md:object-contain rounded-md"
                        /> </Link> 
                       <Link to="/Leaderboard"><button className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded text-[14px] font-semibold">
                            Daily Push-ups
                        </button></Link>
                    </div>

                    {/* Yoga Card */}
                    <div className="relative mb-4">
                       <Link to="/Yoga"> <img
                            src="https://images.unsplash.com/photo-1552196563-55cd4e45efb3"
                            alt="yoga"
                            className="w-full h-[300px] md:h-auto object-cover md:object-contain rounded-md"
                        /> </Link>
                        <Link to="/Yoga"><button className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded text-[14px] font-semibold">
                            Guided Yoga
                        </button></Link>
                    </div>

                    {/* Grid
                    <div className="grid grid-cols-2 gap-3">

                        https://images.unsplash.com/photo-1599058917212-d750089bc07e
                        <Card title="Weekly Squat" img="https://images.unsplash.com/photo-1594737625785-c5cbb5f5d7d5" />
                        <Card title="February Yoga Challenge" img="https://images.unsplash.com/photo-1552196563-55cd4e45efb3" />
                        <Card title="Monday Mobility" img="https://images.unsplash.com/photo-1558611848-73f7eb4001a1" />
                        <Card title="Monthly Pull ups" img="https://images.unsplash.com/photo-1598971639058-a5d7b39c9c1a" />
                    </div> 
                    */}
                </div>

                {/* Footer
                <div className="mt-6 border-t border-gray-800 px-4 pt-4 pb-6 grid grid-cols-3 gap-4 text-[11px] text-white">
                    <div className="space-y-1">
                        <p className="text-white font-medium text-[12px] mb-1">Use cases</p>
                        <p>UI design</p>
                        <p>UX design</p>
                        <p>Wireframing</p>
                        <p>Diagramming</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-medium text-[12px] mb-1">Explore</p>
                        <p>Design</p>
                        <p>Prototyping</p>
                        <p>Development</p>
                        <p>Collaboration</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-medium text-[12px] mb-1">Resources</p>
                        <p>Blog</p>
                        <p>Best practices</p>
                        <p>Colors</p>
                        <p>Support</p>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}

function Card({ title, img }) {
    return (
        <div className="relative">
            <img
                src={img}
                alt={title}
                className="w-full h-[100px] object-cover rounded-md"
            />
            <div className="absolute top-1.5 left-1.5 bg-black/70 px-2 py-[2px] rounded text-[10px] font-medium leading-tight">
                {title}
            </div>
        </div>
    );
}

function About() {
    return <div className="p-4 text-white">About Page</div>;
}

export function AppWrapper() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}