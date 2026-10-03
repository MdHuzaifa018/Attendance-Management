import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAcademicSessions, createSession } from "../../services/academicSessionService.js";

const AcademicSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAcademicSessions();
      setSessions(data);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      let latestYear = 2024;
      if (sessions && sessions.length > 0) {
         latestYear = Math.max(...sessions.map(s => s.startYear));
      }
      const nextStart = latestYear + 1;
      const nextEnd = nextStart + 1;
      const name = `${nextStart}-${nextEnd.toString().slice(-2)}`;

      await createSession({
        name: name,
        startYear: nextStart,
        endYear: nextEnd,
        startDate: `${nextStart}-07-01`,
        endDate: `${nextEnd}-06-30`,
        isCurrent: false, // Created as upcoming session
      });
      toast.success(`New Session ${name} Created!`);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create session");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Academic Sessions</h1>
        <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg font-medium">
          Create Next Year Session
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4">
        {loading ? (
          <p className="dark:text-white">Loading...</p>
        ) : (
          <table className="w-full text-left dark:text-white">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="py-2">Name</th>
                <th className="py-2">Duration</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} className="border-b dark:border-slate-800">
                  <td className="py-3 font-semibold">{s.name}</td>
                  <td className="py-3">{s.startYear} - {s.endYear}</td>
                  <td className="py-3">
                    {s.isCurrent ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AcademicSessionsPage;
