"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Store, 
  CreditCard, 
  Bell, 
  Mail, 
  Globe, 
  Truck, 
  ImageIcon, 
  Save,
  Users,
  LayoutGrid
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [storeDetails, setStoreDetails] = useState({
    name: "Modern Shop",
    email: "contact@CartifyShop.com",
    phone: "+1 (555) 123-4567",
    address: "123 E-Commerce St, Digital City, 90210",
    currency: "USD",
    language: "en",
  })
  
  const [saving, setSaving] = useState(false)
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  }
  
  const handleStoreDetailsChange = (field: string, value: string) => {
    setStoreDetails(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSaveSettings = () => {
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast.success("Settings saved successfully")
    }, 1000)
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Store Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your store's configuration and preferences</p>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>
                      Basic details about your store
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input 
                      id="store-name" 
                      value={storeDetails.name}
                      onChange={(e) => handleStoreDetailsChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Contact Email</Label>
                    <Input 
                      id="store-email" 
                      type="email"
                      value={storeDetails.email}
                      onChange={(e) => handleStoreDetailsChange('email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Phone Number</Label>
                    <Input 
                      id="store-phone" 
                      value={storeDetails.phone}
                      onChange={(e) => handleStoreDetailsChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-currency">Currency</Label>
                    <Select 
                      value={storeDetails.currency}
                      onValueChange={(value) => handleStoreDetailsChange('currency', value)}
                    >
                      <SelectTrigger id="store-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-address">Business Address</Label>
                  <Textarea 
                    id="store-address" 
                    value={storeDetails.address}
                    onChange={(e) => handleStoreDetailsChange('address', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? 
                    <span className="flex items-center">
                      <span className="mr-2">Saving</span>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span> : 
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </span>
                  }
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>
                      Localization and regional preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-language">Default Language</Label>
                    <Select 
                      value={storeDetails.language}
                      onValueChange={(value) => handleStoreDetailsChange('language', value)}
                    >
                      <SelectTrigger id="store-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="store-timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable multiple languages</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to browse your store in different languages
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable multiple currencies</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to shop with different currencies
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="payments">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Payment Gateways</CardTitle>
                    <CardDescription>
                      Configure and manage your payment methods
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This feature is under development. Soon you'll be able to configure payment providers like Stripe, PayPal, and more.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 10C2 7.79086 3.79086 6 6 6H18C20.2091 6 22 7.79086 22 10V14C22 16.2091 20.2091 18 18 18H6C3.79086 18 2 16.2091 2 14V10Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M6 14H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M19 7L19 7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">PayPal</h3>
                        <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="shipping">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Shipping Settings</CardTitle>
                    <CardDescription>
                      Configure shipping methods and rates
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This feature is under development. Soon you'll be able to set up shipping zones, rates, and delivery methods.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Store Appearance</CardTitle>
                    <CardDescription>
                      Customize your store's look and feel
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This feature is under development. Soon you'll be able to customize themes, colors, and layouts.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage email and system notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure when and how you receive notifications about orders, customers, and store activity.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when a new order is placed
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when product inventory is running low
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Customer Reviews</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new product reviews
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="users">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage admin users and permissions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This feature is under development. Soon you'll be able to manage admin users and set role-based permissions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
