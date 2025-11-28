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
    <div className={`flex items-start gap-4 ${className}`}>
      {showAvatar && (
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/30 overflow-hidden">
              {!imageError ? (
                <img
                  src="/Photos/AiTeacher/teacher.jpg"
                  alt="AI Öğretmen Selin"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-yellow-900" />
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
            AI Öğretmen Selin
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
            AI Asistan
          </span>
        </div>
        {message && (
          <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

