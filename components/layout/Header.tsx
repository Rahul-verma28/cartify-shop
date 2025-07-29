// // "use client"

// // import type React from "react"

// // import { useState, useEffect, useRef } from "react"
// // import Link from "next/link"
// // import { useSession, signOut } from "next-auth/react"
// // import { useSelector, useDispatch } from "react-redux"
// // import type { RootState } from "@/lib/redux/store"
// // import { toggleCartDrawer, toggleMobileMenu, setSearchQuery } from "@/lib/redux/slices/uiSlice"
// // import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, Bars3Icon, ChevronDownIcon, HeartIcon } from "@heroicons/react/24/outline"
// // import ThemeToggle from "../ThemeToggle"
// // import { motion } from "framer-motion"

// // export default function Header() {
// //   const { data: session } = useSession()
// //   const dispatch = useDispatch()
// //   const { itemCount } = useSelector((state: RootState) => state.cart)
// //   const wishlistItems = useSelector((state: RootState) => state.wishlist?.items || [])
// //   const [searchInput, setSearchInput] = useState("")
// //   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
// //   const userMenuRef = useRef<HTMLDivElement>(null)

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault()
// //     dispatch(setSearchQuery(searchInput))
// //   }

// //   const handleLogout = async () => {
// //     try {
// //       await signOut({ callbackUrl: "/" })
// //     } catch (error) {
// //       console.error("Logout error:", error)
// //     }
// //   }

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
// //         setIsUserMenuOpen(false)
// //       }
// //     }

// //     document.addEventListener("mousedown", handleClickOutside)
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside)
// //     }
// //   }, [])

// //   return (
// //     <motion.header
// //       initial={{ y: -100 }}
// //       animate={{ y: 0 }}
// //       className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
// //     >
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex items-center justify-between h-16">
// //           {/* Logo */}
// //           <Link href="/" className="flex items-center space-x-2">
// //             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
// //               <span className="text-white font-bold text-lg">M</span>
// //             </div>
// //             <span className="text-xl font-bold text-gray-900 dark:text-white">CartifyShop</span>
// //           </Link>

// //           {/* Search Bar */}
// //           <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
// //             <div className="relative w-full">
// //               <input
// //                 type="text"
// //                 placeholder="Search products?..."
// //                 value={searchInput}
// //                 onChange={(e) => setSearchInput(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900"
// //               />
// //               <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
// //             </div>
// //           </form>

// //           {/* Navigation Icons */}
// //           <div className="flex items-center space-x-4">
// //             <ThemeToggle />

// //             {/* Wishlist */}
// //             <Link href="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600">
// //               <HeartIcon className="h-6 w-6" />
// //               {wishlistItems?.length > 0 && (
// //                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //                   {wishlistItems?.length}
// //                 </span>
// //               )}
// //             </Link>

// //             {/* Cart */}
// //             <button
// //               onClick={() => dispatch(toggleCartDrawer())}
// //               className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600"
// //             >
// //               <ShoppingBagIcon className="h-6 w-6" />
// //               {itemCount > 0 && (
// //                 <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //                   {itemCount}
// //                 </span>
// //               )}
// //             </button>

// //             {/* User Menu */}
// //             {session ? (
// //               <div className="relative" ref={userMenuRef}>
// //                 <button
// //                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
// //                   className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600"
// //                 >
// //                   <UserIcon className="h-6 w-6" />
// //                   <span className="hidden md:block">{session.user?.name}</span>
// //                   <ChevronDownIcon className="h-4 w-4" />
// //                 </button>

// //                 {/* Dropdown Menu */}
// //                 {isUserMenuOpen && (
// //                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
// //                     <div className="py-2">
// //                       <Link
// //                         href="/account"
// //                         className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
// //                         onClick={() => setIsUserMenuOpen(false)}
// //                       >
// //                         My Account
// //                       </Link>
// //                       <Link
// //                         href="/account/orders"
// //                         className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
// //                         onClick={() => setIsUserMenuOpen(false)}
// //                       >
// //                         Orders
// //                       </Link>
// //                       <Link
// //                         href="/wishlist"
// //                         className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
// //                         onClick={() => setIsUserMenuOpen(false)}
// //                       >
// //                         Wishlist
// //                       </Link>
// //                       <hr className="my-1 border-gray-200 dark:border-gray-700" />
// //                       <button
// //                         onClick={handleLogout}
// //                         className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
// //                       >
// //                         Sign Out
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <Link href="/auth/signin" className="btn-primary">
// //                 Sign In
// //               </Link>
// //             )}

// //             {/* Mobile Menu Button */}
// //             <button
// //               onClick={() => dispatch(toggleMobileMenu())}
// //               className="md:hidden p-2 text-gray-600 dark:text-gray-300"
// //             >
// //               <Bars3Icon className="h-6 w-6" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </motion.header>
// //   )
// // }

