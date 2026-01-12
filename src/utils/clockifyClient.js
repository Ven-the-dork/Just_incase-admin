import { getAuth } from "firebase/auth";
import { supabase } from "../supabaseClient";

function getCurrentUserOrThrow() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  return user;
}

function hoursToHrMin(hoursFloat) {
  if (typeof hoursFloat !== "number" || Number.isNaN(hoursFloat)) return null;
  const totalMinutes = Math.max(0, Math.round(hoursFloat * 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return { h, m };
}

async function toReadableError(err) {
  const context = err?.context;

  if (context instanceof Response) {
    let body = null;

    try {
      body = await context.json();
    } catch {
      // ignore
    }

    // If this is our early validation error with remainingHours (old clock-out logic)
    const remaining = hoursToHrMin(body?.remainingHours);
    if (body?.error && remaining) {
      throw new Error(`${body.error} Remaining: ${remaining.h}h ${remaining.m}m.`);
    }

    // ✅ show details first, then error/message
    throw new Error(body?.details || body?.error || body?.message || err?.message || "Request failed");
  }

  throw new Error(err?.message || "Request failed");
}

export async function clockifyClockIn() {
  const user = getCurrentUserOrThrow();

  const { data, error } = await supabase.functions.invoke("clockify-attendance", {
    body: { action: "clockIn", firebaseUid: user.uid },
  });

  if (error) await toReadableError(error);
  return data;
}
