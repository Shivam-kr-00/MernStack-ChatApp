import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

export default function Test() {
  const { theme, setTheme } = useThemeStore();
  
  return (
    <div className="container mx-auto p-10 space-y-10">
      <h1 className="text-3xl font-bold">DaisyUI Theme Test: {theme}</h1>
      
      {/* Direct Theme Selection */}
      <div className="p-4 border rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Manual Theme Selector</h2>
        <div className="flex flex-wrap gap-2">
          {THEMES.map(themeName => (
            <button 
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`btn ${theme === themeName ? 'btn-primary' : 'btn-outline'}`}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
      
      {/* Individual Theme Panels */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Theme Samples (with explicit data-theme)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["light", "dark", "coffee", "cupcake", "synthwave", "retro"].map(themeName => (
            <div 
              key={themeName} 
              data-theme={themeName} 
              className="p-4 border rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2">{themeName}</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm">Primary</button>
                  <button className="btn btn-secondary btn-sm">Secondary</button>
                  <button className="btn btn-accent btn-sm">Accent</button>
                </div>
                <div className="bg-base-200 p-3 rounded-lg">
                  <p className="text-base-content text-sm">Text in base-200</p>
                </div>
                <div className="bg-primary p-3 rounded-lg">
                  <p className="text-primary-content text-sm">Text in primary</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Theme Test */}
      <div className="p-6 border rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Current Theme Components</h2>
        {/* Buttons */}
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold">Buttons</h3>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-info">Info</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-error">Error</button>
            <button className="btn">Neutral</button>
          </div>
        </div>
        
        {/* Cards */}
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h2 className="card-title">Primary Card</h2>
                <p>This is a primary colored card.</p>
              </div>
            </div>
            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">Secondary Card</h2>
                <p>This is a secondary colored card.</p>
              </div>
            </div>
            <div className="card bg-accent text-accent-content">
              <div className="card-body">
                <h2 className="card-title">Accent Card</h2>
                <p>This is an accent colored card.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
