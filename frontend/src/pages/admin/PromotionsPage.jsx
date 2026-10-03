import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getClasses } from "../../services/classService.js";
import { getAcademicSessions } from "../../services/academicSessionService.js";
import { getPromotionPreview, executePromotion } from "../../services/promotionService.js";

const PromotionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [targetSessionId, setTargetSessionId] = useState("");
  const [fromClassId, setFromClassId] = useState("");

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [sessData, classData] = await Promise.all([
          getAcademicSessions(),
          getClasses()
        ]);
        setSessions(sessData);
        setClasses(classData.classes || []);
      } catch (err) {
        toast.error("Failed to load init data");
      }
    };
    init();
  }, []);

  const handleGeneratePreview = async () => {
    if (!currentSessionId || !targetSessionId || !fromClassId) {
      toast.error("Please select all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await getPromotionPreview({ currentSessionId, targetSessionId, fromClassId });
      setPreview(data);
    } catch (err) {
      toast.error("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!preview || !preview.preview.length) return;
    setLoading(true);
    try {
      await executePromotion({
        currentSessionId,
        targetSessionId,
        promotions: preview.preview
      });
      toast.success("Promotion Executed Successfully!");
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to execute promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Promotions Wizard</h1>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">From Session</label>
          <select 
            value={currentSessionId} 
            onChange={e => setCurrentSessionId(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <option value="">Select...</option>
            {sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">To Session (Next Year)</label>
          <select 
            value={targetSessionId} 
            onChange={e => setTargetSessionId(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <option value="">Select...</option>
            {sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Class</label>
          <select 
            value={fromClassId} 
            onChange={e => setFromClassId(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <option value="">Select...</option>
            {classes.filter(c => c.academicSession === currentSessionId).map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleGeneratePreview}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
        >
          Preview
        </button>
      </div>

      {preview && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4 dark:text-white">Promotion Preview</h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Proposed Action</th>
                </tr>
              </thead>
              <tbody>
                {preview.preview.map(p => (
                  <tr key={p.enrollmentId} className="border-b dark:border-slate-700">
                    <td className="p-3 font-medium">{p.rollNo}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        p.proposedAction === 'promoted' ? 'bg-green-100 text-green-700' :
                        p.proposedAction === 'graduated' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {p.proposedAction.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={handleExecute}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Executing..." : "Confirm & Execute Promotion"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
