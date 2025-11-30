import { UserCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface AITeacherSelinProps {
  message?: string;
  showAvatar?: boolean;
  className?: string;
}

export function AITeacherSelin({ 
  message, 
  showAvatar = true,
  className = "" 
}: AITeacherSelinProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-start gap-2 sm:gap-3 md:gap-4 ${className}`}>
      {showAvatar && (
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg ring-2 sm:ring-3 md:ring-4 ring-purple-100 dark:ring-purple-900/30 overflow-hidden">
              {!imageError ? (
                <img
                  src="/Photos/AiTeacher/teacher.jpg"
                  alt="AI Öğretmen Selin"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              )}
            </div>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-900" />
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg font-semibold text-purple-700 dark:text-purple-300">
            AI Öğretmen Selin
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 sm:px-2 py-0.5 rounded-full self-start sm:self-auto">
            AI Asistan
          </span>
        </div>
        {message && (
          <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed break-words">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

