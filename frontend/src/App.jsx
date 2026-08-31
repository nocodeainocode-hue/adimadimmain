import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppConvexProvider } from "@/lib/convex";
import Home from "@/pages/Home";
import AdminPage from "@/pages/Admin";
import DevicePage from "@/pages/DevicePage";

function App() {
  return (
    <AppConvexProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cihazlar/:deviceId" element={<DevicePage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AppConvexProvider>
  );
}

export default App;
