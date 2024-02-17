import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function navBar() {
    return (
        <nav className="nav" style={{position:"sticky",top:0}}>
            <Link to="/" className="site-title">
                <div className="siteTitle">
                    algoVis
                </div>
            </Link>
            <ul>
                <div>
                    <CustomLink to="/rrt">RRT</CustomLink>
                </div>
                <div>
                    <CustomLink to="/boids">Boids</CustomLink>
                </div>
                <div>
                    <CustomLink to="/about">About</CustomLink>
                </div>
            </ul>
        </nav>
    )
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true})

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}