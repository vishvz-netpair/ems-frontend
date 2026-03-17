import { useEffect, useRef } from "react";
import Button from "../../../components/ui/Button";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
};

export default function RichTextEditor({ label, value, onChange, helperText }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command: string) => {
    document.execCommand(command);
    onChange(editorRef.current?.innerHTML || "");
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    document.execCommand("createLink", false, url);
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">{label}</label>
      <div className="rounded-[24px] border border-[rgba(123,97,63,0.15)] bg-[rgba(255,253,248,0.92)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="mb-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("bold")}>Bold</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("italic")}>Italic</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("underline")}>Underline</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("insertUnorderedList")}>Bullet</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => runCommand("insertOrderedList")}>Numbered</Button>
          <Button type="button" variant="outline" size="sm" onClick={insertLink}>Link</Button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[180px] rounded-2xl border border-[rgba(123,97,63,0.12)] bg-white px-4 py-3 text-sm leading-7 text-slate-800 outline-none focus:ring-4 focus:ring-teal-100"
          onInput={() => onChange(editorRef.current?.innerHTML || "")}
        />
      </div>
      {helperText ? <p className="mt-1.5 text-sm text-slate-500">{helperText}</p> : null}
    </div>
  );
}
