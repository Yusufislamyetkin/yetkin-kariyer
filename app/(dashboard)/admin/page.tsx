"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Loader2, CheckCircle2, AlertCircle, BookOpen, Trash2, Code2, Database, Globe, Zap, Shield, Container, Lock, FileText, Users, Trophy, Briefcase, MessageCircle, Building2, Bug, Upload, Eye, Cloud } from "lucide-react";

interface CourseStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
  stats: {
    modulesCreated?: number;
    lessonsCreated?: number;
    totalDuration?: number;
  } | null;
}

interface ClearStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
}

interface ProfileStatus {
  loading: boolean;
  success: string | null;
  error: string | null;
  stats: {
    totalCreated?: number;
    maleCount?: number;
    femaleCount?: number;
    newAvatarMaleCount?: number;
    newAvatarFemaleCount?: number;
    regularMaleCount?: number;
    regularFemaleCount?: number;
    noPhotoMaleCount?: number;
    noPhotoFemaleCount?: number;
    noPhotoTotalCount?: number;
  } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [courseState, setCourseState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const [clearState, setClearState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [clearTestsState, setClearTestsState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });


  const [profileState, setProfileState] = useState<ProfileStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const [noPhotoUserCount, setNoPhotoUserCount] = useState<number>(1000);

  const [deleteProfileState, setDeleteProfileState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [assignProfilesState, setAssignProfilesState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });


  const [communityState, setCommunityState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const [communityCount, setCommunityCount] = useState<number | null>(null);

  const [hackathonSeedState, setHackathonSeedState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [hackathonClearState, setHackathonClearState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [freelancerSeedState, setFreelancerSeedState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [jobSeedState, setJobSeedState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });


  const [liveCodingCasesState, setLiveCodingCasesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [deleteLiveCodingCasesState, setDeleteLiveCodingCasesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [juniorCasesState, setJuniorCasesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [bugfixCasesState, setBugfixCasesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [deleteBugfixCasesState, setDeleteBugfixCasesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const [testTechnologiesState, setTestTechnologiesState] = useState<CourseStatus>({
    loading: false,
    success: null,
    error: null,
    stats: null,
  });

  const [cvTemplatesState, setCvTemplatesState] = useState<ClearStatus>({
    loading: false,
    success: null,
    error: null,
  });

  const handleCreateDotNetCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/dotnet-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateJavaCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/java", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateMssqlCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/mssql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateNodeJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/nodejs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateReactCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAngularCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/angular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAICourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/ai-for-developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateFlutterCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/flutter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateEthicalHackingCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/ethical-hacking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateNextJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/nextjs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateDockerKubernetesCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/docker-kubernetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateOwaspCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/owasp-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreatePythonCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  // Faz 1 Teknolojileri
  const handleCreateVueJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/vuejs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateTypeScriptCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/typescript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateGoCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/go", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreatePostgreSQLCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/postgresql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAWSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/aws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateAzureCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/azure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  // Faz 2 Teknolojileri
  const handleCreateSwiftCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/swift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateKotlinCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/kotlin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateMongoDBCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/mongodb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateSpringBootCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/spring-boot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleCreateNestJSCourse = async () => {
    setCourseState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course/nestjs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kurs oluşturulurken bir hata oluştu");
      }

      setCourseState({
        loading: false,
        success: data.message || "Kurs başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setCourseState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  // Topluluk sayısını yükle
  useEffect(() => {
    const fetchCommunityCount = async () => {
      try {
        const response = await fetch("/api/admin/community-count");
        if (response.ok) {
          const data = await response.json();
          setCommunityCount(data.count || 0);
        }
      } catch (error) {
        console.error("Topluluk sayısı alınırken hata:", error);
      }
    };

    fetchCommunityCount();
  }, []);

  const handleCreateCourseCommunities = async () => {
    setCommunityState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/create-course-communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Yardımlaşma toplulukları oluşturulurken bir hata oluştu");
      }

      setCommunityState({
        loading: false,
        success: data.message || "Yardımlaşma toplulukları başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });

      // Topluluk sayısını güncelle
      const countResponse = await fetch("/api/admin/community-count");
      if (countResponse.ok) {
        const countData = await countResponse.json();
        setCommunityCount(countData.count || 0);
      }
    } catch (err: any) {
      setCommunityState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleAssignProfilesToCommunities = async () => {
    setAssignProfilesState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/assign-profiles-to-communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profiller topluluklara atanırken bir hata oluştu");
      }

      setAssignProfilesState({
        loading: false,
        success: data.message || "Profiller başarıyla topluluklara atandı",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setAssignProfilesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleInsertTestTechnologies = async () => {
    setTestTechnologiesState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      const response = await fetch("/api/admin/insert-test-technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test teknolojileri eklenirken bir hata oluştu");
      }

      setTestTechnologiesState({
        loading: false,
        success: data.message || "Test teknolojileri başarıyla eklendi",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      setTestTechnologiesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };


  const handleInsertLiveCodingCases = async () => {
    setLiveCodingCasesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/insert-live-coding-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Case'ler veritabanına eklenirken bir hata oluştu");
      }

      setLiveCodingCasesState({
        loading: false,
        success: data.message || "Case'ler başarıyla veritabanına eklendi",
        error: null,
      });
    } catch (err: any) {
      setLiveCodingCasesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleDeleteLiveCodingCases = async () => {
    if (!window.confirm("Tüm canlı kodlama case'lerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setDeleteLiveCodingCasesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/delete-live-coding-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Case'ler silinirken bir hata oluştu");
      }

      setDeleteLiveCodingCasesState({
        loading: false,
        success: data.message || "Case'ler başarıyla silindi",
        error: null,
      });

      // Clear insert state as well
      setLiveCodingCasesState({
        loading: false,
        success: null,
        error: null,
      });
    } catch (err: any) {
      setDeleteLiveCodingCasesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleImportJuniorCases = async () => {
    setJuniorCasesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/import-junior-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Junior case'ler import edilirken bir hata oluştu");
      }

      setJuniorCasesState({
        loading: false,
        success: data.message || `${data.imported} adet junior case başarıyla import edildi`,
        error: null,
      });
    } catch (err: any) {
      setJuniorCasesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleInsertBugfixCases = async () => {
    setBugfixCasesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/insert-bugfix-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bugfix case'leri veritabanına eklenirken bir hata oluştu");
      }

      setBugfixCasesState({
        loading: false,
        success: data.message || "Bugfix case'leri başarıyla veritabanına eklendi",
        error: null,
      });
    } catch (err: any) {
      setBugfixCasesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleDeleteBugfixCases = async () => {
    if (!window.confirm("Tüm bugfix case'lerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setDeleteBugfixCasesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/delete-bugfix-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bugfix case'leri silinirken bir hata oluştu");
      }

      setDeleteBugfixCasesState({
        loading: false,
        success: data.message || "Bugfix case'leri başarıyla silindi",
        error: null,
      });

      // Clear insert state as well
      setBugfixCasesState({
        loading: false,
        success: null,
        error: null,
      });
    } catch (err: any) {
      setDeleteBugfixCasesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };


  const handleClearAllCourseData = async () => {
    if (
      !confirm(
        "TÜM kurs, modül ve ders içeriklerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      return;
    }

    if (clearState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setClearState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      // Önce tüm ders kayıtlarını temizle (lesson- ve topic- ile başlayanlar)
      const clearTopicsResponse = await fetch("/api/admin/clear-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const topicsData = await clearTopicsResponse.json();

      if (!clearTopicsResponse.ok) {
        throw new Error(topicsData.error || "Ders ve modül verileri temizlenirken bir hata oluştu");
      }

      // Sonra tüm kursları temizle (course-dotnet-roadmap dahil)
      const clearCoursesResponse = await fetch("/api/admin/clear-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const coursesData = await clearCoursesResponse.json();

      if (!clearCoursesResponse.ok) {
        throw new Error(coursesData.error || "Kurslar temizlenirken bir hata oluştu");
      }

      setClearState({
        loading: false,
        success: `Tüm kurs, modül ve ders verileri başarıyla temizlendi. ${topicsData.deletedLessonsCount || 0} ders kaydı, ${topicsData.deletedModulesCount || 0} modül ve ${coursesData.deletedCount || 0} kurs silindi.`,
        error: null,
      });
    } catch (err: any) {
      setClearState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleClearAllTests = async () => {
    if (
      !confirm(
        "Admin panelinden eklenen tüm test verilerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz! (Course'a bağlı testler korunacak)"
      )
    ) {
      return;
    }

    if (clearTestsState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setClearTestsState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/clear-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Testler temizlenirken bir hata oluştu");
      }

      setClearTestsState({
        loading: false,
        success: `${data.deletedCount || 0} test başarıyla silindi.`,
        error: null,
      });
    } catch (err: any) {
      setClearTestsState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleCreateProfiles = async () => {
    console.log("[ADMIN] handleCreateProfiles called", { noPhotoUserCount });
    
    const userCount = noPhotoUserCount ?? 1000;
    
    if (userCount < 0) {
      alert("Lütfen geçerli bir kullanıcı sayısı girin (0 veya daha büyük)");
      return;
    }

    if (
      !confirm(
        `Photos klasöründeki tüm fotoğraflar için profil hesapları oluşturulacak ve ${userCount} adet fotoğrafsız kullanıcı eklenecek. Devam etmek istiyor musunuz?`
      )
    ) {
      console.log("[ADMIN] User cancelled profile creation");
      return;
    }

    if (profileState.loading) {
      console.log("[ADMIN] Already loading, skipping");
      return;
    }

    console.log("[ADMIN] Starting profile creation...");
    setProfileState({
      loading: true,
      success: null,
      error: null,
      stats: null,
    });

    try {
      console.log("[ADMIN] Sending request to /api/admin/create-profiles", { noPhotoUserCount: userCount });
      const response = await fetch("/api/admin/create-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noPhotoUserCount: userCount }),
      });

      console.log("[ADMIN] Response status:", response.status);
      const data = await response.json();
      console.log("[ADMIN] Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Profil hesapları oluşturulurken bir hata oluştu");
      }

      setProfileState({
        loading: false,
        success: data.message || "Profil hesapları başarıyla oluşturuldu",
        error: null,
        stats: data.stats || null,
      });
    } catch (err: any) {
      console.error("[ADMIN] Error creating profiles:", err);
      setProfileState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
        stats: null,
      });
    }
  };

  const handleDeleteProfiles = async () => {
    console.log("[ADMIN] handleDeleteProfiles called");
    
    if (
      !confirm(
        "TÜM oluşturulan profil hesaplarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!"
      )
    ) {
      console.log("[ADMIN] User cancelled profile deletion");
      return;
    }

    if (deleteProfileState.loading) {
      console.log("[ADMIN] Already loading, skipping");
      return;
    }

    console.log("[ADMIN] Starting profile deletion...");
    setDeleteProfileState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      console.log("[ADMIN] Sending request to /api/admin/delete-profiles");
      const response = await fetch("/api/admin/delete-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("[ADMIN] Response status:", response.status);
      const data = await response.json();
      console.log("[ADMIN] Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Profil hesapları silinirken bir hata oluştu");
      }

      setDeleteProfileState({
        loading: false,
        success: data.message || `${data.stats?.deletedCount || 0} profil hesabı başarıyla silindi.`,
        error: null,
      });
    } catch (err: any) {
      console.error("[ADMIN] Error deleting profiles:", err);
      setDeleteProfileState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleSeedHackathons = async () => {
    if (hackathonSeedState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setHackathonSeedState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/seed-hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hackathonlar oluşturulurken bir hata oluştu");
      }

      setHackathonSeedState({
        loading: false,
        success: data.message || `${data.created || 0} adet hackathon başarıyla oluşturuldu`,
        error: null,
      });
    } catch (err: any) {
      setHackathonSeedState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleClearHackathons = async () => {
    if (hackathonClearState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    if (!confirm("Tüm hackathonları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setHackathonClearState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/clear-hackathons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hackathonlar silinirken bir hata oluştu");
      }

      setHackathonClearState({
        loading: false,
        success: data.message || `${data.deleted || 0} adet hackathon başarıyla silindi`,
        error: null,
      });
    } catch (err: any) {
      setHackathonClearState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleSeedFreelancerProjects = async () => {
    if (freelancerSeedState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setFreelancerSeedState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/seed-freelancer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Freelancer projeleri oluşturulurken bir hata oluştu");
      }

      setFreelancerSeedState({
        loading: false,
        success: data.message || `${data.created || 0} adet freelancer projesi başarıyla oluşturuldu`,
        error: null,
      });
    } catch (err: any) {
      setFreelancerSeedState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleClearFreelancerProjects = async () => {
    if (freelancerSeedState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    // Onay iste
    if (!confirm("Tüm freelancer projeleri ve teklifleri silinecek. Emin misiniz?")) {
      return;
    }

    setFreelancerSeedState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/clear-freelancer-projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Freelancer projeleri silinirken bir hata oluştu");
      }

      setFreelancerSeedState({
        loading: false,
        success: data.message || "Freelancer projeleri başarıyla silindi",
        error: null,
      });
    } catch (err: any) {
      setFreelancerSeedState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleSeedJobs = async () => {
    if (jobSeedState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setJobSeedState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/seed-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "İş ilanları oluşturulurken bir hata oluştu");
      }

      setJobSeedState({
        loading: false,
        success: data.message || `${data.created || 0} adet iş ilanı başarıyla oluşturuldu`,
        error: null,
      });
    } catch (err: any) {
      setJobSeedState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  const handleSeedCvTemplates = async () => {
    if (cvTemplatesState.loading) {
      return; // Prevent multiple simultaneous requests
    }

    setCvTemplatesState({
      loading: true,
      success: null,
      error: null,
    });

    try {
      const response = await fetch("/api/admin/seed-cv-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "CV şablonları yüklenirken bir hata oluştu");
      }

      setCvTemplatesState({
        loading: false,
        success: data.message || `${data.created || 0} adet şablon oluşturuldu, ${data.updated || 0} adet şablon güncellendi`,
        error: null,
      });
    } catch (err: any) {
      setCvTemplatesState({
        loading: false,
        success: null,
        error: err.message || "Bir hata oluştu",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Admin Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Sistem ayarları ve yönetim
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="relative rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 shadow-2xl dark:border-blue-800/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                📚 Kurs Oluşturma Merkezi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Teknoloji stack&apos;inizi genişletin
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Her kurs 15 modül ve 225 ders içerir. Profesyonel eğitim içerikleri ile yazılım geliştirme yolculuğunuza başlayın.
          </p>
          
          {/* Modern Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-full overflow-x-hidden">
            {/* Course Card Component */}
            {[
              { 
                title: ".NET Core", 
                handler: handleCreateDotNetCourse, 
                gradient: "from-blue-600 via-indigo-600 to-purple-600",
                icon: Code2,
                description: "Backend Framework"
              },
              { 
                title: "Java", 
                handler: handleCreateJavaCourse, 
                gradient: "from-orange-500 via-red-500 to-pink-500",
                icon: Code2,
                description: "Enterprise Language"
              },
              { 
                title: "MSSQL", 
                handler: handleCreateMssqlCourse, 
                gradient: "from-orange-600 via-red-600 to-orange-700",
                icon: Database,
                description: "Database Management"
              },
              { 
                title: "React", 
                handler: handleCreateReactCourse, 
                gradient: "from-cyan-500 via-blue-500 to-indigo-600",
                icon: Globe,
                description: "Frontend Library"
              },
              { 
                title: "Angular", 
                handler: handleCreateAngularCourse, 
                gradient: "from-red-600 via-pink-600 to-rose-600",
                icon: Globe,
                description: "Frontend Framework"
              },
              { 
                title: "Node.js", 
                handler: handleCreateNodeJSCourse, 
                gradient: "from-green-500 via-emerald-500 to-teal-600",
                icon: Zap,
                description: "Runtime Environment"
              },
              { 
                title: "Yapay Zeka", 
                handler: handleCreateAICourse, 
                gradient: "from-purple-600 via-pink-600 to-rose-500",
                icon: Zap,
                description: "AI for Developers"
              },
              { 
                title: "Flutter", 
                handler: handleCreateFlutterCourse, 
                gradient: "from-blue-400 via-cyan-500 to-blue-600",
                icon: Globe,
                description: "Mobile Development"
              },
              { 
                title: "Ethical Hacking", 
                handler: handleCreateEthicalHackingCourse, 
                gradient: "from-red-600 via-orange-600 to-red-700",
                icon: Shield,
                description: "Cybersecurity"
              },
              { 
                title: "Next.js", 
                handler: handleCreateNextJSCourse, 
                gradient: "from-gray-800 via-gray-900 to-black",
                icon: Code2,
                description: "React Framework"
              },
              { 
                title: "Docker & K8s", 
                handler: handleCreateDockerKubernetesCourse, 
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                icon: Container,
                description: "Containerization"
              },
              { 
                title: "OWASP Security", 
                handler: handleCreateOwaspCourse, 
                gradient: "from-yellow-500 via-orange-600 to-red-600",
                icon: Lock,
                description: "Web Security"
              },
              { 
                title: "Python", 
                handler: handleCreatePythonCourse, 
                gradient: "from-yellow-500 via-blue-500 to-green-600",
                icon: Code2,
                description: "Programming Language"
              },
              // Faz 1 Teknolojileri
              { 
                title: "Vue.js", 
                handler: handleCreateVueJSCourse, 
                gradient: "from-green-500 via-emerald-500 to-teal-600",
                icon: Globe,
                description: "Frontend Framework"
              },
              { 
                title: "TypeScript", 
                handler: handleCreateTypeScriptCourse, 
                gradient: "from-blue-600 via-indigo-600 to-purple-600",
                icon: Code2,
                description: "Programming Language"
              },
              { 
                title: "Go", 
                handler: handleCreateGoCourse, 
                gradient: "from-cyan-500 via-blue-500 to-indigo-600",
                icon: Code2,
                description: "Backend Language"
              },
              { 
                title: "PostgreSQL", 
                handler: handleCreatePostgreSQLCourse, 
                gradient: "from-blue-500 via-indigo-500 to-purple-600",
                icon: Database,
                description: "Database System"
              },
              { 
                title: "AWS", 
                handler: handleCreateAWSCourse, 
                gradient: "from-orange-500 via-yellow-500 to-orange-600",
                icon: Cloud,
                description: "Cloud Platform"
              },
              // Faz 2 Teknolojileri
              { 
                title: "Swift", 
                handler: handleCreateSwiftCourse, 
                gradient: "from-orange-400 via-orange-500 to-orange-600",
                icon: Code2,
                description: "iOS Development"
              },
              { 
                title: "Kotlin", 
                handler: handleCreateKotlinCourse, 
                gradient: "from-purple-500 via-indigo-500 to-blue-600",
                icon: Code2,
                description: "Android Development"
              },
              { 
                title: "MongoDB", 
                handler: handleCreateMongoDBCourse, 
                gradient: "from-green-600 via-emerald-600 to-teal-600",
                icon: Database,
                description: "NoSQL Database"
              },
              { 
                title: "Spring Boot", 
                handler: handleCreateSpringBootCourse, 
                gradient: "from-green-500 via-emerald-500 to-green-600",
                icon: Code2,
                description: "Java Framework"
              },
              { 
                title: "NestJS", 
                handler: handleCreateNestJSCourse, 
                gradient: "from-red-500 via-pink-500 to-rose-600",
                icon: Code2,
                description: "Node.js Framework"
              },
              // Faz 3 Teknolojileri
              { 
                title: "Azure", 
                handler: handleCreateAzureCourse, 
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                icon: Cloud,
                description: "Cloud Platform"
              },
            ].map((course, idx) => {
              const Icon = course.icon;
              return (
                <button
                  key={idx}
                  onClick={course.handler}
                  disabled={courseState.loading}
                  className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${course.gradient} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 text-left">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {courseState.loading && (
                        <Loader2 className="h-5 w-5 text-white/80 animate-spin" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">{course.description}</p>
                    <div className="flex items-center text-xs text-white/60">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>15 Modül • 225 Ders</span>
                    </div>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
              );
            })}
          </div>
          
          {/* Success/Error Messages */}
          {courseState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-2">{courseState.success}</div>
                  {courseState.stats && (
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Modüller: <strong>{courseState.stats.modulesCreated}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Dersler: <strong>{courseState.stats.lessonsCreated}</strong></span>
                      </div>
                      {courseState.stats.totalDuration && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          <span>
                            Süre: <strong>{Math.floor(courseState.stats.totalDuration / 60)}</strong> saat{" "}
                            <strong>{courseState.stats.totalDuration % 60}</strong> dakika
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {courseState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{courseState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Hackathon Seed Section */}
      <div className="relative rounded-3xl border border-amber-200/50 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 shadow-2xl dark:border-amber-800/50 dark:from-gray-950 dark:via-amber-950/20 dark:to-orange-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                🏆 Hackathon Seed Oluşturma
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Örnek hackathon verileri oluşturun
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Geçmiş, devam eden ve gelecek hackathonlar için örnek veriler oluşturur. Toplam 30 hackathon oluşturulur (10 geçmiş ay, 10 bu ay, 10 gelecek ay).
          </p>
          
          <div className="max-w-md space-y-3">
            <Button
              onClick={handleSeedHackathons}
              disabled={hackathonSeedState.loading || hackathonClearState.loading}
              size="lg"
              className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {hackathonSeedState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Hackathonlar Oluşturuluyor...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-5 w-5" />
                  Seed Hackathon Oluştur
                </>
              )}
            </Button>
            <Button
              onClick={handleClearHackathons}
              disabled={hackathonClearState.loading || hackathonSeedState.loading}
              size="lg"
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:border-red-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {hackathonClearState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Hackathonlar Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Tüm Hackathonları Temizle
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {hackathonSeedState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{hackathonSeedState.success}</div>
              </div>
            </div>
          )}
          {hackathonSeedState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{hackathonSeedState.error}</div>
              </div>
            </div>
          )}
          {hackathonClearState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{hackathonClearState.success}</div>
              </div>
            </div>
          )}
          {hackathonClearState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{hackathonClearState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Seed Section */}
      <div className="relative rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 shadow-2xl dark:border-blue-800/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-cyan-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                🏢 İş İlanları Seed Oluşturma
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Örnek iş ilanı verileri oluşturun
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Farklı teknoloji stack&apos;leri ve pozisyonlar için detaylı iş ilanları oluşturur. Toplam 10 iş ilanı oluşturulur (son 1-7 gün içinde paylaşılmış, published durumunda).
          </p>
          
          <div className="max-w-md">
            <Button
              onClick={handleSeedJobs}
              disabled={jobSeedState.loading}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {jobSeedState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  İş İlanları Oluşturuluyor...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-5 w-5" />
                  Seed İş İlanları Oluştur
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {jobSeedState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{jobSeedState.success}</div>
              </div>
            </div>
          )}
          {jobSeedState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{jobSeedState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Freelancer Projects Seed Section */}
      <div className="relative rounded-3xl border border-indigo-200/50 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 shadow-2xl dark:border-indigo-800/50 dark:from-gray-950 dark:via-indigo-950/20 dark:to-purple-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                💼 Freelancer Projeler Seed Oluşturma
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Örnek freelancer proje verileri oluşturun
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            10 farklı kategoride (Web Development, Mobile Development, Backend, Frontend, Full Stack, DevOps, Data Science, UI/UX Design, QA/Testing, Blockchain) toplam 100 adet gerçekçi freelancer proje talebi JSON dosyalarından import edilir. Tüm projeler 2025 yılı Türkiye yazılımcı ücretlerine göre bütçelendirilmiştir ve &quot;open&quot; durumundadır.
          </p>
          
          <div className="max-w-2xl flex gap-4">
            <Button
              onClick={handleSeedFreelancerProjects}
              disabled={freelancerSeedState.loading}
              size="lg"
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {freelancerSeedState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  100 Proje Talebi Import Ediliyor...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-5 w-5" />
                  100 Freelancer Proje Talebi Import Et
                </>
              )}
            </Button>
            <Button
              onClick={handleClearFreelancerProjects}
              disabled={freelancerSeedState.loading}
              size="lg"
              variant="danger"
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {freelancerSeedState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Tüm Projeleri Kaldır
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {freelancerSeedState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{freelancerSeedState.success}</div>
              </div>
            </div>
          )}
          {freelancerSeedState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{freelancerSeedState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community Seed Section */}
      <div className="relative rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 shadow-2xl dark:border-blue-800/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                💬 Yardımlaşma Toplulukları
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {communityCount !== null ? (
                  <>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{communityCount}</span> / 24 topluluk mevcut
                  </>
                ) : (
                  "24 adet kurs bazlı yardımlaşma topluluğu oluşturun"
                )}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Her teknoloji için yardımlaşma toplulukları oluşturur. Toplam 24 topluluk oluşturulur (.NET Core, Java, MSSQL, React, Angular, Node.js, Yapay Zeka, Flutter, Ethical Hacking, Next.js, Docker & K8s, OWASP Security, Python, Vue.js, TypeScript, Go, PostgreSQL, AWS, Swift, Kotlin, MongoDB, Spring Boot, NestJS, Azure).
          </p>
          
          <div className="max-w-md">
            <Button
              onClick={handleCreateCourseCommunities}
              disabled={communityState.loading}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium"
            >
              {communityState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Topluluklar Oluşturuluyor...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  12 Yardımlaşma Topluluğu Oluştur
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {communityState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-2">{communityState.success}</div>
                  {communityState.stats && (
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>Oluşturulan: <strong>{(communityState.stats as any).created || 0}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>Güncellenen: <strong>{(communityState.stats as any).updated || 0}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>Toplam: <strong>{(communityState.stats as any).total || 0}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {communityState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{communityState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Accounts Management Section */}
      <div className="relative rounded-3xl border border-green-200/50 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 shadow-2xl dark:border-green-800/50 dark:from-gray-950 dark:via-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                👥 Profil Hesapları Yönetimi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fotoğraflardan otomatik profil hesapları oluşturun
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Photos klasöründeki kadın ve erkek fotoğrafları için Türk isimleriyle profil hesapları oluşturun. Her hesap için rastgele şifre ve email oluşturulur.
          </p>
          
          {/* Fotoğrafsız Kullanıcı Sayısı Input */}
          <div className="mb-6 max-w-md">
            <label htmlFor="noPhotoCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fotoğrafsız Kullanıcı Sayısı
            </label>
            <input
              id="noPhotoCount"
              type="number"
              min="0"
              max="10000"
              value={noPhotoUserCount}
              onChange={(e) => setNoPhotoUserCount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Fotoğrafsız kullanıcı sayısı"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Fotoğrafsız oluşturulacak kullanıcı sayısını girin (varsayılan: 1000)
            </p>
          </div>
          
          {/* View All Users Button */}
          <div className="mb-6 max-w-md">
            <Button
              onClick={() => router.push("/admin/users")}
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Eye className="mr-2 h-5 w-5" />
              Tüm Kullanıcıları Görüntüle
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("[ADMIN] Button clicked - handleCreateProfiles");
                  handleCreateProfiles();
                }}
                disabled={profileState.loading}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium"
              >
                {profileState.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    Profil Hesapları Oluştur
                  </>
                )}
              </Button>
              {profileState.success && (
                <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
                  <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">{profileState.success}</div>
                      {profileState.stats && (
                        <div className="flex flex-col gap-2 text-xs opacity-90">
                          <div className="flex flex-wrap gap-3">
                            <span>Toplam: <strong>{profileState.stats.totalCreated}</strong></span>
                            <span>Erkek: <strong>{profileState.stats.maleCount}</strong></span>
                            <span>Kadın: <strong>{profileState.stats.femaleCount}</strong></span>
                          </div>
                          {profileState.stats.newAvatarMaleCount !== undefined && profileState.stats.newAvatarFemaleCount !== undefined && (
                            <div className="flex flex-wrap gap-3 pt-1 border-t border-green-300 dark:border-green-800">
                              <span className="text-green-700 dark:text-green-300">Yeni Avatar Erkek: <strong>{profileState.stats.newAvatarMaleCount}</strong></span>
                              <span className="text-green-700 dark:text-green-300">Yeni Avatar Kadın: <strong>{profileState.stats.newAvatarFemaleCount}</strong></span>
                            </div>
                          )}
                          {profileState.stats.regularMaleCount !== undefined && profileState.stats.regularFemaleCount !== undefined && (
                            <div className="flex flex-wrap gap-3 text-xs opacity-75">
                              <span>Normal Erkek: <strong>{profileState.stats.regularMaleCount}</strong></span>
                              <span>Normal Kadın: <strong>{profileState.stats.regularFemaleCount}</strong></span>
                            </div>
                          )}
                          {profileState.stats.noPhotoTotalCount !== undefined && (
                            <div className="flex flex-wrap gap-3 pt-1 border-t border-green-300 dark:border-green-800">
                              <span className="text-blue-700 dark:text-blue-300">Fotoğrafsız Toplam: <strong>{profileState.stats.noPhotoTotalCount}</strong></span>
                              <span className="text-blue-700 dark:text-blue-300">Fotoğrafsız Erkek: <strong>{profileState.stats.noPhotoMaleCount || 0}</strong></span>
                              <span className="text-blue-700 dark:text-blue-300">Fotoğrafsız Kadın: <strong>{profileState.stats.noPhotoFemaleCount || 0}</strong></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {profileState.error && (
                <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="text-sm font-medium">{profileState.error}</div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Her topluluğa 30-60 arasında rastgele katılımcı ekler.
              </p>
              <Button
                onClick={handleAssignProfilesToCommunities}
                disabled={assignProfilesState.loading}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium"
              >
                {assignProfilesState.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Atanıyor...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Profilleri Topluluklara Üye Et
                  </>
                )}
              </Button>
              {assignProfilesState.success && (
                <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
                  <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-2">{assignProfilesState.success}</div>
                      {assignProfilesState.stats && (
                        <div className="space-y-2">
                          <div className="flex flex-col gap-1 text-xs opacity-90">
                            <span>Toplam Profil: <strong>{(assignProfilesState.stats as any).totalProfiles || 0}</strong></span>
                            <span>Topluluk Sayısı: <strong>{(assignProfilesState.stats as any).totalCommunities || 0}</strong></span>
                            <span>Eklenen Üye: <strong>{(assignProfilesState.stats as any).totalAdded || 0}</strong></span>
                            <span>Topluluk Başına: <strong>{(assignProfilesState.stats as any).minPerCommunity || 30}</strong> - <strong>{(assignProfilesState.stats as any).maxPerCommunity || 60}</strong> üye (rastgele)</span>
                          </div>
                          {(assignProfilesState.stats as any).communityStats && (
                            <div className="mt-2 pt-2 border-t border-green-300 dark:border-green-800">
                              <div className="text-xs font-semibold mb-1">Topluluk Detayları:</div>
                              <div className="flex flex-col gap-1 text-xs opacity-90 max-h-48 overflow-y-auto">
                                {((assignProfilesState.stats as any).communityStats as Array<{ name: string; added: number; currentTotal: number }>).map((stat, idx) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <span>{stat.name}:</span>
                                    <span className="font-medium">
                                      +{stat.added} üye (Toplam: {stat.currentTotal})
                                      {stat.currentTotal >= ((assignProfilesState.stats as any).minPerCommunity || 30) && stat.currentTotal <= ((assignProfilesState.stats as any).maxPerCommunity || 60) ? (
                                        <span className="ml-1 text-green-600 dark:text-green-400">✓</span>
                                      ) : (
                                        <span className="ml-1 text-orange-600 dark:text-orange-400">⚠</span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {assignProfilesState.error && (
                <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="text-sm font-medium">{assignProfilesState.error}</div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("[ADMIN] Button clicked - handleDeleteProfiles");
                  handleDeleteProfiles();
                }}
                disabled={deleteProfileState.loading}
                size="lg"
                variant="danger"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
              >
                {deleteProfileState.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Profil Hesaplarını Temizle
                  </>
                )}
              </Button>
              {deleteProfileState.success && (
                <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
                  <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="text-sm font-medium">{deleteProfileState.success}</div>
                  </div>
                </div>
              )}
              {deleteProfileState.error && (
                <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="text-sm font-medium">{deleteProfileState.error}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Live Coding Cases Management Section */}
      <div className="relative rounded-3xl border border-cyan-200/50 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 shadow-2xl dark:border-cyan-800/50 dark:from-gray-950 dark:via-cyan-950/20 dark:to-blue-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                💻 Canlı Kodlama Case Yönetimi
               </h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                11 programlama dili için 264 case yönetimi
               </p>
             </div>
           </div>
           <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            11 farklı programlama dili (C#, Java, Python, PHP, JavaScript, TypeScript, Go, Rust, C++, Kotlin, Ruby) için her birinde 24 canlı kodlama case&apos;i veritabanına ekler. Her dil için 8 başlangıç, 8 orta ve 8 ileri seviye case bulunur. Toplam 264 case oluşturulur.
          </p>
          
          <div className="max-w-md space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleInsertLiveCodingCases}
                disabled={liveCodingCasesState.loading || deleteLiveCodingCasesState.loading}
                size="lg"
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-medium"
              >
                {liveCodingCasesState.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Case&apos;ler Ekleniyor...
                   </>
                 ) : (
                   <>
                     <Code2 className="mr-2 h-5 w-5" />
                    Case&apos;leri Veritabanına Ekle
                   </>
                 )}
               </Button>
               <Button
                onClick={handleDeleteLiveCodingCases}
                disabled={deleteLiveCodingCasesState.loading || liveCodingCasesState.loading}
                size="lg"
                variant="outline"
                className="flex-1 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                {deleteLiveCodingCasesState.loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-5 w-5" />
                    Case&apos;leri Kaldır
                  </>
                )}
              </Button>
             </div>
           </div>

           {/* Success/Error Messages */}
          {liveCodingCasesState.success && (
             <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
               <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                 <div className="p-2 rounded-lg bg-green-500/20">
                   <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                 </div>
                 <div className="flex-1">
                  <div className="font-semibold text-base">{liveCodingCasesState.success}</div>
                       </div>
              </div>
                         </div>
                       )}
          {liveCodingCasesState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{liveCodingCasesState.error}</div>
              </div>
                     </div>
                   )}

          {/* Delete Success/Error Messages */}
          {deleteLiveCodingCasesState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">{deleteLiveCodingCasesState.success}</div>
                 </div>
               </div>
             </div>
           )}
          {deleteLiveCodingCasesState.error && (
             <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
               <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                 <div className="p-2 rounded-lg bg-red-500/20">
                   <AlertCircle className="h-5 w-5 flex-shrink-0" />
                 </div>
                <div className="text-sm font-semibold">{deleteLiveCodingCasesState.error}</div>
               </div>
             </div>
           )}

          {/* Junior Cases Import Success/Error Messages */}
          {juniorCasesState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-purple-300/50 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 dark:border-purple-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-purple-700 dark:text-purple-300">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">{juniorCasesState.success}</div>
                </div>
              </div>
            </div>
          )}
          {juniorCasesState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{juniorCasesState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bugfix Cases Management Section */}
      <div className="relative rounded-3xl border border-red-200/50 bg-gradient-to-br from-white via-red-50/30 to-rose-50/30 shadow-2xl dark:border-red-800/50 dark:from-gray-950 dark:via-red-950/20 dark:to-rose-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
              <Bug className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                🐛 Bugfix Case Yönetimi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                12 programlama dili için 36 bugfix case yönetimi
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            12 farklı programlama dili (C#, Java, Python, PHP, JavaScript, TypeScript, Go, Rust, C++, Kotlin, Swift, Ruby) için her birinde 3&apos;er bugfix case&apos;i veritabanına ekler. Toplam 36 bugfix case oluşturulur.
          </p>
          
          <div className="max-w-md flex gap-4">
            <Button
              onClick={handleInsertBugfixCases}
              disabled={bugfixCasesState.loading || deleteBugfixCasesState.loading}
              size="lg"
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-medium"
            >
              {bugfixCasesState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Case&apos;ler Ekleniyor...
                </>
              ) : (
                <>
                  <Bug className="mr-2 h-5 w-5" />
                  Case&apos;leri Veritabanına Ekle
                </>
              )}
            </Button>
            <Button
              onClick={handleDeleteBugfixCases}
              disabled={deleteBugfixCasesState.loading || bugfixCasesState.loading}
              size="lg"
              variant="outline"
              className="flex-1 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              {deleteBugfixCasesState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Case&apos;leri Kaldır
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {bugfixCasesState.success && (
             <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
               <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                 <div className="p-2 rounded-lg bg-green-500/20">
                   <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                 </div>
                 <div className="flex-1">
                  <div className="font-semibold text-base">{bugfixCasesState.success}</div>
                 </div>
               </div>
             </div>
           )}
          {bugfixCasesState.error && (
             <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
               <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                 <div className="p-2 rounded-lg bg-red-500/20">
                   <AlertCircle className="h-5 w-5 flex-shrink-0" />
                 </div>
                <div className="text-sm font-semibold">{bugfixCasesState.error}</div>
               </div>
             </div>
           )}

          {/* Delete Success/Error Messages */}
          {deleteBugfixCasesState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base">{deleteBugfixCasesState.success}</div>
                </div>
              </div>
            </div>
          )}
          {deleteBugfixCasesState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{deleteBugfixCasesState.error}</div>
              </div>
            </div>
          )}
         </div>
       </div>

      {/* CV Templates Management Section */}
      <div className="relative rounded-3xl border border-purple-200/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 shadow-2xl dark:border-purple-800/50 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20 backdrop-blur-sm p-6 md:p-8 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                📄 CV Şablonları Yönetimi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                JSON dosyasından CV şablonlarını veritabanına yükleyin
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            data/cv-templates.json dosyasından 8 adet CV şablonunu veritabanına yükler. Mevcut şablonlar güncellenir, yeni şablonlar oluşturulur.
          </p>
          
          <div className="max-w-md">
            <Button
              onClick={handleSeedCvTemplates}
              disabled={cvTemplatesState.loading}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {cvTemplatesState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Şablonlar Yükleniyor...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  JSON&apos;dan Şablonları Yükle
                </>
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {cvTemplatesState.success && (
            <div className="mt-6 p-4 rounded-2xl border border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-green-700 dark:text-green-300">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{cvTemplatesState.success}</div>
              </div>
            </div>
          )}
          {cvTemplatesState.error && (
            <div className="mt-6 p-4 rounded-2xl border border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
              <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-sm font-semibold">{cvTemplatesState.error}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear All Course Data Section */}
      <div className="rounded-3xl border border-red-200 bg-white shadow-lg dark:border-red-800 dark:bg-gray-950 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🗑️ Veri Temizleme
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tüm kurs, modül ve ders içeriklerini veritabanından siler. Bu işlem geri alınamaz!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <Button
              onClick={handleClearAllCourseData}
              disabled={clearState.loading}
              size="lg"
              variant="danger"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
            >
              {clearState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Temizleniyor...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Tüm Kurs Verilerini Temizle
                </>
              )}
            </Button>
            {clearState.success && (
              <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
                <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium">{clearState.success}</div>
                </div>
              </div>
            )}
            {clearState.error && (
              <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium">{clearState.error}</div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={handleClearAllTests}
              disabled={clearTestsState.loading}
              size="lg"
              variant="danger"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
            >
              {clearTestsState.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Temizleniyor...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Admin Test Verilerini Temizle
                </>
              )}
            </Button>
            {clearTestsState.success && (
              <div className="mt-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60">
                <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium">{clearTestsState.success}</div>
                </div>
              </div>
            )}
            {clearTestsState.error && (
              <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium">{clearTestsState.error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
