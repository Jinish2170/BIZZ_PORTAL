"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchInputProps {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
}

export function SearchInput({ placeholder = "Search...", onSearch, className = "" }: SearchInputProps) {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [value, onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2.5 top-2.5 text-xs text-muted-foreground"
            >
              Press Enter to search
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
