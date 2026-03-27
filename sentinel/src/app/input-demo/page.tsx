"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Search, Lock, User, Eye, EyeOff } from "lucide-react";

export default function InputDemoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      setEmailSuccess(false);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address");
      setEmailSuccess(false);
    } else {
      setEmailError("");
      setEmailSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Input Component Demo
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Comprehensive showcase of all Input component states and features
          </p>
        </div>

        {/* Basic Inputs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Basic Inputs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Default Input"
              placeholder="Enter text..."
            />
            
            <Input
              label="With Helper Text"
              placeholder="Username"
              helperText="Choose a unique username"
            />
          </div>
        </section>

        {/* States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            States
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Default State"
              placeholder="Normal input"
            />
            
            <Input
              label="Error State"
              placeholder="Invalid input"
              error="This field is required"
            />
            
            <Input
              label="Success State"
              placeholder="Valid input"
              success
              value="john@example.com"
              readOnly
            />
            
            <Input
              label="Disabled State"
              placeholder="Cannot edit"
              disabled
              value="Disabled value"
            />
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            With Icons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email (Left Icon)"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              iconPosition="left"
            />
            
            <Input
              label="Search (Right Icon)"
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              iconPosition="right"
            />
            
            <Input
              label="Username (Left Icon)"
              placeholder="johndoe"
              icon={<User className="h-4 w-4" />}
              iconPosition="left"
              helperText="Minimum 3 characters"
            />
            
            <Input
              label="Password (Left Icon)"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              iconPosition="left"
            />
          </div>
        </section>

        {/* Interactive Validation */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Interactive Validation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              iconPosition="left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => validateEmail(e.target.value)}
              error={emailError}
              success={emailSuccess}
              helperText={!emailError && !emailSuccess ? "We'll never share your email" : undefined}
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                icon={<Lock className="h-4 w-4" />}
                iconPosition="left"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error States with Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Error States with Icons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              iconPosition="left"
              error="Please enter a valid email address"
            />
            
            <Input
              label="Search"
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              iconPosition="right"
              error="No results found"
            />
          </div>
        </section>

        {/* Success States with Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Success States with Icons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              placeholder="john@example.com"
              icon={<Mail className="h-4 w-4" />}
              iconPosition="left"
              success
              value="john@example.com"
              readOnly
            />
            
            <Input
              label="Username"
              placeholder="johndoe"
              icon={<User className="h-4 w-4" />}
              iconPosition="left"
              success
              value="johndoe"
              readOnly
            />
          </div>
        </section>

        {/* Different Input Types */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Different Input Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Text"
              type="text"
              placeholder="Enter text"
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            
            <Input
              label="Number"
              type="number"
              placeholder="123"
            />
            
            <Input
              label="Date"
              type="date"
            />
            
            <Input
              label="Time"
              type="time"
            />
          </div>
        </section>

        {/* Full Width */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Full Width
          </h2>
          
          <Input
            label="Full Width Input"
            placeholder="This input spans the full width"
            helperText="Useful for forms and layouts"
          />
        </section>

        {/* Focus Ring Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Focus Ring (Tab to see)
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Press Tab to navigate through these inputs and see the 2-3px focus ring
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Input 1"
              placeholder="Tab here"
            />
            
            <Input
              label="Input 2"
              placeholder="Then here"
            />
            
            <Input
              label="Input 3"
              placeholder="And here"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
