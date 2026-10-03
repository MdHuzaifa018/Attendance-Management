import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import { getGraduatedStudents } from "../../services/studentService.js";
import StudentFormModal from "./StudentFormModal";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const data = await getGraduatedStudents({ limit: 5000 });
      setAlumni(data.students);
    } catch (err) {
      toast.error("Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Alumni / Passed Out Students</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Alumni
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll no, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4">
        {loading ? (
          <p className="dark:text-white">Loading...</p>
        ) : (
          <table className="w-full text-left dark:text-white">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Department</th>
              </tr>
            </thead>
            <tbody>
              {alumni
                .filter(s => {
                  const term = searchTerm.toLowerCase();
                  return (
                    s.rollNo?.toLowerCase().includes(term) ||
                    s.user?.name?.toLowerCase().includes(term) ||
                    s.batch?.toLowerCase().includes(term)
                  );
                })
                .map((s) => (
                <tr key={s._id} className="border-b dark:border-slate-800">
                  <td className="p-3 font-semibold">{s.rollNo}</td>
                  <td className="p-3">{s.user?.name}</td>
                  <td className="p-3">{s.batch || "N/A"}</td>
                  <td className="p-3">{s.department?.name}</td>
                </tr>
              ))}
              {alumni.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-500">
                    No graduated students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={null} // Only create is supported from this button for now
        defaultStatus="graduated"
        onSuccess={() => {
          fetchAlumni();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default AlumniPage;
