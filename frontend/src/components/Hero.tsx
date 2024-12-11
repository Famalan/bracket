import { Trophy, Users, Target } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-0" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
      
      <div className="relative z-10 space-y-8 animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Elevate Your Esports Tournament
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional tournament management platform for organizers and players. Create, compete, and conquer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg">
            Get Started
          </Button>
          <Button size="lg" variant="secondary" className="text-lg">
            Learn More
          </Button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full px-4">
        {[
          {
            icon: Trophy,
            title: "Tournament Creation",
            description: "Create and manage professional tournaments with ease",
          },
          {
            icon: Users,
            title: "Team Management",
            description: "Organize teams and track their performance",
          },
          {
            icon: Target,
            title: "Live Brackets",
            description: "Real-time tournament brackets and match updates",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-secondary/50 backdrop-blur-sm border border-secondary animate-fade-up"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <feature.icon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};