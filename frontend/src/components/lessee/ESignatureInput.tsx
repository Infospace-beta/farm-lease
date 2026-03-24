"use client";
import { useRef, useState, useEffect } from "react";

interface ESignatureInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Returns true if the value is a canvas-drawn base64 image. */
const isImageSig = (v: string) => v.startsWith("data:image");

export default function ESignatureInput({
  label,
  value,
  onChange,
  placeholder = "Type your full legal name",
  disabled = false,
}: ESignatureInputProps) {
  const [mode, setMode] = useState<"type" | "draw">(
    isImageSig(value) ? "draw" : "type"
  );
  const [typedName, setTypedName] = useState(isImageSig(value) ? "" : value);
  const [hasDrawing, setHasDrawing] = useState(isImageSig(value));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  // Restore a previously-drawn signature into the canvas on mount.
  useEffect(() => {
    if (isImageSig(value) && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
          setHasDrawing(true);
        }
      };
      img.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Canvas helpers ─────────────────────────────────────── */
  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (disabled) return;
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current || disabled) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#0f392b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const dataUrl = canvasRef.current!.toDataURL("image/png");
    onChange(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    onChange("");
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>

      {/* Mode tab switcher — hidden when disabled */}
      {!disabled && (
        <div className="flex border border-slate-200 rounded-lg overflow-hidden w-fit text-xs">
          {(["type", "draw"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                // Clear out value when switching away from a mode
                if (m === "type") {
                  onChange(typedName);
                } else {
                  if (!isImageSig(value)) onChange("");
                }
              }}
              className={`px-4 py-1.5 font-semibold transition-colors ${
                mode === m
                  ? "bg-sidebar-bg text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {m === "type" ? "✏️ Type Name" : "🖊 Draw Signature"}
            </button>
          ))}
        </div>
      )}

      {/* ── TYPE mode ──────────────────────────────────────── */}
      {(mode === "type" || disabled) && !isImageSig(value) && (
        <div className="space-y-2">
          {disabled ? (
            value ? (
              <p
                className="text-2xl border-b border-dashed border-slate-400 pb-2 text-slate-800"
                style={{ fontFamily: "cursive" }}
              >
                {value}
              </p>
            ) : (
              <p className="text-slate-400 text-sm italic">Not yet signed</p>
            )
          ) : (
            <>
              <div className="relative rounded-xl border-2 border-slate-200 focus-within:border-primary bg-white transition-colors">
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                    onChange(e.target.value);
                  }}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-transparent outline-none rounded-xl text-slate-900"
                  style={{ fontFamily: "cursive", fontSize: "1.1rem" }}
                />
                {typedName && (
                  <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-primary text-base">
                    verified
                  </span>
                )}
              </div>
              {typedName && (
                <div className="border border-dashed border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                  <p className="text-[10px] text-slate-400 mb-1">Preview</p>
                  <p className="text-2xl text-slate-800" style={{ fontFamily: "cursive" }}>
                    {typedName}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── DRAW mode ──────────────────────────────────────── */}
      {(mode === "draw" || isImageSig(value)) && (
        <div className="space-y-2">
          {disabled ? (
            isImageSig(value) ? (
              <img
                src={value}
                alt="Signature"
                className="h-14 max-w-full object-contain border-b border-dashed border-slate-400 pb-1"
              />
            ) : (
              <p className="text-slate-400 text-sm italic">Not yet signed</p>
            )
          ) : (
            <>
              <div
                className={`relative border-2 rounded-xl overflow-hidden bg-white ${
                  hasDrawing ? "border-primary" : "border-slate-200"
                }`}
              >
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  className="w-full h-28 cursor-crosshair"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!hasDrawing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-300 text-sm select-none">
                      Draw your signature here
                    </p>
                  </div>
                )}
              </div>
              {hasDrawing && (
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <span className="material-icons-round text-sm">delete_outline</span>
                  Clear &amp; redo
                </button>
              )}
            </>
          )}
        </div>
      )}

      {!disabled && (
        <p className="text-[10px] text-slate-400 flex items-center gap-1">
          <span className="material-icons-round text-[11px]">lock</span>
          By signing, you confirm this constitutes your legally binding electronic signature.
        </p>
      )}
    </div>
  );
}
