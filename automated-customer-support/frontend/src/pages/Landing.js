import React from "react";
import Sidebar from "../components/SideBar";
import { Link } from "react-router-dom";
import { FaRobot, FaChartLine, FaLock, FaBrain } from "react-icons/fa";

export default function Landing() {
  return (
    <div className="flex font-sans">
      <Sidebar />

      <div className="ml-56 flex-1 bg-gradient-to-br from-[#0f0f1a] via-[#131326] to-[#1a1a2e] text-white min-h-screen px-6 sm:px-12 py-12 relative overflow-hidden">
        {/* Floating Glow Background Elements */}
        <div className="absolute w-72 h-72 bg-[#519755] rounded-full opacity-20 blur-3xl top-10 -left-32 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#A8DCAB] rounded-full opacity-10 blur-3xl bottom-10 right-0 animate-ping"></div>

        {/* Logo */}
        <div className="flex justify-center mb-6 z-10 relative">
          <img
            src="/images/logo.png"
            alt="AutoSupport AI Logo"
            className="w-48 h-48 sm:w-60 sm:h-60 animate-pulse transition-transform duration-500 hover:scale-105 hover:rotate-1 cursor-pointer drop-shadow-xl"
          />
        </div>

        {/* Hero Section */}
        <section className="mb-16 text-center z-10 relative">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            AI-Powered Support, <br /> Reimagined for the Future
          </h1>
          <p className="text-md sm:text-lg text-[#A8DCAB] max-w-3xl mx-auto leading-relaxed">
            Say goodbye to long wait times and generic replies. Our AI support platform delivers
            intelligent, real-time customer service tailored to your business needs.
          </p>
          <Link
            to="/try"
            className="inline-block mt-8 px-8 py-4 bg-[#DBAAA7] text-black font-bold rounded-lg hover:bg-[#c98686] transition-all shadow-lg"
          >
            🚀 Try It Now
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 z-10 relative">
          <FeatureCard
            icon={<FaRobot className="text-[#A8DCAB] text-3xl mb-4" />}
            title="Autonomous Chatbot"
            description="24/7 support that learns your business and responds like a human—powered by advanced AI and OpenAI's language models."
          />
          <FeatureCard
            icon={<FaChartLine className="text-[#A8DCAB] text-3xl mb-4" />}
            title="Smart Analytics"
            description="Actionable insights and real-time dashboards to help agents and admins stay ahead."
          />
          <FeatureCard
            icon={<FaLock className="text-[#A8DCAB] text-3xl mb-4" />}
            title="Secure Access Control"
            description="Role-based access for Admins, Agents, and Clients—ensuring the right people manage the right data."
          />
          <FeatureCard
            icon={<FaBrain className="text-[#A8DCAB] text-3xl mb-4" />}
            title="Custom Training"
            description="Train the AI on your unique products, services, and FAQs for hyper-personalized responses across channels."
            className="col-span-1 md:col-span-2 xl:col-span-1"
          />
        </section>

        {/* Footer/CTA */}
        <div className="text-center mt-20 text-sm text-gray-500 z-10 relative">
          Built for the future of customer experience – AutoSupport AI
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, className = "" }) {
  return (
    <div
      className={`bg-white/5 p-6 rounded-xl border border-white/10 hover:shadow-2xl transition-transform hover:-translate-y-1 ${className}`}
    >
      {icon}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
