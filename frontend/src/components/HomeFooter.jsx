import { Link } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  Calendar,
  Heart,
  ExternalLink,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const HomeFooter = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: College Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Nalanda College Crest"
                className="w-12 h-12 object-contain rounded-2xl shadow-md bg-white p-1"
              />
              <div>
                <h3 className="font-display font-black text-xl text-white tracking-wide leading-tight">
                  NALANDA COLLEGE
                </h3>
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  Biharsharif, Nalanda · Estd. 1870
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              A premier Constituent Unit of Patliputra University, Patna. Empowering higher
              education in Computer Applications (BCA/MCA) & Science with real-time academic
              tracking, digital attendance, and modern ERP workflows.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Patliputra Univ. Unit</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified ERP v2.4</span>
              </div>
            </div>
          </div>

          {/* Col 3: Academic Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-4 font-display">
              ERP Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Student Attendance Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Faculty / Teacher Desk</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>Administration Center</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>New Student Registration ⚡</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Features */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-4 font-display">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  1-Click Live Attendance
                </a>
              </li>
              <li>
                <a href="#timetable" className="hover:text-amber-400 transition-colors">
                  Weekly Class Routine
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-amber-400 transition-colors">
                  College Notice Board
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  Official PDF Reports & ID Cards
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  Internal Marks & SGPA
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: College Campus Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-4 font-display">
              Campus Address
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Nalanda College Campus, Ramchandrapur, Biharsharif, Nalanda - 803101</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>info@nalandacollege.ac.in</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  ● ERP Server Online & Synced
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Nalanda College ERP. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Designed & Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>by</span>
            <a
              href="https://latest-portfolio-huzaif-sheikh.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-amber-400 hover:text-amber-300 transition-colors hover:underline flex items-center gap-1"
            >
              Md Huzaifa <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
