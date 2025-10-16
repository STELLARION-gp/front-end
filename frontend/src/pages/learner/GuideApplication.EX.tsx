import { useState } from "react";
import LocationPicker from "../../components/LocationPicker";
import AvailabilityTimePicker from "../../components/AvailabilityTimePicker";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useI18n } from "../../i18n/useI18n";
import styles from "../../styles/pages/GuideApplication.module.scss";

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
interface GuideApplicationForm {
  phone_number: string;
  country: string;
  languages_spoken: string[];
  certifications: string[];
  stargazing_expertise: string[];
  operating_locations: ({ lat: number; lng: number } | null)[];
  profile_bio: string;
  services_offered: string[];
  max_group_size: number;
  pricing_min: string;
  pricing_max: string;
  photos_or_videos_links: string[];
  availability_schedule: { [K in DayOfWeek]: string[] };
  payment_method_pref: string;
}

const GuideApplication = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState<GuideApplicationForm>({
    phone_number: "",
    country: "",
    languages_spoken: [""],
    certifications: [""],
    stargazing_expertise: [""],
    operating_locations: [null],
    profile_bio: "",
    services_offered: [""],
    max_group_size: 10,
    pricing_min: "",
    pricing_max: "",
    photos_or_videos_links: [""],
    availability_schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    payment_method_pref: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const handleArrayChange = <K extends keyof GuideApplicationForm>(
    name: K,
    idx: number,
    value: GuideApplicationForm[K] extends (infer U)[] ? U : never
  ) => {
    setForm((prev) => {
      const arr = Array.isArray(prev[name]) ? [...(prev[name] as any[])] : [];
      arr[idx] = value;
      return { ...prev, [name]: arr };
    });
  };
  // For location array
  const handleLocationChange = (
    idx: number,
    value: { lat: number; lng: number } | null
  ) => {
    setForm((prev) => {
      const arr = [...prev.operating_locations];
      arr[idx] = value;
      return { ...prev, operating_locations: arr };
    });
  };
  const handleAddArrayItem = <K extends keyof GuideApplicationForm>(
    name: K
  ) => {
    setForm((prev) => {
      const arr = Array.isArray(prev[name])
        ? [...(prev[name] as any[]), ""]
        : [""];
      return { ...prev, [name]: arr };
    });
  };
  const handleRemoveArrayItem = <K extends keyof GuideApplicationForm>(
    name: K,
    idx: number
  ) => {
    setForm((prev) => {
      const arr = Array.isArray(prev[name]) ? [...(prev[name] as any[])] : [];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  // Handle availability_schedule (object of day: [times])
  const handleScheduleChange = (day: DayOfWeek, idx: number, value: string) => {
    setForm((prev) => {
      const dayArr = [...prev.availability_schedule[day]];
      dayArr[idx] = value;
      return {
        ...prev,
        availability_schedule: { ...prev.availability_schedule, [day]: dayArr },
      };
    });
  };
  const handleAddSchedule = (day: DayOfWeek) => {
    setForm((prev) => {
      const dayArr = [...prev.availability_schedule[day], ""];
      return {
        ...prev,
        availability_schedule: { ...prev.availability_schedule, [day]: dayArr },
      };
    });
  };
  const handleRemoveSchedule = (day: DayOfWeek, idx: number) => {
    setForm((prev) => {
      const dayArr = [...prev.availability_schedule[day]];
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
    try {
      // TODO: Add auth token
      const res = await fetch("/api/guide-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        navigate("/dashboard/profile");
      } else {
        setError("Failed to submit application");
      }
    } catch {
      setError("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  // Use theme background and button colors for consistency with modals
  return (
    <div className={styles["guide-app-bg"]}>
      <div className={styles["guide-app-container"]}>
        <h2 className={styles["guide-app-title"]}>
          {t("guideApplication.title", "Guide Application")}
        </h2>
        <p className={styles["guide-app-desc"]}>
          {t(
            "guideApplication.description",
            "Fill out this form to apply as a Guide. Please provide accurate and complete information. All fields are required unless marked optional."
          )}
        </p>
        <form onSubmit={handleSubmit} className={styles["guide-app-form"]}>
          <InputField
            label={t("guideApplication.fields.phone_number", "Phone Number")}
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder={t(
              "guideApplication.placeholders.phone_number",
              "Phone Number"
            )}
          />
          <InputField
            label={t("guideApplication.fields.country", "Country")}
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder={t("guideApplication.placeholders.country", "Country")}
          />
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.languages_spoken",
                "Languages Spoken"
              )}
            </label>
            {form.languages_spoken.map((lang, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <div
                  className="form-group"
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <div className={styles["inputfield-like-checkbox"]}>
                    {["Sinhala", "Tamil", "English"].map((option) => (
                      <label
                        key={option}
                        style={{
                          marginRight: "1.5rem",
                          display: "inline-flex",
                          alignItems: "center",
                          fontWeight: 500,
                        }}
                      >
                        <input
                          type="checkbox"
                          name={`languages_spoken_${idx}_${option}`}
                          value={option}
                          checked={
                            Array.isArray(lang)
                              ? lang.includes(option)
                              : lang === option
                          }
                          onChange={(e) => {
                            let newVal = Array.isArray(lang)
                              ? [...lang]
                              : lang
                              ? [lang]
                              : [];
                            if (e.target.checked) {
                              if (!newVal.includes(option)) newVal.push(option);
                            } else {
                              newVal = newVal.filter((l) => l !== option);
                            }
                            handleArrayChange(
                              "languages_spoken",
                              idx,
                              newVal.toString()
                            );
                          }}
                          className={styles["checkbox-input"]}
                          style={{ marginRight: 6 }}
                        />
                        {t(
                          `guideApplication.language.${option.toLowerCase()}`,
                          option
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Delete icon removed for language select */}
              </div>
            ))}
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t("guideApplication.fields.certifications", "Certifications")}
            </label>
            {form.certifications.map((cert, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <InputField
                  label=""
                  id={`certifications_${idx}`}
                  value={cert}
                  onChange={(e) =>
                    handleArrayChange("certifications", idx, e.target.value)
                  }
                  placeholder={t(
                    "guideApplication.placeholders.certification",
                    "Certification"
                  )}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("certifications", idx)}
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
              onClick={() => handleAddArrayItem("certifications")}
              className="text-blue-400"
            >
              {t(
                "guideApplication.actions.add_certification",
                "Add Certification"
              )}
            </button>
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.stargazing_expertise",
                "Stargazing Expertise"
              )}
            </label>
            {form.stargazing_expertise.map((exp, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <InputField
                  label=""
                  id={`stargazing_expertise_${idx}`}
                  value={exp}
                  onChange={(e) =>
                    handleArrayChange(
                      "stargazing_expertise",
                      idx,
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "guideApplication.placeholders.expertise",
                    "Expertise"
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem("stargazing_expertise", idx)
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
              onClick={() => handleAddArrayItem("stargazing_expertise")}
              className="text-blue-400"
            >
              {t("guideApplication.actions.add_expertise", "Add Expertise")}
            </button>
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.operating_locations",
                "Operating Locations"
              )}
            </label>
            {form.operating_locations.map((loc, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <LocationPicker
                  value={loc}
                  onChange={(val) => handleLocationChange(idx, val)}
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem("operating_locations", idx)
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
              onClick={() => handleAddArrayItem("operating_locations")}
              className="text-blue-400"
            >
              {t("guideApplication.actions.add_location", "Add Location")}
            </button>
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t("guideApplication.fields.profile_bio", "Profile Bio")}
            </label>
            <textarea
              id="profile_bio"
              name="profile_bio"
              value={form.profile_bio}
              onChange={handleChange}
              placeholder={t(
                "guideApplication.placeholders.profile_bio",
                "Profile Bio"
              )}
              className={styles["guide-textarea"]}
              rows={3}
            />
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.services_offered",
                "Services Offered"
              )}
            </label>
            {form.services_offered.map((srv, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <InputField
                  label=""
                  id={`services_offered_${idx}`}
                  value={srv}
                  onChange={(e) =>
                    handleArrayChange("services_offered", idx, e.target.value)
                  }
                  placeholder={t(
                    "guideApplication.placeholders.service",
                    "Service"
                  )}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("services_offered", idx)}
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
              onClick={() => handleAddArrayItem("services_offered")}
              className="text-blue-400"
            >
              {t("guideApplication.actions.add_service", "Add Service")}
            </button>
          </div>
          <InputField
            label={t(
              "guideApplication.fields.max_group_size",
              "Max Group Size"
            )}
            id="max_group_size"
            name="max_group_size"
            type="number"
            value={form.max_group_size}
            onChange={handleChange}
          />
          <div className={styles["guide-row"]}>
            <InputField
              label={t("guideApplication.fields.pricing_min", "Min Price")}
              id="pricing_min"
              name="pricing_min"
              type="number"
              value={form.pricing_min}
              onChange={handleChange}
              placeholder={t(
                "guideApplication.placeholders.pricing_min",
                "Min"
              )}
            />
            <span
              style={{ color: "#fff", fontWeight: 500, margin: "0 0.5rem" }}
            >
              -
            </span>
            <InputField
              label={t("guideApplication.fields.pricing_max", "Max Price")}
              id="pricing_max"
              name="pricing_max"
              type="number"
              value={form.pricing_max}
              onChange={handleChange}
              placeholder={t(
                "guideApplication.placeholders.pricing_max",
                "Max"
              )}
            />
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.photos_or_videos_links",
                "Photos or Videos Links"
              )}
            </label>
            {form.photos_or_videos_links.map((link, idx) => (
              <div key={idx} className={styles["guide-row"]}>
                <InputField
                  label=""
                  id={`photos_or_videos_links_${idx}`}
                  value={link}
                  onChange={(e) =>
                    handleArrayChange(
                      "photos_or_videos_links",
                      idx,
                      e.target.value
                    )
                  }
                  placeholder={t("guideApplication.placeholders.url", "URL")}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem("photos_or_videos_links", idx)
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
              onClick={() => handleAddArrayItem("photos_or_videos_links")}
              className="text-blue-400"
            >
              {t("guideApplication.actions.add_link", "Add Link")}
            </button>
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.availability_schedule",
                "Availability Schedule"
              )}
            </label>
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
              <div key={day} className="mb-2">
                <div className="font-semibold capitalize">
                  {t(`guideApplication.days.${day}`, day)}
                </div>
                {(form.availability_schedule[day] || []).map((slot, idx) => (
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
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSchedule(day)}
                  className="text-blue-400"
                >
                  {t("guideApplication.actions.add_time", "Add Time")}
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className={styles["guide-label"]}>
              {t(
                "guideApplication.fields.payment_method_pref",
                "Payment Method Preference"
              )}
            </label>
            <select
              name="payment_method_pref"
              value={form.payment_method_pref}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
            >
              <option value="">
                {t("guideApplication.placeholders.select", "Select...")}
              </option>
              <option value="Bank">
                {t("guideApplication.paymentMethods.bank", "Bank")}
              </option>
              <option value="e-wallet">
                {t("guideApplication.paymentMethods.ewallet", "E-wallet")}
              </option>
              <option value="PayPal">
                {t("guideApplication.paymentMethods.paypal", "PayPal")}
              </option>
              <option value="Other">
                {t("guideApplication.paymentMethods.other", "Other")}
              </option>
            </select>
          </div>
          <div className={styles["guide-btn-row"]}>
            <Button
              type="submit"
              className={styles["guide-btn"]}
              disabled={loading}
            >
              {loading
                ? t("guideApplication.actions.submitting", "Submitting...")
                : t("guideApplication.actions.submit", "Submit")}
            </Button>
            <Button
              type="button"
              className={styles["guide-btn-secondary"]}
              variant="secondary"
              onClick={() => navigate("/dashboard/profile")}
            >
              {t("common.cancel", "Cancel")}
            </Button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default GuideApplication;
