import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { RefreshCw } from "lucide-react";

function formatDate(dt) {
  if (!dt) return "-";
  return new Date(dt).toLocaleString();
}

function computeStatus(row) {
  if (row.revoked) return "PERMANENTLY_REVOKED";
  if (row.suspendedUntil && new Date(row.suspendedUntil) > new Date())
    return "TEMP_SUSPENDED";
  return row.status;
}

export default function AccessViewer({ videoId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [suspendDate, setSuspendDate] = useState("");
const [suspendTime, setSuspendTime] = useState("");
const [openSuspendFor, setOpenSuspendFor] = useState(null); // which row is being suspended


  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.videoAccess.getAccessForVideo(videoId);
      setList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load access list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [videoId]);

//   const suspend = async (row) => {
//     const until = prompt(
//       "Suspend until (YYYY-MM-DDTHH:mm), example: 2025-12-10T18:00"
//     );
//     if (!until) return;

//     await api.videoAccess.suspendAccess(row.id, until);
//     load();
//   };

const refresh = () => {
    load();
  };


const suspend = async (row) => {
    if (!suspendDate || !suspendTime) {
      alert("Please select both date and time.");
      return;
    }
  
    const suspendedUntil = `${suspendDate}T${suspendTime}:00`;
  
    try {
      await api.videoAccess.suspendAccess(row.id, suspendedUntil);
      alert("Viewer Suspended Successfully");
      setOpenSuspendFor(null);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to suspend viewer");
    }
  };
  

  const revoke = async (row) => {
    if (!window.confirm("Permanently revoke access?")) return;

    const message =
      prompt("Optional message:", "Access permanently revoked") || "";

    await api.videoAccess.revokeAccessPermanent(row.id, message);
    load();
  };

  const restore = async (row) => {
    await api.videoAccess.restoreAccess(row.id);
    load();
  };

  return (
    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-semibold text-lg">Viewer Access List</h2>

        <button
          onClick={load}
          className="flex items-center space-x-1 text-gray-300 hover:text-white text-xs"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>

      {loading && <p className="text-gray-300 text-sm">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {list.length === 0 && !loading && (
        <p className="text-gray-400 text-sm">No viewers yet.</p>
      )}

      {list.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-gray-300">
            <thead>
              <tr className="bg-white/5 border border-white/10">
                <th className="p-2">Viewer</th>
                <th className="p-2">Status</th>
                <th className="p-2">Revoked</th>
                <th className="p-2">Suspended Until</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((row) => {
                const status = computeStatus(row);

                return (
                  <tr key={row.id} className="border-b border-white/10">
                    <td className="p-2">{row.viewerName}</td>
                    <td className="p-2">{status}</td>
                    <td className="p-2">{row.revoked ? "Yes" : "No"}</td>
                    <td className="p-2">{formatDate(row.suspendedUntil)}</td>
                    <td className="p-2 space-x-2">
                    <button
  onClick={() => setOpenSuspendFor(row.id)}
  className="px-2 py-1 bg-yellow-600/30 text-yellow-200 rounded"
>
  Temporary Disable
</button>


{/* {!row.revoked && (
  <>
    <button
      onClick={() => setOpenSuspendFor(row.id)}
      className="px-2 py-1 bg-yellow-600/30 text-yellow-200 rounded"
    >
      Suspend
    </button>

    {openSuspendFor === row.id && (
      <div className="mt-3 bg-gray-800 p-3 rounded-lg border border-white/10">

        <div className="flex flex-col gap-3">

          
          <div>
            <label className="text-gray-300 text-sm">Suspend Date</label>
            <input
              type="date"
              value={suspendDate}
              onChange={(e) => setSuspendDate(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />
          </div>

          
          <div>
            <label className="text-gray-300 text-sm">Suspend Time</label>
            <input
              type="time"
              value={suspendTime}
              onChange={(e) => setSuspendTime(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />
          </div>

          
          <button
            onClick={() => suspend(row)}
            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white p-2 rounded"
          >
            Confirm Suspension
          </button>

          
          <button
            onClick={() => setOpenSuspendFor(null)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded mt-1"
          >
            Cancel
          </button>

        </div>

      </div>
    )}
  </>
)} */}



                      {!row.revoked && (
                        <button
                          onClick={() => revoke(row)}
                          className="px-2 py-1 bg-red-600/30 text-red-200 rounded"
                        >
                          Permanent Disable
                        </button>
                      )}
                      {(row.revoked ||
                        (row.suspendedUntil &&
                          new Date(row.suspendedUntil) > new Date())) && (
                        <button
                          onClick={() => restore(row)}
                          className="px-2 py-1 bg-green-600/30 text-green-200 rounded"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {openSuspendFor && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">

      <h3 className="text-xl text-white mb-4">Suspend Viewer</h3>

      <label className="block text-gray-300 mb-2">Suspend Date</label>
      <input
        type="date"
        value={suspendDate}
        onChange={(e) => setSuspendDate(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-white/10 border border-white/20 text-white rounded"
      />

      <label className="block text-gray-300 mb-2">Suspend Time</label>
      <input
        type="time"
        value={suspendTime}
        onChange={(e) => setSuspendTime(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-white/10 border border-white/20 text-white rounded"
      />

      <button
        onClick={() => suspend(list.find(v => v.id === openSuspendFor))}
        className="w-full mb-3 py-2 bg-yellow-600 text-white rounded"
      >
        Confirm Suspension
      </button>

      <button
        onClick={() => setOpenSuspendFor(null)}
        className="w-full py-2 bg-gray-700 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}

        </div>
      )}
    </div>
  );
}
