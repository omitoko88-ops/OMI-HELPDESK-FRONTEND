import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './Pages/Dashboard/pages/Home'
import { ScrollToTop } from './components/common/ScrollToTop'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import AuthProvider from './contexts/AuthProvider'
import { queryClient } from './lib/queryClient'
import { ThemeProvider } from './components/theme-provider'
import Layout from './layout/pages/Layout'
import DocPage from './Pages/Docs/[slug]'
import { DocContent } from './Pages/DocContent'
import { TableContentProvider } from './contexts/TableContentContext'
// import { DocEditor } from "./Pages/best/page/DocEditor";
import { DocEditor } from './Pages/DocEditor'
import Example from './Pages/Example'
import GeekLayout from './geekLayout/GeekLayout'
import LoginPage from './Pages/AuthPages/Login/LoginPage'
// import { Layout } from "./layout/pages/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TableContentProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <Toaster />
              <ScrollToTop />
              <Routes>
                <Route element={<AuthProvider />}>
                  <Route element={<GeekLayout />}>
                    <Route index path="/" element={<DocContent />} />
                    <Route index path="/edit" element={<DocEditor />} />
                  </Route>
                  <Route index path="/example" element={<Example />} />
                  <Route index path="/login" element={<LoginPage />} />
                </Route>
              </Routes>
            </ThemeProvider>
          </TableContentProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App
