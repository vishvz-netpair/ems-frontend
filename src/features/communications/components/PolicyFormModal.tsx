import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import DatePicker from "../../../components/ui/DatePicker";
import { InputField } from "../../../components/ui/InputField";
import Modal from "../../../components/ui/Modal";
import SelectDropdown from "../../../components/ui/SelectDropdown";
import type { PolicyDetail } from "../services/communicationService";
import RichTextEditor from "./RichTextEditor";

type Props = {
  open: boolean;
  initial?: PolicyDetail | null;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    category: string;
    summary: string;
    content: string;
    effectiveDate: string;
    isPublished: boolean;
    changeSummary?: string;
  }, id?: string) => Promise<void>;
};

export default function PolicyFormModal({ open, initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [changeSummary, setChangeSummary] = useState("");
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || "");
    setCategory(initial?.category || "");
    setSummary(initial?.summary || "");
    setContent(initial?.content || "");
    setEffectiveDate(initial?.effectiveDate ? initial.effectiveDate.slice(0, 10) : "");
    setIsPublished(initial?.isPublished || false);
    setChangeSummary("");
    setServerError("");
    setSaving(false);
  }, [initial, open]);

  const handleSubmit = async () => {
    setSaving(true);
    setServerError("");
    try {
      await onSave(
        {
          title,
          category,
          summary,
          content,
          effectiveDate,
          isPublished,
          changeSummary
        },
        initial?.id
      );
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Failed to save policy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Update Policy" : "Create Policy"}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={saving}>
            {isEdit ? "Update Policy" : "Create Policy"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {serverError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Policy Title" value={title} onChange={setTitle} placeholder="Leave policy" />
          <InputField label="Category" value={category} onChange={setCategory} placeholder="HR / Compliance / IT" />
        </div>

        <InputField label="Summary" value={summary} onChange={setSummary} placeholder="Short policy summary" />

        <div className="grid gap-4 md:grid-cols-2">
          <DatePicker label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} />
          <SelectDropdown
            label="Status"
            value={isPublished ? "published" : "draft"}
            onChange={(value) => setIsPublished(value === "published")}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" }
            ]}
          />
        </div>

        {isEdit ? (
          <InputField
            label="Change Summary"
            value={changeSummary}
            onChange={setChangeSummary}
            placeholder="Optional note for this revision"
          />
        ) : null}

        <RichTextEditor
          label="Policy Content"
          value={content}
          onChange={setContent}
          helperText="Use the existing editor to keep policy formatting readable."
        />
      </div>
    </Modal>
  );
}
