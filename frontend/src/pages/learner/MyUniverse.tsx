import React, { useState } from "react";
; // adjust path as needed
import '../../styles/pages/learner/MyUniverse.scss'
import {
  Star, BookOpen, CalendarDays, Users, User, ImageIcon, Trophy
} from "lucide-react";
import QuizCard from "../../components/Learner/QuizCard";
import Button from "../../components/Button";

const tabs = [
  { name: "Quizzes", icon: <BookOpen size={16} /> },
  { name: "Favorites", icon: <Star size={16} /> },
  { name: "Competitions", icon: <Trophy size={16} /> },
  { name: "Services", icon: <CalendarDays size={16} /> },
  { name: "Mentors", icon: <User size={16} /> },
  { name: "Influencers", icon: <Users size={16} /> },
  { name: "My Content", icon: <ImageIcon size={16} /> },
];
interface Quiz {
  id: number;
  name: string;
  description: string;
  level: string;
  time: number;
  questionCount: number;
  participantsCount: number;
}
// Sample quiz data
const sampleQuizzes = [
  {
    id: 1,
    name: "Galaxies & Clusters",
    description: "Test your knowledge about galaxies and star clusters.",
    level: "Intermediate",
    time: 20,
    questionCount: 15,
    participantsCount: 1234,
  },
  {
    id: 2,
    name: "Astrobiology Basics",
    description: "Explore the basics of life beyond Earth.",
    level: "Beginner",
    time: 15,
    questionCount: 10,
    participantsCount: 890,
  },
  {
    id: 3,
    name: "Black Holes Quiz",
    description: "Dive into the mysteries of black holes.",
    level: "Advanced",
    time: 25,
    questionCount: 20,
    participantsCount: 456,
  },
];

const MyUniverse = () => {
  const [activeTab, setActiveTab] = useState("Quizzes");

  // Handlers for quiz card buttons
  const handleParticipate = (quiz: Quiz) => {
    alert(`Participate clicked for quiz: ${quiz.name}`);
  };

  const handleEdit = (quiz: Quiz) => {
    alert(`Edit clicked for quiz: ${quiz.name}`);
  };
  return (
    <div className="p-6 text-white bg-[#0f172a] ">
      {/* Summary Card */}
      <div className="justify-between items-center">
        <h2>My Universe</h2>
        <div className="text-sm text-white/80">
          ⭐ Favorites: 6 &nbsp;| 🎯 Competitions: 3 &nbsp;| 📚 Mentor Courses: 1 &nbsp;| 🪐 Services: 2
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 flex-wrap mb-6 mt-9">
        {tabs.map((tab) => (
        <Button
          key={tab.name}
          variant={activeTab === tab.name ? "secondary" : "ghost"}
          className="flex items-center gap-2 text-sm font-semibold"
          onClick={() => setActiveTab(tab.name)}
        >
          {tab.icon}
          {tab.name}
        </Button>

        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4 shadow-inner border border-white/10">
        {activeTab === "Quizzes" && (
          <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {sampleQuizzes.map((quiz: Quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onParticipate={handleParticipate}
                onEdit={handleEdit}
                isMyQuiz={false}
              />
            ))}

          </div>
        )}

        {/* ...other tabs content unchanged */}
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

        {/* ... rest of your tabs */}
      </div>
    </div>
  );
};

export default MyUniverse;
