import '../styles/globals.css'; // Add this line
import '../styles/modal.css'; // Adjust path if styles/ is not in root

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
