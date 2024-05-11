import Dashboard from './Components/Dashboard';
import LoginPage from './Components/Login';
import Register from './Components/Register';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route   path="/Register" element={<LoginPage />} />
                <Route  path="/sadas" element={<Register />} />
                <Route  exact path='/' element={<Dashboard/>} ></Route>
            </Routes>
        </Router>
    </>
  );
}

export default App;
