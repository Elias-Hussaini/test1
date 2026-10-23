"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Card } from "@/components/app/ui";

type State = "idle" | "asking" | "on" | "denied" | "missing" | "unsupported" | "error";

/** تست دوربین و میکروفون. تا کاربر دکمه را نزند هیچ مجوزی درخواست نمی‌شود و داده‌ای ارسال نمی‌شود. */
export default function DeviceCheck() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<State>("idle");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return setState("unsupported");
    setState("asking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } });
      streamRef.current = stream;
      setMic(true);
      setCam(true);
      setState("on");
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : name === "NotFoundError" ? "missing" : "error");
    }
  };

  // ویدیو بعد از رندر عنصر وصل می‌شود
  useEffect(() => {
    if (state === "on" && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [state]);

  const toggle = (kind: "audio" | "video") => {
    const tracks = kind === "audio" ? streamRef.current?.getAudioTracks() : streamRef.current?.getVideoTracks();
    const next = !(kind === "audio" ? mic : cam);
    tracks?.forEach((t) => (t.enabled = next));
    (kind === "audio" ? setMic : setCam)(next);
  };

  const messages: Partial<Record<State, string>> = {
    denied: "دسترسی به دوربین یا میکروفون رد شد. از تنظیمات مرورگر برای این سایت اجازه بده و دوباره امتحان کن.",
    missing: "دوربین یا میکروفونی روی این دستگاه پیدا نشد.",
    unsupported: "این مرورگر یا اتصال (نیازمند HTTPS) از دوربین و میکروفون پشتیبانی نمی‌کند.",
    error: "راه‌اندازی دستگاه‌ها ناموفق بود. برنامه‌های دیگری که از دوربین استفاده می‌کنند را ببند و دوباره تلاش کن.",
  };

  return (
    <Card>
      <h2 className="font-extrabold">تست دوربین و میکروفون</h2>
      <p className="mt-1.5 text-sm leading-7 text-muted">قبل از ورود به کلاس یا تماس، دستگاه‌هایت را امتحان کن. تصویر فقط روی همین دستگاه نمایش داده می‌شود و ارسال نمی‌شود.</p>

      <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-foreground/[0.06]">
        {state === "on" ? (
          <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full -scale-x-100 object-cover ${cam ? "" : "invisible"}`} />
        ) : null}
        {state !== "on" ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted">
            {messages[state] ? <p role="alert" className="text-danger">{messages[state]}</p> : <p>پیش‌نمایش دوربین اینجا نمایش داده می‌شود.</p>}
          </div>
        ) : !cam ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted"><CameraOff aria-hidden="true" className="h-10 w-10" /></div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {state === "on" ? (
          <>
            <button type="button" className="icon-btn !h-12 !w-12" aria-pressed={!mic} aria-label={mic ? "قطع میکروفون" : "وصل میکروفون"} onClick={() => toggle("audio")}>
              {mic ? <Mic aria-hidden="true" className="h-5 w-5" /> : <MicOff aria-hidden="true" className="h-5 w-5 text-danger" />}
            </button>
            <button type="button" className="icon-btn !h-12 !w-12" aria-pressed={!cam} aria-label={cam ? "خاموش‌کردن دوربین" : "روشن‌کردن دوربین"} onClick={() => toggle("video")}>
              {cam ? <Camera aria-hidden="true" className="h-5 w-5" /> : <CameraOff aria-hidden="true" className="h-5 w-5 text-danger" />}
            </button>
            <button type="button" className="btn-soft !bg-danger/10 !text-danger" onClick={stop}>
              <PhoneOff aria-hidden="true" className="h-4 w-4" /> پایان تست
            </button>
          </>
        ) : (
          <button type="button" className="btn-primary" onClick={start} disabled={state === "asking"}>
            <Camera aria-hidden="true" className="h-4 w-4" />
            {state === "asking" ? "منتظر اجازه‌ی مرورگر…" : "شروع تست"}
          </button>
        )}
      </div>
    </Card>
  );
}
