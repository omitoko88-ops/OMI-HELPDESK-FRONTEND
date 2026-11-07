import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AuthProvider from "./contexts/AuthProvider";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/theme-provider";
import { TableContentProvider } from "./contexts/TableContentContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { DocEditor } from "./Pages/DocEditor";
import Example from "./Pages/Example";
import GeekLayout from "./geekLayout/GeekLayout";
import { Home } from "./Pages/Dashboard/pages/Home";
import LoginPage from "./Pages/AuthPages/Login/LoginPage";
import RegisterPage from "./Pages/AuthPages/Register/RegisterPage";
import { DocumentPage, DocumentsIndexPage } from "./geekLayout/pages/DocumentPage";
import { PublicDocumentPage } from "./geekLayout/pages/PublicDocumentPage";
import { WorkspaceMembersPage } from "./geekLayout/pages/WorkspaceMembersPage";
import { AdminWorkspacesPage } from "./geekLayout/pages/AdminWorkspacesPage";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TableContentProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster position="top-center" />
            <ScrollToTop />
            <Routes>
              <Route element={<AuthProvider />}>
                <Route element={<GeekLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/docs" element={<DocumentsIndexPage />} />
                  <Route path="/docs/:documentId" element={<DocumentPage />} />
                  <Route path="/members" element={<WorkspaceMembersPage />} />
                  <Route path="/admin/workspaces" element={<AdminWorkspacesPage />} />
                  <Route path="/edit" element={<DocEditor />} />
                  <Route path="/edit/:documentId" element={<DocEditor />} />
                </Route>
                <Route path="/example" element={<Example />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route path="/share/:token" element={<PublicDocumentPage />} />
            </Routes>
          </ThemeProvider>
        </TableContentProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
