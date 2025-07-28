"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import type { Address } from "@/lib/types"
import { 
  UserIcon, 
  MapPinIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface CheckoutFormProps {
  onSubmit: (data: Address) => void
  loading: boolean
}

export default function CheckoutForm({ onSubmit, loading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [errors, setErrors] = useState<Partial<Address>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Address, boolean>>>({})

  const validateForm = () => {
    const newErrors: Partial<Address> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.street.trim()) newErrors.street = "Street address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleInputBlur = (field: keyof Address) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const getInputStatus = (field: keyof Address) => {
    if (!touched[field]) return 'default'
    if (errors[field]) return 'error'
    if (formData[field].trim()) return 'success'
    return 'default'
  }

  const countries = [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPinIcon className="h-5 w-5 text-primary" />
            </div>
            <span>Shipping Information</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Personal Details
                </h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center space-x-2">
                  <span>Full Name</span>
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  onBlur={() => handleInputBlur("fullName")}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.fullName && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">
                      {errors.fullName}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Address Details
                </h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street" className="flex items-center space-x-2">
                  <span>Street Address</span>
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  onBlur={() => handleInputBlur("street")}
                  placeholder="123 Main Street, Apt 4B"
                  className={errors.street ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.street && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">
                      {errors.street}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center space-x-2">
                    <span>City</span>
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    onBlur={() => handleInputBlur("city")}
                    placeholder="New York"
                    className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.city && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {errors.city}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center space-x-2">
                    <span>State / Province</span>
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    onBlur={() => handleInputBlur("state")}
                    placeholder="NY"
                    className={errors.state ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.state && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {errors.state}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="flex items-center space-x-2">
                    <span>ZIP / Postal Code</span>
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    onBlur={() => handleInputBlur("zipCode")}
                    placeholder="10001"
                    className={errors.zipCode ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.zipCode && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {errors.zipCode}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <GlobeAltIcon className="h-4 w-4" />
                    <span>Country</span>
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger className={errors.country ? "border-destructive focus:ring-destructive" : ""}>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {errors.country}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                🔒 Your information is secure and encrypted
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
       