import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppConvexProvider } from "@/lib/convex";
import Home from "@/pages/Home";
// Yönetim paneli yalnızca /admin açılınca indirilir; ziyaretçi sitesini yavaşlatmaz.
const AdminPage = lazy(() => import("@/pages/Admin"));
import DevicePage from "@/pages/DevicePage";

function App() {
  return (
    <AppConvexProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-slate-500">Yönetim paneli yükleniyor…</div>}><AdminPage /></Suspense>} />
            <Route path="/cihazlar/:deviceId" element={<DevicePage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AppConvexProvider>
  );
}

export default App;
