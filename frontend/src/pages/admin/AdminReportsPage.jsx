import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Download,
  Filter,
  RotateCcw,
  Search,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { getDetailedReport, downloadCSVReport } from "../../services/reportService.js";
import { getDepartments } from "../../services/departmentService.js";
import { getClasses } from "../../services/classService.js";
import { getSubjects } from "../../services/subjectService.js";

const AdminReportsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Filter lookups
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filters, setFilters] = useState({
    departmentId: "",
    classId: "",
    subjectId: "",
    startDate: "",
    endDate: "",
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    // Load lookups
    getDepartments().then(res => setDepartments(res.data)).catch(() => {});
    getClasses({ all: true }).then(res => setClasses(res.data)).catch(() => {});
    getSubjects().then(res => setSubjects(res.data)).catch(() => {});
    
    // Initial data load
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) activeFilters[k] = v;
      });
      const res = await getDetailedReport(activeFilters);
      setData(res.data || []);
    } catch {
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce or trigger manual. For safety, we can rely on a Search/Apply button
    // but if we want it instant, we can uncomment below. Let's stick to an Apply button for heavy queries.
    // loadData();
  }, [filters]);

  const updateFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const resetFilters = () => {
    setFilters({
      departmentId: "",
      classId: "",
      subjectId: "",
      startDate: "",
      endDate: "",
    });
    // Will need to manually loadData or user clicks Apply.
  };

  const handleApplyFilters = () => {
    loadData();
  };

  const handleExport = async () => {
    setDownloading(true);
    try {
      const activeFilters = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) activeFilters[k] = v;
      });
      await downloadCSVReport(activeFilters);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-500" />
            Detailed Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export granular attendance reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2
              ${showFilters 
                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" 
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={handleExport}
            disabled={downloading || data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
              <select
                value={filters.departmentId}
                onChange={(e) => updateFilter("departmentId", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Class</label>
              <select
                value={filters.classId}
                onChange={(e) => updateFilter("classId", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">All Classes</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
              <select
                value={filters.subjectId}
                onChange={(e) => updateFilter("subjectId", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter("startDate", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Search className="w-4 h-4" /> Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roll No</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Present</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">%</th>
                <th className="px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">Generating report...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <BookOpen className="w-10 h-10 opacity-50" />
                      <p className="text-sm font-medium">No records match the current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white">{row.studentName}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400">{row.rollNo}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">{row.className}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {row.subjectName} <span className="text-xs text-slate-400 ml-1">({row.subjectCode})</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{row.totalConducted}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{row.present}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white">{row.percent}%</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold
                        ${row.percent >= 75 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : row.percent >= 50 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
                        {row.percent >= 75 ? "Good" : row.percent >= 50 ? "Warning" : "Critical"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        {!loading && data.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">
              Showing {data.length} aggregated record{data.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
