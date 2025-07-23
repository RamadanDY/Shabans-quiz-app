 import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"


export default function App() {
  return (
    <div className="p-7   flex justify-end"> {/* flex container to push nav to right */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Item One */}
                <Button>HOME</Button>
 
          {/* Item Two */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-lg">Item Two</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLink
                    href="/link3"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Link 3
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Item Three */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-lg">Item Three</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLink
                    href="/link4"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Link 4
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    href="/link5"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Link 5
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Item Four */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-lg">Profile</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLink
                    href="/link6"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Link 6
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    href="/link7"
                    className="block px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Link 7
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
