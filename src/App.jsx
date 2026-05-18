import React from 'react';

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">
        Welcome to HotelOps
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        AI-Assisted Real-Time Hotel Operations Platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Placeholder cards for modules */}
        {['Front Desk', 'Housekeeping', 'Maintenance', 'AI Alerts', 'Admin Analytics'].map((module) => (
          <div key={module} className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{module}</h2>
            <p className="text-muted-foreground text-sm">
              Module components go here.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