// "use client";

// import type React from "react";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "@/lib/redux/store";
// import {
//   toggleCartDrawer,
//   toggleMobileMenu,
//   setSearchQuery,
// } from "@/lib/redux/slices/uiSlice";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search,
//   ShoppingBag,
//   User,
//   Menu,
//   X,
//   Heart,
//   ChevronDown,
//   LogOut,
//   Package,
//   Settings,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import ThemeToggle from "../ThemeToggle";

// export default function Header() {
//   const { data: session } = useSession();
//   const dispatch = useDispatch();
//   const { itemCount } = useSelector((state: RootState) => state.cart);
//   const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui);
//   const wishlistItems = useSelector(
//     (state: RootState) => state.wishlist?.items || []
//   );
//   const [searchInput, setSearchInput] = useState("");
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Categories and collections data
//   const categories = [
//     {
//       id: 1,
//       name: "Electronics",
//       slug: "electronics",
//       description: "Latest gadgets and tech",
//       productCount: 45,
//     },
//     {
//       id: 2,
//       name: "Fashion",
//       slug: "fashion",
//       description: "Trendy clothing and accessories",
//       productCount: 32,
//     },
//     {
//       id: 3,
//       name: "Home & Garden",
//       slug: "home-garden",
//       description: "Everything for your home",
//       productCount: 28,
//     },
//     {
//       id: 4,
//       name: "Sports",
//       slug: "sports",
//       description: "Athletic gear and equipment",
//       productCount: 21,
//     },
//   ];

//   const collections = [
//     {
//       id: 1,
//       name: "New Arrivals",
//       slug: "new-arrivals",
//       description: "Latest products just in",
//     },
//     {
//       id: 2,
//       name: "Best Sellers",
//       slug: "best-sellers",
//       description: "Most popular items",
//     },
//     {
//       id: 3,
//       name: "Sale Items",
//       slug: "sale",
//       description: "Great deals and discounts",
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(setSearchQuery(searchInput));
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut({ callbackUrl: "/" });
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <header
//       className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 dark:bg-gray-950/80 backdrop-blur-md bg-white/80 ${
//         isScrolled && " border-b shadow-sm"
//       } border-b border-gray-200 dark:border-gray-700`}
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2 pr-3">
//             <motion.div
//               className="relative"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">M</span>
//               </div>
//             </motion.div>
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               CartifyShop
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <NavigationMenu className="hidden lg:flex">
//             <NavigationMenuList>
//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="bg-transparent">
//                   Categories
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
//                     {categories.map((category) => (
//                       <NavigationMenuLink key={category.id} asChild>
//                         <Link
//                           href={`/category/${category.slug}`}
//                           className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                         >
//                           <div className="text-sm font-medium leading-none">
//                             {category.name}
//                           </div>
//                           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                             {category.description}
//                           </p>
//                           <Badge variant="secondary" className="text-xs">
//                             {category.productCount} items
//                           </Badge>
//                         </Link>
//                       </NavigationMenuLink>
//                     ))}
//                   </div>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>

//               <NavigationMenuItem>
//                 <NavigationMenuTrigger className="bg-transparent">
//                   Collections
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <div className="grid gap-3 p-6 w-[400px]">
//                     {collections.map((collection) => (
//                       <NavigationMenuLink key={collection.id} asChild>
//                         <Link
//                           href={`/collection/${collection.slug}`}
//                           className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                         >
//                           <div className="text-sm font-medium leading-none">
//                             {collection.name}
//                           </div>
//                           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                             {collection.description}
//                           </p>
//                         </Link>
//                       </NavigationMenuLink>
//                     ))}
//                   </div>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>

//               <NavigationMenuItem>
//                 <Link href="/products" legacyBehavior passHref>
//                   <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none bg-transparent">
//                     All Products
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* Search Bar */}
//           <form
//             onSubmit={handleSearch}
//             className="hidden md:flex flex-1 max-w-md mx-8"
//           >
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 className="pl-10 bg-background/50 backdrop-blur-sm border-muted-foreground/20"
//               />
//             </div>
//           </form>

//           {/* Right Actions */}
//           <div className="flex items-center space-x-2">
//             <ThemeToggle />

//             {/* Wishlist */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="hidden md:flex relative"
//               asChild
//             >
//               <Link href="/wishlist">
//                 <Heart className="w-5 h-5" />
//                 {wishlistItems?.length > 0 && (
//                   <motion.div
//                     className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                   >
//                     {wishlistItems?.length}
//                   </motion.div>
//                 )}
//               </Link>
//             </Button>

