import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import NewProject from './components/pages/Newproject';
import Company from './components/pages/Company';
import Container from './components/layout/Container';
import Navbar from './components/layout/Navbar';
import Projects from './components/pages/Projects';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Project from './components/pages/Project';
function App() {
  return (
    <Router>
      <div className="App">
        <p>Costs</p>
        {/* Menu de navegação */}
        <Navbar/>
        {/* Rotas corretas */}
        <Container customClass = 'min-height'>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/projects/:id" element={<Project />} />
          </Routes>
        </Container>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
