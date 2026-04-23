import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";

export function useAndroidBackButton(handler: () => boolean | void) {
  useEffect(() => {
    let listenerHandle: any;
    let cancelled = false;

    CapApp.addListener("backButton", () => {
      const handled = handler();
      if (!handled) {
        CapApp.exitApp();
      }
    }).then((h) => {
      if (cancelled) h.remove();
      else listenerHandle = h;
    });

    return () => {
      cancelled = true;
      if (listenerHandle) listenerHandle.remove();
    };
  }, [handler]);
}
