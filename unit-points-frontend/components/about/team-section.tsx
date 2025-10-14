"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, MapPin, Coffee } from "lucide-react";

const team = [
  {
    name: "Alex Rivera",
    role: "Blockchain Developer",
    bio: "Smart contract specialist with 5+ years in Web3. Passionate about building decentralized systems that empower communities.",
    avatar: "/developer-working.png",
    location: "Buenos Aires, AR",
    skills: ["Solidity", "Rust", "Polkadot", "DeFi"],
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "alex@unitpoints.com",
    },
  },
  {
    name: "Sofia Martinez",
    role: "Frontend Engineer",
    bio: "UI/UX enthusiast creating beautiful and intuitive Web3 experiences for everyone. Specialized in React and user-centered design.",
    avatar: "/diverse-designers-brainstorming.png",
    location: "México DF, MX",
    skills: ["React", "TypeScript", "Design", "UX"],
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "sofia@unitpoints.com",
    },
  },
  {
    name: "Carlos Mendoza",
    role: "Product Manager",
    bio: "Community builder focused on creating tools that empower users and foster collaboration in the blockchain ecosystem.",
    avatar: "/diverse-team-manager.png",
    location: "Santiago, CL",
    skills: ["Strategy", "Community", "Product", "DAO"],
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
      email: "carlos@unitpoints.com",
    },
  },
];

export function TeamSection() {
  return (
    <section className="mb-20">
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Meet the Team
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The people behind UnitPoints, building the future of community rewards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <Card
            key={member.name}
            className="p-8 text-center hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group glass-surface border-primary/10 hover:border-primary/30 relative overflow-hidden"
          >
            {/* Background hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative space-y-6">
              {/* Enhanced Avatar */}
              <div className="relative mx-auto w-32 h-32">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="h-32 w-32 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-primary/30 to-secondary/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Name and Role */}
              <div>
                <h3 className="font-display font-bold text-2xl mb-2 group-hover:text-primary transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {member.role}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {member.location}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
