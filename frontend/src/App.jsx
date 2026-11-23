import Navbar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
import { ExternalLinkIcon } from "lucide-react";

function App() {
  const { theme } = useThemeStore();

  return (
    <div className="flex min-h-screen flex-col bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>

      <footer className="border-t border-base-content/10 bg-base-100/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-base-content/70 sm:flex-row">
          <p>This website is built by Koull Ahmed Chaker</p>
          <a
            href="https://github.com/koull-Ahmed"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <ExternalLinkIcon className="size-4" />
            GitHub profile
          </a>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;