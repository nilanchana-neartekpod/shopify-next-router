// /pages/_app.js
import "@/styles/globals.css";
import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
