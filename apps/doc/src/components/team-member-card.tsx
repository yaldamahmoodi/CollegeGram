import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "lucide-react";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  location: string;
  experience: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  resumePdf?: string;
  avatar?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const hasResume = !!member.resumePdf && member.resumePdf !== "#";
  const hasEmail = !!member.email && member.email !== "#";
  const hasLinkedin = !!member.linkedin && member.linkedin !== "#";
  const hasGithub = !!member.github && member.github !== "#";
  const handleDownload = () => {
    if (!hasResume) return;
    const link = document.createElement("a");
    link.href = member.resumePdf as string;
    link.download = `${member.name.replace(" ", "_")}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {member.avatar ? (
              <img
                src={`${member.avatar}`}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <CardDescription className="text-sm">
                {member.role}
              </CardDescription>
            </div>
          </div>
          {hasResume && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BriefcaseIcon className="w-4 h-4" />
          <span>{member.department}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-4 h-4" />
          <span>{member.location}</span>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Experience:</span> {member.experience}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-1">
            {(showAllSkills ? member.skills : member.skills.slice(0, 4)).map(
              (skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              )
            )}
            {member.skills.length > 4 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowAllSkills((v) => !v)}
              >
                {showAllSkills
                  ? "Show less"
                  : `+${member.skills.length - 4} more`}
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t">
          {hasEmail && (
            <a
              href={`mailto:${member.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Send email"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          )}
          {hasLinkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-600 transition-colors"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {hasGithub && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamGrid() {
  const teamMembers: TeamMember[] = [
    {
      name: "Amir Samimi",
      role: "Full Stack Developer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "5+ years",
      avatar: "/AmirSamimi.jpg",
      skills: [
        // Core & Backend
        "TypeScript",
        "JavaScript",
        "FP-TS ( functional Programing)",
        "DDD",
        "TDD",
        "SOLID",
        "Node.js",
        "Express.js",
        // Frontend
        "React",
        "Vue.js",
        "Nuxt.js",
        // Databases & ORM
        "MongoDB",
        "Mongoose",
        "PostgreSQL",
        "Prisma",
        "Drizzle",
        // Infra & DevOps
        "Docker",
        "CI/CD",
        // Caching & Search & Realtime
        "Redis",
        "Elasticsearch",
        "Socket.io",
        // Tooling & Libs
        "ZOD",
        "Axios",
        "Tanstack Query",
        "Tanstack Router",
        "Jest",
        "Vitest",
        // Styling & UI
        "Tailwind CSS",
        "MUI",
        "StyledComponents",
        "CSS Modules",
        "Sass/Less",
        // State/Forms
        "Redux JS",
        "Zustand",
        "Formik",
        "YUP",
        "React Hook Form",
        // PM & Collab
        "Git",
        "GitHub",
        "Hamgit",
        "Notion",
        "Jira",
        "Github Workflows",
        // Misc
        "Figma",
        "Chart.js",
        "Python",
      ],
      email: "amirnsamimi@gmail.com",
      linkedin: "https://linkedin.com/in/amirnsamimi",
      github: "https://github.com/amirnsamimi",
      resumePdf: "/AmirSamimi.pdf",
    },
    {
      name: "Yalda Mahmoodi",
      role: "Backend Engineer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "3+ years",
      skills: [
        "php",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Redis",
      ],
    },
    {
      name: "Mohammad Asghari",
      role: "Backend Developer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "Junior Developer",
      skills: [
        "TypeScript",
        "JavaScript",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Socket.io",
        "Elasticsearch",
        "C++",
        "SQLServer",
      ],
      linkedin: "https://www.linkedin.com/in/mohammad-asghari-4b3091200/",
      email: "mohammad.asghari1955@gmail.com",
      resumePdf: "/MohammadAsghari.pdf",
    },
    {
      name: "Nima Elahi Manesh",
      role: "Backend Developer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "Junior Developer",
      skills: ["TypeScript", "JavaScript", "Node.js", "MongoDB"],
    },
    {
      name: "Sepideh Shabrang",
      role: "Frontend Engineer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "6+ years",
      skills: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Figma",
        "JavaScript",
        "HTML",
        "CSS",
      ],
    },
    {
      name: "Abolfazl Abdollahi",
      role: "Frontend Developer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "Junior Developer",
      skills: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Figma",
        "JavaScript",
        "HTML",
        "CSS",
      ],
      email: "aabolfazlabdollahi@gmail.com",
      linkedin: "https://www.linkedin.com/in/abolfazl-abdollah-i",
      github: "https://github.com/abolfazlabdollahii/",
      resumePdf: "/AbolfazlAbdollahi.pdf",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <TeamMemberCard key={member.name} member={member} />
      ))}
    </div>
  );
}
