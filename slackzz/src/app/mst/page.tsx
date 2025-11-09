"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function MstPage() {
  const [started, setStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;

    const findCheckbox = (labelText: string) => {
      const labels = Array.from(doc.querySelectorAll("label"));
      for (const label of labels) {
        const text = label.textContent?.trim();
        if (!text) continue;
        if (text.toLowerCase().includes(labelText.toLowerCase())) {
          const forId = label.getAttribute("for");
          if (forId) {
            const linkedInput = doc.getElementById(forId);
            if (linkedInput instanceof HTMLInputElement) return linkedInput;
          }
          const nestedInput = label.querySelector("input[type='checkbox']");
          if (nestedInput instanceof HTMLInputElement) return nestedInput;
        }
      }
      return null;
    };

    const openExperimenterView = () => {
      const toggleBtn = doc.querySelector(".toggle-button");
      if (!(toggleBtn instanceof HTMLElement)) return false;
      const text = toggleBtn.textContent?.toLowerCase() ?? "";
      if (text.includes("switch to experimenter view")) {
        toggleBtn.click();
        return true;
      }
      return text.includes("switch to participant view");
    };

    const closeExperimenterView = () => {
      const toggleBtn = doc.querySelector(".toggle-button");
      if (!(toggleBtn instanceof HTMLElement)) return;
      const text = toggleBtn.textContent?.toLowerCase() ?? "";
      if (text.includes("switch to participant view")) {
        toggleBtn.click();
      }
    };

    const ensureChecked = () => {
      const pcon = findCheckbox("Perceptual Control");
      const instr = findCheckbox("Instructions");

      const toggle = (input: HTMLInputElement | null) => {
        if (!input || input.type !== "checkbox") return false;
        if (!input.checked) {
          input.click();
        }
        if (!input.checked) {
          return false;
        }
        input.disabled = true;
        return true;
      };

      const pconReady = toggle(pcon);
      const instrReady = toggle(instr);
      return pconReady && instrReady;
    };

    let attempts = 0;
    const MAX_ATTEMPTS = 15;

    const tryEnsure = () => {
      const ready = openExperimenterView();
      if (ready && ensureChecked()) {
        closeExperimenterView();
        return;
      }
      if (attempts < MAX_ATTEMPTS) {
        attempts += 1;
        setTimeout(tryEnsure, 100);
      }
    };

    tryEnsure();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background px-4 py-10">
      {started ? (
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          src="/omst/index.html"
          title="oMST Task"
          className="h-[80vh] w-full max-w-5xl rounded-lg border shadow-sm"
          allowFullScreen
        />
      ) : (
        <div className="flex max-w-xl flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Mnemonic Similarity Task
            </h1>
            <p className="text-muted-foreground">
              点击 Start 来加载 oMST 任务。页面会直接在当前路由内打开原始的
              oMST 前端。
            </p>
          </div>
          <Button size="lg" onClick={() => setStarted(true)}>
            Start
          </Button>
        </div>
      )}
    </div>
  );
}

