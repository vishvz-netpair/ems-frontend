import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import DatePicker from "../../../components/ui/DatePicker";
import AudienceTargetEditor from "./AudienceTargetEditor";
import RichTextEditor from "./RichTextEditor";
import type { CommunicationMeta, EventItem, TargetingPayload } from "../services/communicationService";
import type { UserRole } from "../../auth/services/auth";

type Props = {
  open: boolean;
  meta: CommunicationMeta | null;
  initial?: EventItem | null;
  onClose: () => void;
  onSave: (payload: FormData, id?: string) => Promise<void>;
};

const defaultTargeting: TargetingPayload = {
  allEmployees: false,
  departmentIds: [],
  roleKeys: [] as UserRole[],
  designationIds: [],
  projectIds: [],
  userIds: []
};

export default function EventFormModal({ open, meta, initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("meeting");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("offline");
  const [meetingLink, setMeetingLink] = useState("");
  const [status, setStatus] = useState("draft");
  const [sendEmail, setSendEmail] = useState(false);
  const [sendInAppNotification, setSendInAppNotification] = useState(true);
  const [targeting, setTargeting] = useState<TargetingPayload>(defaultTargeting);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [bannerImage, setBannerImage] = useState<FileList | null>(null);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reminders, setReminders] = useState([
    { reminderType: "immediate", channels: ["in_app"] as Array<"in_app" | "email">, customDateTime: "" }
  ]);

  const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || "");
    setCategory(initial?.category || "meeting");
    setDescription(initial?.description || "");
    setPublishDate(initial?.publishDate ? initial.publishDate.slice(0, 10) : "");
    setStartDate(initial?.startDate ? initial.startDate.slice(0, 10) : "");
    setEndDate(initial?.endDate ? initial.endDate.slice(0, 10) : "");
    setStartTime(initial?.startTime || "09:00");
    setEndTime(initial?.endTime || "10:00");
    setAllDay(initial?.allDay || false);
    setLocation(initial?.location || "");
    setMode(initial?.mode || "offline");
    setMeetingLink(initial?.meetingLink || "");
    setStatus(initial?.status || "draft");
    setSendEmail(initial?.sendEmail || false);
    setSendInAppNotification(initial?.sendInAppNotification ?? true);
    setTargeting({
      allEmployees: initial?.targeting.allEmployees || false,
      departmentIds: initial?.targeting.departments?.map((item) => item.id) || [],
      roleKeys: (initial?.targeting.roles || []) as UserRole[],
      designationIds: initial?.targeting.designations?.map((item) => item.id) || [],
      projectIds: initial?.targeting.projects?.map((item) => item.id) || [],
      userIds: initial?.targeting.users?.map((item) => item.id) || []
    });
    setReminders(
      initial?.reminderSettings?.length
        ? initial.reminderSettings.map((item) => ({
            reminderType: item.reminderType,
            channels: item.channels,
            customDateTime: item.customDateTime ? item.customDateTime.slice(0, 16) : ""
          }))
        : [{ reminderType: "immediate", channels: ["in_app"], customDateTime: "" }]
    );
    setAttachments(null);
    setBannerImage(null);
    setServerError("");
    setSaving(false);
  }, [initial, open]);

  const handleSubmit = async () => {
    setSaving(true);
    setServerError("");
    try {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("category", category);
      payload.append("description", description);
      payload.append("publishDate", publishDate);
      payload.append("startDate", startDate);
      payload.append("endDate", endDate);
      payload.append("startTime", startTime);
      payload.append("endTime", endTime);
      payload.append("allDay", String(allDay));
      payload.append("location", location);
      payload.append("mode", mode);
      payload.append("meetingLink", meetingLink);
      payload.append("status", status);
      payload.append("sendEmail", String(sendEmail));
      payload.append("sendInAppNotification", String(sendInAppNotification));
      payload.append("targeting", JSON.stringify(targeting));
      payload.append(
        "reminderSettings",
        JSON.stringify(
          reminders.map((item) => ({
            reminderType: item.reminderType,
            channels: item.channels,
            customDateTime: item.customDateTime ? new Date(item.customDateTime).toISOString() : null
          }))
        )
      );

      if (attachments) {
        Array.from(attachments).forEach((file) => payload.append("attachments", file));
      }
      if (bannerImage?.[0]) payload.append("bannerImage", bannerImage[0]);

      await onSave(payload, initial?.id);
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Event" : "Create Event"}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={saving}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {serverError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Event Title" value={title} onChange={setTitle} placeholder="Event title" />
          <SelectDropdown
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { label: "Meeting", value: "meeting" },
              { label: "Training", value: "training" },
              { label: "Celebration", value: "celebration" },
              { label: "Townhall", value: "townhall" },
              { label: "Engagement", value: "engagement" },
              { label: "Other", value: "other" }
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DatePicker label="Publish Date" value={publishDate} onChange={setPublishDate} />
          <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InputField label="Start Time" type="time" value={startTime} onChange={setStartTime} />
          <InputField label="End Time" type="time" value={endTime} onChange={setEndTime} />
          <SelectDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
              { label: "Cancelled", value: "cancelled" }
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SelectDropdown
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { label: "Offline", value: "offline" },
              { label: "Online", value: "online" },
              { label: "Hybrid", value: "hybrid" }
            ]}
          />
          <InputField label="Location" value={location} onChange={setLocation} placeholder="Office / venue / city" />
          <label className="flex items-center gap-3 rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900">
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            All Day Event
          </label>
        </div>

        {(mode === "online" || mode === "hybrid") ? (
          <InputField label="Meeting Link" value={meetingLink} onChange={setMeetingLink} placeholder="https://..." />
        ) : null}

        <RichTextEditor label="Description" value={description} onChange={setDescription} />

        <AudienceTargetEditor meta={meta} value={targeting} onChange={setTargeting} />

        <div className="rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Reminder Settings</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setReminders((current) => [
                  ...current,
                  { reminderType: "1_day_before", channels: ["in_app"], customDateTime: "" }
                ])
              }
            >
              Add Reminder
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {reminders.map((item, index) => (
              <div key={`${item.reminderType}-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-3">
                <SelectDropdown
                  label="Reminder Type"
                  value={item.reminderType}
                  onChange={(value) =>
                    setReminders((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, reminderType: value as typeof entry.reminderType } : entry
                      )
                    )
                  }
                  options={[
                    { label: "Immediate", value: "immediate" },
                    { label: "1 Day Before", value: "1_day_before" },
                    { label: "1 Hour Before", value: "1_hour_before" },
                    { label: "Custom", value: "custom" }
                  ]}
                />
                <div>
                  <p className="mb-1.5 text-sm font-medium text-slate-900">Channels</p>
                  <div className="space-y-2 rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white px-4 py-3 text-sm text-slate-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.channels.includes("in_app")}
                        onChange={(e) =>
                          setReminders((current) =>
                            current.map((entry, entryIndex) =>
                              entryIndex === index
                                ? {
                                    ...entry,
                                    channels: e.target.checked
                                      ? Array.from(new Set([...entry.channels, "in_app"]))
                                      : entry.channels.filter((channel) => channel !== "in_app")
                                  }
                                : entry
                            )
                          )
                        }
                      />
                      In-App
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.channels.includes("email")}
                        onChange={(e) =>
                          setReminders((current) =>
                            current.map((entry, entryIndex) =>
                              entryIndex === index
                                ? {
                                    ...entry,
                                    channels: e.target.checked
                                      ? Array.from(new Set([...entry.channels, "email"]))
                                      : entry.channels.filter((channel) => channel !== "email")
                                  }
                                : entry
                            )
                          )
                        }
                      />
                      Email
                    </label>
                  </div>
                </div>
                <InputField
                  label="Custom Date Time"
                  type="datetime-local"
                  value={item.customDateTime}
                  onChange={(value) =>
                    setReminders((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, customDateTime: value } : entry
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white/80 p-4">
          <p className="text-sm font-semibold text-slate-900">Delivery Settings</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
              Send Email Notification
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={sendInAppNotification} onChange={(e) => setSendInAppNotification(e.target.checked)} />
              Send In-App Notification
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">Attachments</label>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => setAttachments(e.target.files)}
              className="block w-full rounded-2xl border border-[rgba(123,97,63,0.15)] bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-900">Event Banner</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setBannerImage(e.target.files)}
              className="block w-full rounded-2xl border border-[rgba(123,97,63,0.15)] bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
