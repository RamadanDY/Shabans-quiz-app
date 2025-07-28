import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r  bg-gray-500 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <span>Shaban's Maths Quiz</span>
          <span className="text-xl opacity-70 font-math">π</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-2">
            <NavigationMenuItem>
              <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
                <Link to="/">Home</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg px-4 py-2 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Link to="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="text-lg px-4 py-2 hover:bg-blue-700 rounded-md transition-colors"
                >
                  <Link to="/Topics">Maths Quiz</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              {user ? (
                <>
                  <NavigationMenuTrigger className="text-lg bg-blue-700 hover:bg-blue-800">
                    {user.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px] bg-white text-gray-800">
                      <li>
                        <NavigationMenuLink
                          asChild
                          className="block px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Link to="/Dashboard">Dashboard</Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          asChild
                          className="block px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <span>Logout</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <>
                  <NavigationMenuTrigger className="text-lg bg-blue-700 hover:bg-blue-800">
                    Account
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[200px] bg-white text-gray-800">
                      <li>
                        <NavigationMenuLink
                          asChild
                          className="block px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Link to="/login">Login</Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          asChild
                          className="block px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Link to="/register">Register</Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
        .font-math {
          font-family: 'Roboto Slab', serif;
        }
      `}</style>
    </nav>
  );
}