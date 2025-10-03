import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DownloadIcon, 
  MailIcon, 
  LinkedinIcon,
  GithubIcon,
  MapPinIcon,
  BriefcaseIcon
} from "lucide-react"

interface TeamMember {
  name: string
  role: string
  department: string
  location: string
  experience: string
  skills: string[]
  email: string
  linkedin?: string
  github?: string
  resumePdf: string
  avatar?: string
}

interface TeamMemberCardProps {
  member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = member.resumePdf
    link.download = `${member.name.replace(' ', '_')}_Resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <CardDescription className="text-sm">{member.role}</CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Resume
          </Button>
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
            {member.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{member.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-2 border-t">
          <a 
            href={`mailto:${member.email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Send email"
          >
            <MailIcon className="w-4 h-4" />
          </a>
          {member.linkedin && (
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
          {member.github && (
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
  )
}

export function TeamGrid() {
  const teamMembers: TeamMember[] = [
    {
      name: "Amir Samimi",
      role: "Full Stack Developer",
      department: "Engineering",
      location: "Tehran, Iran",
      experience: "5+ years",
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS", "GraphQL", "Python"],
      email: "amir@devsync.com",
      linkedin: "https://linkedin.com/in/amirnsamimi",
      github: "https://github.com/amirnsamimi",
      resumePdf: "/AmirSamimi.pdf"
    },
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      experience: "4+ years",
      skills: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Figma", "Jest", "Webpack"],
      email: "sarah@devsync.com",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      resumePdf: "/AmirSamimi.pdf"
    },
    {
      name: "Michael Chen",
      role: "Backend Developer",
      department: "Engineering",
      location: "New York, NY",
      experience: "6+ years",
      skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Kubernetes", "Microservices", "Go"],
      email: "michael@devsync.com",
      linkedin: "https://linkedin.com/in/michaelchen",
      github: "https://github.com/michaelchen",
      resumePdf: "/AmirSamimi.pdf"
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer",
      department: "Infrastructure",
      location: "Austin, TX",
      experience: "5+ years",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux", "Monitoring"],
      email: "emily@devsync.com",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      github: "https://github.com/emilyrodriguez",
      resumePdf: "/AmirSamimi.pdf"
    },
    {
      name: "David Kim",
      role: "UI/UX Designer",
      department: "Design",
      location: "Seattle, WA",
      experience: "4+ years",
      skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems"],
      email: "david@devsync.com",
      linkedin: "https://linkedin.com/in/davidkim",
      resumePdf: "/AmirSamimi.pdf"
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      department: "Product",
      location: "Boston, MA",
      experience: "7+ years",
      skills: ["Product Strategy", "Agile", "User Stories", "Analytics", "A/B Testing", "Stakeholder Management"],
      email: "lisa@devsync.com",
      linkedin: "https://linkedin.com/in/lisathompson",
      resumePdf: "/AmirSamimi.pdf"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <TeamMemberCard key={member.name} member={member} />
      ))}
    </div>
  )
}
