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
console.log(location.pathname)
    if(location.pathname === '/' ) {
        return (
            <>

            </>
        );
    } else {
        return ( <>
        <Navbar fluid rounded className="bg-blue-400">
            <NavbarBrand href="https://flowbite-react.com">
                <span
                    className="self-center whitespace-nowrap text-4xl font-semibold dark:text-white">Bucket List</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
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