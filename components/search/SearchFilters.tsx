"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SearchFiltersProps {
  filters: {
    category: string
    minPrice: number
    maxPrice: number
    rating: number
    sortBy: string
  }
  onFiltersChange: (filters: any) => void
}

const categories = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "beauty", label: "Beauty" },
]

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    sort: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      sortBy: "relevance",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <Collapsible open={expandedSections.category} onOpenChange={() => toggleSection("category")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Category</span>
              {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <RadioGroup value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Filter */}
        <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection("price")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Price Range</span>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <Label className="text-sm">Min Price: ${filters.minPrice}</Label>
              <Slider
                value={[filters.minPrice]}
                onValueChange={(value) => updateFilter("minPrice", value[0])}
                max={1000}
                step={10}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm">Max Price: ${filters.maxPrice}</Label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={(value) => updateFilter("maxPrice", value[0])}
                max={1000}
                step={10}
                className="mt-2"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating Filter */}
        <Collapsible open={expandedSections.rating} onOpenChange={() => toggleSection("rating")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Minimum Rating</span>
              {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <RadioGroup
              value={filters.rating.toString()}
              onValueChange={(value) => updateFilter("rating", Number(value))}
            >
              {[0, 1, 2, 3, 4].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">
                    {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Sort Filter */}
        <Collapsible open={expandedSections.sort} onOpenChange={() => toggleSection("sort")}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Sort By</span>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
