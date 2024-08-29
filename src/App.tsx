import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Router } from './components/router/Router';
import { Bounce, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { DatabaseProvider } from './components/providers/DatabaseProvider';

function App() {
  return (
    <>
      <DatabaseProvider>
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
      </DatabaseProvider>
    </>
  );
}

export default App;
