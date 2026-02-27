import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SearchBar from './SearchBar'

function Layout() {
    return (
        <>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <SearchBar />
        </>
    )
}

export default Layout
