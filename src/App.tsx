import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Router } from './components/router/Router';
import {ToastContainer} from "react-toastify"

function App() {
  return (
    <>
      <BrowserRouter>
        <Router />
        <ToastContainer closeOnClick theme='colored'/>
      </BrowserRouter>
    </>
  );
}

export default App;
