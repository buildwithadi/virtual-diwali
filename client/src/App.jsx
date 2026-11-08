import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Celebration from './pages/Celebration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/celebration" element={<Celebration />} />
      </Routes>
    </Router>
  );
}

export default App;