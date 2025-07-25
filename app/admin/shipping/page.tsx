"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Truck, 
  Settings, 
  Globe, 
  Package, 
  MapPin, 
  Plus, 
  Edit, 
  Trash,
  Save,
  DollarSign
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AdminShippingPage() {
  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: "Domestic", regions: ["United States"], methods: 3, isDefault: true },
    { id: 2, name: "Canada", regions: ["Canada"], methods: 2, isDefault: false },
    { id: 3, name: "Europe", regions: ["UK", "France", "Germany", "Italy", "Spain"], methods: 2, isDefault: false },
    { id: 4, name: "Rest of World", regions: ["Worldwide"], methods: 1, isDefault: false },
  ])
  
  const [shippingMethods, setShippingMethods] = useState([
    { id: 1, zoneId: 1, name: "Standard Shipping", price: 5.99, freeThreshold: 50, estimatedDays: "3-5", active: true },
    { id: 2, zoneId: 1, name: "Express Shipping", price: 15.99, freeThreshold: 100, estimatedDays: "1-2", active: true },
    { id: 3, zoneId: 1, name: "Same Day Delivery", price: 29.99, freeThreshold: null, estimatedDays: "0", active: false },
    { id: 4, zoneId: 2, name: "Canada Post Standard", price: 9.99, freeThreshold: 75, estimatedDays: "5-7", active: true },
    { id: 5, zoneId: 2, name: "Canada Express", price: 24.99, freeThreshold: null, estimatedDays: "2-3", active: true },
    { id: 6, zoneId: 3, name: "International Standard", price: 14.99, freeThreshold: 100, estimatedDays: "7-14", active: true },
    { id: 7, zoneId: 3, name: "International Express", price: 34.99, freeThreshold: null, estimatedDays: "3-5", active: true },
    { id: 8, zoneId: 4, name: "Global Shipping", price: 24.99, freeThreshold: 150, estimatedDays: "10-21", active: true },
  ])
  
  const [newZoneOpen, setNewZoneOpen] = useState(false)
  const [newMethodOpen, setNewMethodOpen] = useState(false)
  const [editZone, setEditZone] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState("zones")
  
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
  
  const handleAddZone = () => {
    toast.success("Shipping zone added successfully")
    setNewZoneOpen(false)
  }
  
  const handleAddMethod = () => {
    toast.success("Shipping method added successfully")
    setNewMethodOpen(false)
  }
  
  const handleEditZone = (zone: any) => {
    setEditZone(zone)
  }
  
  const handleSaveZone = () => {
    toast.success("Shipping zone updated successfully")
    setEditZone(null)
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure shipping methods and rates for your store</p>
      </motion.div>

      <Tabs defaultValue="zones" className="space-y-6" onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
          <TabsTrigger value="settings">General Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zones" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Shipping Zones</CardTitle>
                      <CardDescription>
                        Define shipping regions and associated delivery areas
                      </CardDescription>
                    </div>
                  </div>
                  <Dialog open={newZoneOpen} onOpenChange={setNewZoneOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Zone
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Shipping Zone</DialogTitle>
                        <DialogDescription>
                          Create a new shipping zone to define specific shipping methods for certain regions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="zone-name">Zone Name</Label>
                          <Input id="zone-name" placeholder="e.g., North America" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zone-regions">Regions</Label>
                          <Input id="zone-regions" placeholder="e.g., United States, Canada" />
                          <p className="text-sm text-muted-foreground">Separate multiple regions with commas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="is-default" />
                          <Label htmlFor="is-default">Set as default shipping zone</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewZoneOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddZone}>Add Zone</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone Name</TableHead>
                      <TableHead>Regions</TableHead>
                      <TableHead>Methods</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {zone.regions.map((region) => (
                              <Badge key={region} variant="outline">{region}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{zone.methods} shipping methods</TableCell>
                        <TableCell>
                          {zone.isDefault ? 
                            <Badge variant="default">Default</Badge> : 
                            <Badge variant="outline">Active</Badge>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditZone(zone)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
          
          <Dialog open={!!editZone} onOpenChange={(open) => !open && setEditZone(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Shipping Zone</DialogTitle>
                <DialogDescription>
                  Update shipping zone details and regions.
                </DialogDescription>
              </DialogHeader>
              {editZone && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-zone-name">Zone Name</Label>
                    <Input id="edit-zone-name" defaultValue={editZone.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-zone-regions">Regions</Label>
                    <Input id="edit-zone-regions" defaultValue={editZone.regions.join(", ")} />
                    <p className="text-sm text-muted-foreground">Separate multiple regions with commas</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="edit-is-default" defaultChecked={editZone.isDefault} />
                    <Label htmlFor="edit-is-default">Set as default shipping zone</Label>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditZone(null)}>Cancel</Button>
                <Button onClick={handleSaveZone}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="methods" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Shipping Methods</CardTitle>
                      <CardDescription>
                        Define different shipping options and rates
                      </CardDescription>
                    </div>
                  </div>
                  <Dialog open={newMethodOpen} onOpenChange={setNewMethodOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Shipping Method</DialogTitle>
                        <DialogDescription>
                          Create a new shipping method with specific rates and options.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="method-zone">Shipping Zone</Label>
                          <Select>
                            <SelectTrigger id="method-zone">
                              <SelectValue placeholder="Select zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingZones.map(zone => (
                                <SelectItem key={zone.id} value={zone.id.toString()}>{zone.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method-name">Method Name</Label>
                          <Input id="method-name" placeholder="e.g., Express Shipping" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="method-price">Price</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input id="method-price" placeholder="0.00" className="pl-8" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="method-days">Estimated Days</Label>
                            <Input id="method-days" placeholder="e.g., 3-5" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method-free-threshold">Free Shipping Threshold</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="method-free-threshold" placeholder="Leave empty for no free shipping" className="pl-8" />
                          </div>
                          <p className="text-sm text-muted-foreground">Minimum order amount for free shipping</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="method-active" defaultChecked />
                          <Label htmlFor="method-active">Active</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewMethodOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddMethod}>Add Method</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select defaultValue="1">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {shippingZones.map(zone => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>{zone.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method Name</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Free Shipping</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingMethods
                      .filter(method => method.zoneId === 1) // Filter based on selected zone
                      .map((method) => {
                        const zone = shippingZones.find(z => z.id === method.zoneId);
                        return (
                          <TableRow key={method.id}>
                            <TableCell className="font-medium">{method.name}</TableCell>
                            <TableCell>{zone?.name}</TableCell>
                            <TableCell>${method.price.toFixed(2)}</TableCell>
                            <TableCell>
                              {method.freeThreshold ? `Over $${method.freeThreshold}` : "Not available"}
                            </TableCell>
                            <TableCell>{method.estimatedDays} days</TableCell>
                            <TableCell>
                              {method.active ? 
                                <Badge>Active</Badge> : 
                                <Badge variant="outline">Inactive</Badge>
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>General Shipping Settings</CardTitle>
                    <CardDescription>
                      Configure store-wide shipping options
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Enable shipping calculations</h3>
                      <p className="text-sm text-muted-foreground">Calculate shipping rates at checkout</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show estimated delivery dates</h3>
                      <p className="text-sm text-muted-foreground">Display delivery time estimates to customers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Calculate tax based on shipping address</h3>
                      <p className="text-sm text-muted-foreground">Use shipping address for tax calculations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Package Dimensions</h3>
                  <p className="text-sm text-muted-foreground">Default package dimensions for shipping calculations</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="package-length">Length (in)</Label>
                      <Input id="package-length" placeholder="0.0" defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package-width">Width (in)</Label>
                      <Input id="package-width" placeholder="0.0" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package-height">Height (in)</Label>
                      <Input id="package-height" placeholder="0.0" defaultValue="6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package-weight">Weight (lbs)</Label>
                      <Input id="package-weight" placeholder="0.0" defaultValue="1.5" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Shipping Origin</h3>
                  <p className="text-sm text-muted-foreground">Address where your products are shipped from</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin-address">Street Address</Label>
                      <Input id="origin-address" placeholder="123 Commerce St" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-city">City</Label>
                      <Input id="origin-city" placeholder="Your City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-state">State/Province</Label>
                      <Input id="origin-state" placeholder="Your State" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-zip">ZIP/Postal Code</Label>
                      <Input id="origin-zip" placeholder="12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origin-country">Country</Label>
                      <Select defaultValue="US">
                        <SelectTrigger id="origin-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
