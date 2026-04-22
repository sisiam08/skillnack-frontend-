import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Star,
  BookOpen,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import SignupForm from "../_component/Authentication/signup-form";

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mx-4 sm:mx-6 md:mx-10 lg:mx-12 xl:mx-16 my-6">
      <div className="hidden lg:flex relative overflow-hidden rounded-l-2xl bg-linear-to-br from-[#1a120d] via-[#2a1810] to-[#1a120d]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VjNWIxMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center p-12 space-y-8">
          <Badge className="w-fit flex items-center gap-2 px-4 py-2 bg-brand/20 text-brand border-none rounded-full font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              Join the Future of
              <span className="text-brand block mt-2">
                Personalized Learning
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-md">
              Connect with expert tutors or share your knowledge with eager
              learners. Your journey to success starts here.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: CheckCircle,
                text: "Verified Expert Tutors",
                color: "text-green-400",
              },
              {
                icon: BookOpen,
                text: "20+ Subjects Available",
                color: "text-blue-400",
              },
              {
                icon: Users,
                text: "Join 1K+ Active Learners",
                color: "text-purple-400",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand/50 group-hover:bg-brand/10 transition-all duration-300">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { value: "1K+", label: "Students", icon: GraduationCap },
              { value: "100+", label: "Tutors", icon: Users },
              { value: "4.9", label: "Rating", icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <stat.icon className="w-4 h-4 text-brand" />
                  <span className="text-2xl font-black text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SignupForm />
    </div>
  );
}

