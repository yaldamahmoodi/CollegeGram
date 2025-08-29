import { useEffect, useRef, useState } from "react";
import GroupIcon from "@/assets/icons/Group.svg";
import { EMOJIS } from "../consts/emojis";

const CaptionWithEmojis = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [caret, setCaret] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || wrapperRef.current?.contains(t))
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const rememberCaret = () => {
    const el = taRef.current;
    if (!el) return;
    setCaret({ start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 });
  };

  const insertAtCaret = (text: string) => {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart ?? caret.start;
    const end = el.selectionEnd ?? caret.end;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const next = before + text + after;
    setValue(next);
    const newPos = start + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
      setCaret({ start: newPos, end: newPos });
    });
  };

  const onEmojiClick = (emoji: string) => {
    insertAtCaret(emoji);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3 relative">
      <div className="text-center w-full text-[15px] text-black font-medium mb-1">
        کپشن مورد نظرت رو بنویس:
      </div>

      <div className="flex flex-row justify-between items-center mb-1">
        <div className="text-sm text-gray-800 font-medium">کپشن</div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-2xl cursor-pointer">
          <img
            className="w-auto h-[21px] no-repeat"
            src={GroupIcon}
            alt="step icon"
          />
        </button>
      </div>

      <div
        ref={wrapperRef}
        className="relative w-full bg-[#fff5f5] rounded-2xl border border-gray-300 p-4">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClick={rememberCaret}
          onKeyUp={rememberCaret}
          dir="rtl"
          placeholder="کپشنت رو بنویس..."
          className="w-full min-h-[120px] bg-transparent outline-none text-right text-[14px] leading-relaxed placeholder:text-gray-400 rounded-md"
        />
        {open && (
          <div
            ref={panelRef}
            className="absolute left-0 top-14 z-20 w-[340px] max-h-[280px] overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-lg p-3">
            <div className="grid grid-cols-10 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => onEmojiClick(e)}
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-pink-100 text-xl">
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CaptionWithEmojis;
