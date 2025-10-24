import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import {useLocation} from "react-router";


export function Navigation() {
    const location=useLocation();
    if(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
        return (
            <>

                <Navbar fluid className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 sticky top-0 z-50 shadow-md">
                    <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-3xl font-extrabold text-white tracking-wide">
          Wander <span className="text-yellow-300">List</span>
        </span>
                    </NavbarBrand>
                    <NavbarToggle />
                    <NavbarCollapse className="text-white">
                        <NavbarLink href="/" className="text-white hover:text-burnt-orange">
                            Home
                        </NavbarLink>
                        <NavbarLink href="/login" className="text-white hover:text-burnt-orange">
                            Login
                        </NavbarLink>
                        <NavbarLink href="/signup" className="text-white hover:text-burnt-orange font-semibold">
                            Sign Up
                        </NavbarLink>
                    </NavbarCollapse>
                </Navbar>

            </>
        );
    } else {
        return (<>
                <Navbar fluid rounded className="bg-blue-400">
                    <NavbarBrand href="https://flowbite-react.com">
                <span
                    className="self-center whitespace-nowrap text-4xl font-semibold dark:text-white">Wander List</span>
                    </NavbarBrand>
                    <div className="flex md:order-2">
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt="User settings"
                                        img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        rounded/>
                            }>
                            <DropdownHeader>
                                <span className="block text-sm">Bonnie Green</span>
                                <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                            </DropdownHeader>
                            <DropdownItem>Dashboard</DropdownItem>
                            <DropdownItem>Settings</DropdownItem>
                            <DropdownDivider/>
                            <DropdownItem>Sign out</DropdownItem>
                        </Dropdown>
                        <NavbarToggle/>
                    </div>
                    <NavbarCollapse>
                        <NavbarLink href="/" active>
                            Home
                        </NavbarLink>
                        <NavbarLink href="/profile">Profile</NavbarLink>
                        <NavbarLink href="/community">Community</NavbarLink>
                        <NavbarLink href="/scrapbook">Scrapbook</NavbarLink>
                    </NavbarCollapse>
                </Navbar>

            </>
        );
    }
}