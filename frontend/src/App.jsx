import Home from './pages/Home'

function App() {
  return (
    // Wraps the entire application in the stark onyx black base layer
    <div className="min-h-screen w-full bg-black text-zinc-100 font-sans antialiased selection:bg-red-900 selection:text-white">
      <Home />
    </div>
  );
}

export default App;