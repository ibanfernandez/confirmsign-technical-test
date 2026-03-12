import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { NotFoundPage } from "./components/ErrorDisplay/ErrorDisplay";
import "./styles/main.scss";

const ThreadPage = lazy(() => import("./pages/ThreadPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route: /{cfskey}/{cfstoken} */}
        <Route
          path="/:cfskey/:cfstoken"
          element={
            <Suspense fallback={<Loader />}>
              <ThreadPage />
            </Suspense>
          }
        />

        {/* Catch-all → 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
