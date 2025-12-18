// src/components/ui/RequestAccessSection.jsx

import React, { useEffect, useState } from "react";
import {
  requestAccess,
  checkAccess,
  getMyRequests,
} from "../../services/videoAccessService";

/**
 * Props:
 *  - videoId: number
 */
export default function RequestAccessSection({ videoId }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [myRequest, setMyRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!videoId) return;
    try {
      setLoading(true);
      const [checkRes, myReqsRes] = await Promise.all([
        checkAccess(videoId),
        getMyRequests(),
      ]);

      setHasAccess(checkRes.data.hasAccess);

      const forThisVideo = myReqsRes.data.find(
        (r) => r.videoId === videoId
      );
      setMyRequest(forThisVideo || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [videoId]);

  const handleRequest = async () => {
    const reason =
      prompt("Why do you want access to this video?") ||
      "No reason provided";
    try {
      setLoading(true);
      await requestAccess({ videoId, requestReason: reason });
      await load();
      alert("Access request sent.");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to send access request"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!videoId) return null;

  if (hasAccess) {
    return (
      <p className="mt-3 text-sm font-medium text-emerald-400">
        You have access to this video ✅
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/70 p-3">
      {loading && (
        <p className="text-xs text-slate-300">Checking access…</p>
      )}

      {!loading && myRequest && (
        <p className="text-xs text-slate-300">
          Your access request is{" "}
          <span className="font-semibold text-amber-300">
            {myRequest.status}
          </span>
          .
        </p>
      )}

      {!loading && !myRequest && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-300">
            You don&apos;t have access to this video yet.
          </p>
          <button
            onClick={handleRequest}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Request Access
          </button>
        </div>
      )}
    </div>
  );
}
