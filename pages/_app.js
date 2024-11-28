// import "../styles/globals.css";
import Layout from "../components/Layout";
import "../styles/globals.css";
import "../components/button/Button.module.scss";
import "../components/toggle/Toggle.scss";
import "./voiceAssistance/index.scss";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
