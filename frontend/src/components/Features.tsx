import { Shield, Zap, BarChart3 } from "lucide-react";

export const Features = () => {
  return (
    <div className="py-24 bg-secondary/20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Choose Our Platform?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security for your tournaments and data",
            },
            {
              icon: Zap,
              title: "Real-time Updates",
              description: "Instant match results and bracket updates",
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description: "Comprehensive statistics and performance tracking",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg hover:bg-secondary/50 transition-colors duration-300 group"
            >
              <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};