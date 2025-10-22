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


export function Navigation() {
    return (
        <>
                   <Navbar fluid rounded className="bg-dkblue">
                   <NavbarBrand href="https://flowbite-react.com">
                   {/*<img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />*/}
                   <span className="self-center whitespace-nowrap text-4xl font-semibold">Bucket List</span>
                   </NavbarBrand>
                   <div className="flex md:order-2">
                   <Dropdown
                   arrowIcon={false}
               inline
               label={
                   <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
               }
        >
        <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
        </DropdownHeader>
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
    <NavbarToggle />
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
    )
}