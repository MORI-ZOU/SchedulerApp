import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Router } from './components/router/Router';
import { Bounce, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import 'flowbite';
import 'flowbite/dist/flowbite.min.js';
import { DateRangePicker } from 'flowbite-datepicker';

function App() {
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce} />
    </>
  );
}

export default App;
