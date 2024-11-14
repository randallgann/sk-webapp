import SignalRConnection from '../components/SignalRConnection';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return( 
    <SignalRConnection>
      <Component {...pageProps} />;
    </SignalRConnection>
  )
}
