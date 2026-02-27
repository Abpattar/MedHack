import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SearchBar from './SearchBar'

function Layout({ isLoggedIn, onLogout }) {
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <main className="main-content">
                <Outlet />
            </main>
            <SearchBar />
        </>
    )
}

export default Layout
