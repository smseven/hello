import ReactDOM from 'react-dom/client';
import Room from './Room';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> // strict mode causes double render which messes up simple-peer signaling sometimes in dev
    <Room />
  // </React.StrictMode>,
);