//             {/* Cart */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="relative"
//               onClick={() => dispatch(toggleCartDrawer())}
//             >
//               <ShoppingBag className="w-5 h-5" />
//               {itemCount > 0 && (
//                 <motion.div
//                   className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                 >
//                   {itemCount}
//                 </motion.div>
//               )}
//             </Button>

//             {/* User Menu */}
//             {session ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     className="hidden md:flex items-center space-x-2"
//                   >
//                     <User className="w-5 h-5" />
//                     <span className="text-sm">{session.user?.name}</span>
//                     <ChevronDown className="w-4 h-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuItem asChild>
//                     <Link href="/account" className="flex items-center">
//                       <Settings className="mr-2 h-4 w-4" />
//                       My Account
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/account/orders" className="flex items-center">
//                       <Package className="mr-2 h-4 w-4" />
//                       Orders
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/wishlist" className="flex items-center">
//                       <Heart className="mr-2 h-4 w-4" />
//                       Wishlist
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-red-600"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <Button asChild className="hidden md:flex">
//                 <Link href="/auth/signin">Sign In</Link>
//               </Button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => dispatch(toggleMobileMenu())}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-5 h-5" />
//               ) : (
//                 <Menu className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMobileMenuOpen && (
//             <motion.div
//               className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="p-4 space-y-4">
//                 {/* Mobile Search */}
//                 <form onSubmit={handleSearch}>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                     <Input
//                       placeholder="Search products..."
//                       value={searchInput}
//                       onChange={(e) => setSearchInput(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </form>

//                 {/* Mobile Navigation Links */}
//                 <div className="space-y-2">
//                   <Link
//                     href="/products"
//                     className="block py-2 text-sm font-medium hover:text-primary transition-colors"
//                     onClick={() => dispatch(toggleMobileMenu())}
//                   >
//                     All Products
//                   </Link>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-muted-foreground">
//                       Categories
//                     </p>
//                     {categories.map((category) => (
//                       <Link
//                         key={category.id}
//                         href={`/category/${category.slug}`}
//                         className="block py-1 pl-4 text-sm hover:text-primary transition-colors"
//                         onClick={() => dispatch(toggleMobileMenu())}
//                       >
//                         {category.name}
//                       </Link>
//                     ))}
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-muted-foreground">
//                       Collections
//                     </p>
//                     {collections.map((collection) => (
//                       <Link
//                         key={collection.id}
//                         href={`/collection/${collection.slug}`}
//                         className="block py-1 pl-4 text-sm hover:text-primary transition-colors"
//                         onClick={() => dispatch(toggleMobileMenu())}
//                       >
//                         {collection.name}
//                       </Link>
//                     ))}
//                   </div>

//                   {/* Mobile User Actions */}
//                   <div className="pt-4 border-t">
//                     {session ? (
//                       <div className="space-y-2">
//                         <Link
//                           href="/account"
//                           className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors"
//                           onClick={() => dispatch(toggleMobileMenu())}
//                         >
//                           <User className="mr-2 w-4 h-4" />
//                           My Account
//                         </Link>
//                         <Link
//                           href="/wishlist"
//                           className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors"
//                           onClick={() => dispatch(toggleMobileMenu())}
//                         >
//                           <Heart className="mr-2 w-4 h-4" />
//                           Wishlist
//                         </Link>
//                         <button
//                           onClick={() => {
//                             handleLogout();
//                             dispatch(toggleMobileMenu());
//                           }}
//                           className="flex items-center py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
//                         >
//                           <LogOut className="mr-2 w-4 h-4" />
//                           Sign Out
//                         </button>
//                       </div>
//                     ) : (
//                       <Link
//                         href="/auth/signin"
//                         className="block py-2 text-sm font-medium hover:text-primary transition-colors"
//                         onClick={() => dispatch(toggleMobileMenu())}
//                       >
//                         Sign In
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   );
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { toggleCartDrawer, setSearchQuery } from "@/lib/redux/slices/uiSlice";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Heart,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Home,
  Grid3X3,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "../ThemeToggle";
