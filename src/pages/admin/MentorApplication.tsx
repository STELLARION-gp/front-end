import { useState } from "react";
import { useI18n } from "../../i18n/useI18n";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import styles from "../../styles/pages/GuideApplication.module.scss";
import AvailabilityTimePicker from "../../components/AvailabilityTimePicker";

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
type MentorForm = {
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  country: string;
  profile_bio: string;
  educational_background: string;
  area_of_expertise: string[];
  linkedin_profile: string;
  intro_video_url: string;
  max_mentees: number;
  availability_schedule: Record<DayOfWeek, string[]>;
  motivation_statement: string;
  portfolio_attachments: string[];
};

const initialForm: MentorForm = {
  name: "",
  email: "",
  phone_number: "",
  date_of_birth: "",
  country: "",
  profile_bio: "",
  educational_background: "",
  area_of_expertise: [""],
  linkedin_profile: "",
  intro_video_url: "",
  max_mentees: 3,
  availability_schedule: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  motivation_statement: "",
  portfolio_attachments: [""],
};

const MentorApplication = () => {
  const { t } = useI18n();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle simple fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Handle array fields
  const handleArrayChange = (
    name: "area_of_expertise" | "portfolio_attachments",
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...((prev[name] as string[]) || [])];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };
  const handleAddArrayItem = (
    name: "area_of_expertise" | "portfolio_attachments"
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: [...((prev[name] as string[]) || []), ""],
    }));
  };
  const handleRemoveArrayItem = (
    name: "area_of_expertise" | "portfolio_attachments",
    idx: number
  ) => {
    setForm((prev) => {
      const arr = [...((prev[name] as string[]) || [])];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  // Handle availability_schedule (object of day: [times])
  const handleScheduleChange = (day: DayOfWeek, idx: number, value: string) => {
    setForm((prev) => {
      const dayArr = [...(prev.availability_schedule[day] || [])];
      dayArr[idx] = value;
      return {
        ...prev,
        availability_schedule: { ...prev.availability_schedule, [day]: dayArr },
      };
    });
  };
  const handleAddSchedule = (day: DayOfWeek) => {
    setForm((prev) => {
      const dayArr = [...(prev.availability_schedule[day] || []), ""];
      return {
        ...prev,
        availability_schedule: { ...prev.availability_schedule, [day]: dayArr },
      };
    });
  };
  const handleRemoveSchedule = (day: DayOfWeek, idx: number) => {
    setForm((prev) => {
      const dayArr = [...(prev.availability_schedule[day] || [])];
      dayArr.splice(idx, 1);
      return {
        ...prev,
        availability_schedule: { ...prev.availability_schedule, [day]: dayArr },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/mentor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        setSuccess(
          t(
            "mentorManagement.applicationSuccess",
            "Mentor application submitted successfully."
          )
        );
        setForm(initialForm);
      } else {
        setError(
          t(
            "mentorManagement.applicationError",
            "Failed to submit mentor application."
          )
        );
      }
    } catch {
      setError(
        t(
          "mentorManagement.applicationError",
          "Failed to submit mentor application."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["guide-app-bg"]}>
      <div className={styles["guide-app-container"]}>
        <h2 className={styles["guide-app-title"]}>
          {t("mentorManagement.addMentor", "Add Mentor")}
        </h2>
        <p className={styles["guide-app-desc"]}>
          {t(
            "mentorManagement.applicationDesc",
            "Fill in the details to add a new mentor."
          )}
        </p>
        <form onSubmit={handleSubmit} className={styles["guide-app-form"]}>
          <InputField
            label={t("common.name", "Name")}
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <InputField
            label={t("common.email", "Email")}
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <InputField
            label={t("mentorManagement.phoneNumber", "Phone Number")}
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
          />
          <InputField
            label={t("mentorManagement.dateOfBirth", "Date of Birth")}
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            required
          />
          <InputField
            label={t("mentorManagement.country", "Country")}
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
          <InputField
            label={t("mentorManagement.maxMentees", "Max Mentees")}
            id="max_mentees"
            name="max_mentees"
            type="number"
            min={1}
            value={form.max_mentees}
            onChange={handleChange}
            required
          />
          <div>
            <label className={styles["guide-label"]}>
              {t("mentorManagement.profileBio", "Profile Bio")}
            </label>
            <textarea
              id="profile_bio"
              name="profile_bio"
              value={form.profile_bio}
              onChange={handleChange}
              className={styles["guide-textarea"]}
              rows={3}
              placeholder={t(
                "mentorManagement.profileBioPlaceholder",
                "Profile Bio"
              )}
            />
          </div>
          <InputField
            label={t(
              "mentorManagement.educationalBackground",
              "Educational Background"
            )}
            id="educational_background"
            name="educational_background"
            value={form.educational_background}
            onChange={handleChange}
          />
          <div>
            <label className={styles["mentor-label"]}>
              {t("mentorManagement.areaOfExpertise", "Area of Expertise")}
            </label>
            <div className={styles["array-item-container"]}>
              {form.area_of_expertise.map((exp, idx) => (
                <div key={idx} className={styles["guide-row"]}>
                  <InputField
                    label=""
                    id={`area_of_expertise_${idx}`}
                    value={exp}
                    onChange={(e) =>
                      handleArrayChange(
                        "area_of_expertise",
                        idx,
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "mentorManagement.areaOfExpertisePlaceholder",
                      "Expertise"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem("area_of_expertise", idx)
                    }
                    className={styles["guide-remove-btn"]}
                    aria-label={t("common.delete", "Remove")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("area_of_expertise")}
                className={styles["add-button"]}
              >
                {t("mentorManagement.addExpertise", "Add Expertise")}
              </button>
            </div>
          </div>
          <InputField
            label={t("mentorManagement.linkedinProfile", "LinkedIn Profile")}
            id="linkedin_profile"
            name="linkedin_profile"
            value={form.linkedin_profile}
            onChange={handleChange}
          />
          <InputField
            label={t("mentorManagement.introVideoUrl", "Intro Video URL")}
            id="intro_video_url"
            name="intro_video_url"
            value={form.intro_video_url}
            onChange={handleChange}
          />
          <div>
            <label className={styles["mentor-label"]}>
              {t(
                "mentorManagement.availabilitySchedule",
                "Availability Schedule"
              )}
            </label>
            <div className={styles["form-section"]}>
              {(
                [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ] as DayOfWeek[]
              ).map((day) => (
                <div key={day} className={styles["day-schedule"]}>
                  <div className={styles["day-title"]}>
                    {t(`mentorManagement.days.${day}`, day)}
                  </div>
                  {(form.availability_schedule[day] || []).map(
                    (slot: string, idx: number) => (
                      <div key={idx} className={styles["guide-row"]}>
                        <AvailabilityTimePicker
                          value={slot}
                          onChange={(val) =>
                            handleScheduleChange(day, idx, val ?? "")
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(day, idx)}
                          className={styles["guide-remove-btn"]}
                          aria-label={t("common.delete", "Remove")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => handleAddSchedule(day)}
                    className={styles["add-button"]}
                  >
                    {t("mentorManagement.addTime", "Add Time")}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "mentorManagement.motivationStatement",
                "Motivation Statement"
              )}
            </label>
            <textarea
              id="motivation_statement"
              name="motivation_statement"
              value={form.motivation_statement}
              onChange={handleChange}
              className={styles["guide-textarea"]}
              rows={3}
              placeholder={t(
                "mentorManagement.motivationStatementPlaceholder",
                "Motivation Statement"
              )}
            />
          </div>
          <div>
            <label className={styles["mentor-label"]}>
              {t(
                "mentorManagement.portfolioAttachments",
                "Portfolio Attachments"
              )}
            </label>
            <div className={styles["array-item-container"]}>
              {form.portfolio_attachments.map((url, idx) => (
                <div key={idx} className={styles["guide-row"]}>
                  <InputField
                    label=""
                    id={`portfolio_attachments_${idx}`}
                    value={url}
                    onChange={(e) =>
                      handleArrayChange(
                        "portfolio_attachments",
                        idx,
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "mentorManagement.portfolioAttachmentsPlaceholder",
                      "URL"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem("portfolio_attachments", idx)
                    }
                    className={styles["guide-remove-btn"]}
                    aria-label={t("common.delete", "Remove")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("portfolio_attachments")}
                className={styles["add-button"]}
              >
                {t("mentorManagement.addAttachment", "Add Attachment")}
              </button>
            </div>
          </div>
          {error && <div className={styles["error-message"]}>{error}</div>}
          {success && (
            <div className={styles["success-message"]}>{success}</div>
          )}
          <div className={styles["guide-btn-row"]}>
            <Button
              type="submit"
              // className={styles['guide-btn']}
              disabled={loading}
              loading={loading}
            >
              {loading
                ? t("guideApplication.actions.submitting", "Submitting...")
                : t("guideApplication.actions.submit", "Submit")}
            </Button>
            <Button
              type="button"
              // className={styles['guide-btn-secondary']}
              variant="secondary"
              onClick={() => window.history.back()}
            >
              {t("common.cancel", "Cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorApplication;
