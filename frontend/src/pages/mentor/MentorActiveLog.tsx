import React, { useState } from "react";
import Button from "../../components/Button";
import avatarImg from "../../assets/world.webp";
import "../../styles/pages/mentor/mentorprofile.scss";
import "../../styles/pages/mentor/mentoractivelog.scss";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Add proper TypeScript interfaces
interface Member {
  id: number;
  name: string;
  avatar: string;
}
interface Activity {
  id: number;
  date: string;
  endDate?: string;
  type: "session" | "break" | "accept" | "remove";
  title: string;
  rating?: number;
  extra?: boolean;
  members?: Member[];
}

const activities: Activity[] = [
  {
    id: 1,
    date: "2024-07-05",
    type: "session",
    title: "Session No. 8 - Deepspace expedition",
    rating: 4,
    extra: true,
    members: [
      { id: 1, name: "Alice", avatar: avatarImg },
      { id: 2, name: "Bob", avatar: avatarImg },
      { id: 3, name: "Carol", avatar: avatarImg },
    ],
  },
  {
    id: 2,
    date: "2024-06-05",
    endDate: "2024-06-07",
    type: "break",
    title: "Temporary break",
  },
  {
    id: 3,
    date: "2024-05-30",
    type: "accept",
    title: "Accepted <Name> mentee request",
  },
  {
    id: 4,
    date: "2024-05-05",
    type: "remove",
    title: "You removed <Name2> from your mentorship program group",
  },
];

const MentorActiveLog: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const navigate = useNavigate();

  // Filter activities by search and date
  const filtered = activities.filter((a: Activity) => {
    const matchText = a.title.toLowerCase().includes(search.toLowerCase());
    const afterFrom = !from || a.date >= from;
    const beforeTo = !to || a.date <= to;
    return matchText && afterFrom && beforeTo;
  });

  const renderDateCircle = (activity: Activity) => {
    const date = new Date(activity.date);
    return (
      <div className="date-circle">
        <div style={{ fontSize: 18 }}>{date.getDate()}</div>
        <div style={{ fontSize: 12 }}>
          {date.toLocaleString("default", { month: "short" })}
        </div>
      </div>
    );
  };

  const renderDateRangeVertical = (
    activity: Activity,
    children: React.ReactNode
  ) => {
    const startDate = new Date(activity.date);
    const endDate = new Date(activity.endDate!);
    return (
      <div className="date-range-vertical-row activity-row">
        <div className="date-range-vertical">
          <div className="date-range-circle">
            <div style={{ fontSize: 18 }}>{startDate.getDate()}</div>
            <div style={{ fontSize: 12 }}>
              {startDate.toLocaleString("default", { month: "short" })}
            </div>
          </div>
          <div className="date-range-vertical-connector" />
          <div className="date-range-circle">
            <div style={{ fontSize: 18 }}>{endDate.getDate()}</div>
            <div style={{ fontSize: 12 }}>
              {endDate.toLocaleString("default", { month: "short" })}
            </div>
          </div>
        </div>
        <div className="activity-card date-range-vertical-card">{children}</div>
      </div>
    );
  };

  const renderActivityContent = (activity: Activity) => {
    switch (activity.type) {
      case "session":
        return (
          <>
            <div
              style={{
                fontWeight: 600,
                fontSize: "1.08rem",
                color: "#fff",
                flex: 1,
              }}
            >
              {activity.title}
            </div>
            {typeof activity.rating === "number" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  marginTop: 8,
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    key={i}
                    style={{
                      width: 18,
                      color:
                        i <= (activity.rating ?? 0) ? "#fbbf24" : "#cbd5e1",
                      fill: i <= (activity.rating ?? 0) ? "#fbbf24" : "none",
                    }}
                  />
                ))}
                {activity.extra && (
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#60a5fa",
                      marginLeft: 6,
                      fontSize: 18,
                    }}
                  ></span>
                )}
              </div>
            )}
            {/* Centered member avatars only */}
            {activity.members && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 8,
                  gap: 0,
                }}
              >
                <div
                  className="session-members"
                  style={{ justifyContent: "center" }}
                >
                  {activity.members.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="member-avatar"
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 22,
                    color: "#60a5fa",
                    marginLeft: 8,
                    fontWeight: 700,
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  +
                </span>
              </div>
            )}
            <div style={{ display: "flex", marginTop: 8 }}>
              <ArrowRightIcon style={{ width: 28, color: "#60a5fa" }} />
            </div>
          </>
        );
      default:
        return (
          <div
            style={{
              fontWeight: 600,
              fontSize: "1.08rem",
              color: "#fff",
              flex: 1,
            }}
          >
            {activity.title}
          </div>
        );
    }
  };

  return (
    <div className="mentor-activity-log">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Button
          onClick={() => navigate("/dashboard/recommended-contents")}
          variant="primary"
        >
          Recommended Contents
        </Button>
        <Button
          onClick={() => navigate("/dashboard/recommended-events")}
          variant="primary"
        >
          Recommended Events
        </Button>
      </div>
      <h2>My Activity Log</h2>
      {/* Search and Date Filter */}
      <div className="activity-filters">
        <div style={{ position: "relative", flex: 1 }}>
          <input
            className="mentor-edit-input"
            style={{ paddingLeft: 36, fontSize: "1rem" }}
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search activities"
          />
          <MagnifyingGlassIcon
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 18,
              color: "#a0aec0",
              pointerEvents: "none",
            }}
          />
        </div>
        <label style={{ fontWeight: 500, fontSize: "1rem", color: "#60a5fa" }}>
          From
        </label>
        <input
          type="date"
          className="mentor-edit-input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ width: 140 }}
          aria-label="From date"
        />
        <label style={{ fontWeight: 500, fontSize: "1rem", color: "#60a5fa" }}>
          To
        </label>
        <input
          type="date"
          className="mentor-edit-input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ width: 140 }}
          aria-label="To date"
        />
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        <div className="timeline-main-line" />
        {filtered.length === 0 ? (
          <div className="no-activities">
            No activities found matching your criteria.
          </div>
        ) : (
          filtered.map((activity) =>
            activity.endDate ? (
              renderDateRangeVertical(activity, renderActivityContent(activity))
            ) : (
              <div key={activity.id} className="activity-row">
                {renderDateCircle(activity)}
                <div className="activity-card">
                  {renderActivityContent(activity)}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default MentorActiveLog;