import { useNavigation } from "@/hooks/useNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items || []
  );
  const [searchInput, setSearchInput] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  // Get navigation data from hook
  const { categories, collections, loading, errors } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 dark:bg-gray-950/80 backdrop-blur-md bg-white/80 ${
        isScrolled && " border-b shadow-sm"
      } border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 pr-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CartifyShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[600px] grid-cols-2 lg:grid-cols-3">
                    {loading.categories
                      ? // Loading skeleton
                        [...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-2 p-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))
                      : categories.map((category) => (
                          <NavigationMenuLink key={category._id} asChild>
                            <Link
                              href={`/category/${category.slug}`}
                              className="block select-none rounded-md p-2 pl-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.title}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                    {errors.categories && (
                      <div className="col-span-2 text-xs text-red-500 p-3">
                        Using fallback categories
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Collections
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="grid gap-1 p-6 w-[600px] lg:grid-cols-2">
                    {loading.collections
                      ? // Loading skeleton
                        [...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2 p-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-36" />
                          </div>
                        ))
                      : collections.map((collection) => (
                          <NavigationMenuLink key={collection._id} asChild>
                            <Link
                              href={`/collection/${collection.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {collection.title}
                              </div>
                              <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                                {collection.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                    {errors.collections && (
                      <div className="text-xs text-red-500 p-3">
                        Using fallback collections
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none bg-transparent">
                    All Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-muted-foreground/20"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex relative"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="w-5 h-5" />
                {wishlistItems?.length > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {wishlistItems?.length}
                  </motion.div>
                )}
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch(toggleCartDrawer())}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {itemCount}
                </motion.div>
              )}
            </Button>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center space-x-0"
                  >
                    {session && session.user?.image ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || "/placeholder-user.jpg"}
                          alt={session?.user?.name || ""}
                        />
                        <AvatarFallback>
                          {session?.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="text-sm">{session?.user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {session && session?.user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden md:flex">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 h-screen overflow-y-auto"
              >
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>

                <div className="py-4 space-y-4">
                  {/* Mobile Search */}
                  <div className="px-6">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search products..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </form>
                  </div>

                  <Separator />

                  {/* Quick Links */}
                  <div className="px-6">
                    {session && session?.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <LayoutDashboard className="mr-3 w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/"
                      className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Home className="mr-3 w-4 h-4" />
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Grid3X3 className="mr-3 w-4 h-4" />
                      All Products
                    </Link>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div className="px-6">
                    <Collapsible
                      open={categoriesOpen}
                      onOpenChange={setCategoriesOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-left">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Categories
                        </h3>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            categoriesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className=" mt-1">
                        {loading.categories ? (
                          <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-8 w-full" />
                            ))}
                          </div>
                        ) : (
                          categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/category/${category.slug}`}
                              className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={closeMobileMenu}
                            >
                              {category.title}
                            </Link>
                          ))
                        )}
                        {errors.categories && (
                          <p className="text-xs text-red-500 px-3">
                            Using fallback categories
                          </p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  <Separator />

                  {/* Collections */}
                  <div className="px-6">
                    <Collapsible
                      open={collectionsOpen}
                      onOpenChange={setCollectionsOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-left">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Collections
                        </h3>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            collectionsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1">
                        {loading.collections ? (
                          <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                              <Skeleton key={i} className="h-8 w-full" />
                            ))}
                          </div>
                        ) : (
                          collections.map((collection) => (
                            <Link
                              key={collection._id}
                              href={`/collection/${collection.slug}`}
                              className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={closeMobileMenu}
                            >
                              {collection.title}
                            </Link>
                          ))
                        )}
                        {errors.collections && (
                          <p className="text-xs text-red-500 px-3">
                            Using fallback collections
                          </p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Categories */}
                  {/* <div className="px-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {loading.categories ? (
                        <div className="space-y-2">
                          {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      ) : (
                        categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/category/${category.slug}`}
                            className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {category.title}
                          </Link>
                        ))
                      )}
                      {errors.categories && (
                        <p className="text-xs text-red-500 px-3">
                          Using fallback categories
                        </p>
                      )}
                    </div>
                  </div> */}

                  {/* <Separator /> */}

                  {/* Collections */}
                  {/* <div className="px-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      Collections
                    </h3>
                    <div className="space-y-2">
                      {loading.collections ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      ) : (
                        collections.map((collection) => (
                          <Link
                            key={collection._id}
                            href={`/collection/${collection.slug}`}
                            className="block py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {collection.title}
                          </Link>
                        ))
                      )}
                      {errors.collections && (
                        <p className="text-xs text-red-500 px-3">
                          Using fallback collections
                        </p>
                      )}
                    </div>
                  </div> */}

                  <Separator />

                  {/* User Actions */}
                  <div className="px-6">
                    {session ? (
                      <div className="">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                          Account
                        </h3>
                        <Link
                          href="/account"
                          className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Settings className="mr-3 w-4 h-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Package className="mr-3 w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <Heart className="mr-3 w-4 h-4" />
                          Wishlist
                          {wishlistItems?.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {wishlistItems?.length}
                            </span>
                          )}
                        </Link>
                        <Separator className="my-3" />
                        <button
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="flex items-center w-full py-2 px-3 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <LogOut className="mr-3 w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                          Account
                        </h3>
                        <Link
                          href="/auth/signin"
                          className="flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <User className="mr-3 w-4 h-4" />
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
