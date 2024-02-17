import Navbar from "./navigation/navBar"
import Home from "./pages/home"
import About from "./pages/about"
import Pathing from "./pages/pathing"
import notFound from "./pages/notFound"
import {Route, Routes} from "react-router-dom"
import Boids from "./pages/boids";

function App() {
    return (
        <>
            <div style={{position:"sticky"}}>
                <Navbar/>
                <div className="container">
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="/rrt" element={<Pathing/>}/>
                        <Route path="/boids" element={<Boids/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path='*' element={notFound()}/>
                    </Routes>
                </div>
            </div>

        </>
    )
}

export default App