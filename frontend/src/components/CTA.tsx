export const CTA = () => {
    return (
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20" />
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Tournament?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of organizers and players in the ultimate esports tournament platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 text-lg bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Create Tournament
              </button>
              <button className="px-6 py-3 text-lg bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };