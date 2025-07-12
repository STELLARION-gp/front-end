import React, { useState } from "react";
import {
  Star, BookOpen, CalendarDays, Camera, Users, User, ImageIcon, Trophy
} from "lucide-react";

const tabs = [
  { name: "Favorites", icon: <Star size={16} /> },
  { name: "Competitions", icon: <Trophy size={16} /> },
  { name: "Services", icon: <CalendarDays size={16} /> },
  { name: "Quizzes", icon: <BookOpen size={16} /> },
  { name: "Mentors", icon: <User size={16} /> },
  { name: "Influencers", icon: <Users size={16} /> },
  { name: "My Content", icon: <ImageIcon size={16} /> },
];

const MyUniverse = () => {
  const [activeTab, setActiveTab] = useState("Favorites");

  return (
    <div className="p-6 text-white bg-[#0f172a] min-h-screen">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg mb-6 flex flex-wrap justify-between items-center">
        <h2 className="text-2xl font-bold">🌌 My Universe</h2>
        <div className="text-sm text-white/80">
          ⭐ Favorites: 6 &nbsp;| 🎯 Competitions: 3 &nbsp;| 📚 Mentor Courses: 1 &nbsp;| 🪐 Services: 2
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.name
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4 shadow-inner border border-white/10">
        {activeTab === "Favorites" && (
          <>
            <h3 className="text-lg font-semibold">Favorite Blogs</h3>
            <ul className="list-disc ml-5 text-white/90">
              <li>“10 Facts About Exoplanets”</li>
              <li>“James Webb Discoveries 2025”</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Favorite Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-3 rounded-lg">🌠 Pillars of Creation</div>
              <div className="bg-white/10 p-3 rounded-lg">📷 Rosette Nebula</div>
            </div>
          </>
        )}

        {activeTab === "Competitions" && (
          <div className="space-y-2">
            <div className="p-4 bg-blue-900/30 rounded-lg flex justify-between">
              <span>Astro Quiz Challenge – Sep 15, 2025</span>
              <span className="text-green-400 font-medium">✅ Registered</span>
            </div>
            <div className="p-4 bg-blue-900/30 rounded-lg flex justify-between">
              <span>Deep Space Art Contest – Oct 5, 2025</span>
              <span className="text-yellow-400 font-medium">✅ Submitted</span>
            </div>
          </div>
        )}

        {activeTab === "Services" && (
          <>
            <div className="bg-slate-800 p-4 rounded-md shadow">
              🌌 Stargazing Camp – Aug 30, 2025 &nbsp;
              <span className="text-green-400 font-semibold">Paid & Confirmed</span>
            </div>
            <div className="bg-slate-800 p-4 rounded-md shadow">
              🔭 Telescope Rental (7 Days) &nbsp;
              <span className="text-blue-300">Active until Sep 2, 2025</span>
            </div>
          </>
        )}

        {activeTab === "Quizzes" && (
          <ul className="space-y-2">
            <li>✅ <strong>Galaxies & Clusters</strong> – Completed (85%)</li>
            <li>🔓 <strong>Astrobiology Basics</strong> – Available Now</li>
            <li>⏳ <strong>Black Holes Quiz</strong> – Starts Sept 20</li>
          </ul>
        )}

        {activeTab === "Mentors" && (
          <>
            <h4 className="font-bold">Mentor: Prof. Stella Nova</h4>
            <ul className="list-disc ml-5 text-white/90">
              <li>📘 “Understanding the Cosmos” – Course Material</li>
              <li>🎥 Live Session: Sept 18, 7:00 PM</li>
            </ul>
          </>
        )}

        {activeTab === "Influencers" && (
          <ul className="grid grid-cols-2 gap-4">
            <li className="bg-white/10 p-3 rounded-lg">🌟 @SpaceExplorerX</li>
            <li className="bg-white/10 p-3 rounded-lg">🌟 @AstroArtist</li>
            <li className="bg-white/10 p-3 rounded-lg">🌟 @DeepSkyDrifter</li>
          </ul>
        )}

        {activeTab === "My Content" && (
          <ul className="space-y-2">
            <li>✍️ Submitted Blog: “Journey to Saturn”</li>
            <li>🎨 Artwork: “Milky Way Dreams”</li>
            <li>📸 Photo: “Orion’s Belt”</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyUniverse;
