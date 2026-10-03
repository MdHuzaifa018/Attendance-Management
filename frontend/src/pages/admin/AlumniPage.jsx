import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getGraduatedStudents } from "../../services/studentService.js";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const data = await getGraduatedStudents();
      setAlumni(data.students);
    } catch (err) {
      toast.error("Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold dark:text-white mb-6">Alumni / Passed Out Students</h1>

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
              {alumni.map((s) => (
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
    </div>
  );
};

export default AlumniPage;
