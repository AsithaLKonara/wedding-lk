"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useToast } from "@/hooks/use-toast"

const steps = [
  "Add Services",
  "Upload Portfolio",
  "Add Pricing Packages",
  "Set Availability",
  "Business Verification",
  "Service Area",
  "Complete",
]

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Label will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Progress will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Separator will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Checkbox will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Tooltip will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TooltipContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TooltipProvider will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TooltipTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function VendorOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [services, setServices] = useState([{ name: "", description: "", price: "", duration: "" }])
  const [portfolio, setPortfolio] = useState<string[]>([])
  const [packages, setPackages] = useState([{ name: "", price: "", features: "" }])
  const [availability, setAvailability] = useState([{ date: "", isAvailable: true }])
  const [verificationDocs, setVerificationDocs] = useState<string[]>([])
  const [serviceArea, setServiceArea] = useState({ city: "", province: "", address: "" })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVendorId(localStorage.getItem('vendorId'))
    }
  }, [])

  useEffect(() => {
    // Fetch vendor data to get verification status
    async function fetchVendor() {
      if (!vendorId) return
      try {
        const res = await fetch(`/api/vendors?vendorId=${vendorId}`)
        const data = await res.json()
        if (data.success && data.vendor) {
          setVerificationDocs(data.vendor.verificationDocs || [])
          setVerificationStatus(data.vendor.isVerified ? 'approved' : (data.vendor.verificationDocs?.length ? 'pending' : 'pending'))
        }
      } catch (e) { /* ignore */ }
    }
    fetchVendor()
  }, [vendorId])

  const patchVendor = async (data: any) => {
    if (!vendorId) return
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, ...data }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setSuccess(true)
        toast({ title: "Saved!", variant: "default" })
      } else {
        setErrors({ api: result.error || "Failed to save data" })
        toast({ title: result.error || "Failed to save data", variant: "destructive" })
      }
    } catch (e) {
      setErrors({ api: "Network error" })
      toast({ title: "Network error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const validateStep = () => {
    let err: any = {}
    if (currentStep === 0) {
      services.forEach((s, i) => {
        if (!s.name) err[`service_name_${i}`] = "Service name is required"
        if (!s.price) err[`service_price_${i}`] = "Price is required"
      })
    }
    if (currentStep === 2) {
      packages.forEach((p, i) => {
        if (!p.name) err[`package_name_${i}`] = "Package name is required"
        if (!p.price) err[`package_price_${i}`] = "Price is required"
      })
    }
    if (currentStep === 3) {
      availability.forEach((a, i) => {
        if (!a.date) err[`availability_date_${i}`] = "Date is required"
      })
    }
    if (currentStep === 4) {
      if (verificationDocs.length === 0) err.verificationDocs = "At least one document is required"
    }
    if (currentStep === 5) {
      if (!serviceArea.city) err.serviceArea_city = "City is required"
      if (!serviceArea.province) err.serviceArea_province = "Province is required"
      if (!serviceArea.address) err.serviceArea_address = "Address is required"
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleNext = async () => {
    if (!validateStep()) return
    setErrors({})
    if (currentStep === 0) {
      await patchVendor({ services })
    } else if (currentStep === 1) {
      await patchVendor({ portfolio })
    } else if (currentStep === 2) {
      await patchVendor({ packages: packages.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
    } else if (currentStep === 3) {
      await patchVendor({ availability })
    } else if (currentStep === 4) {
      await patchVendor({ verificationDocs })
    } else if (currentStep === 5) {
      await patchVendor({ serviceArea })
    } else if (currentStep === 6) {
      // Mark onboarding complete in backend
      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, onboardingComplete: true }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('onboardingComplete', 'true')
        }
        window.location.href = "/dashboard"
        return
      } else {
        setErrors({ api: result.error || "Failed to complete onboarding" })
        return
      }
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0))

  // Step content
  let content = null
  if (currentStep === 0) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600">Add Your Services</h2>
          {services.map((service, idx) => (
            <div key={idx} className="mb-6 p-4 rounded-lg border bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Name</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-gray-400">🛈</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>The name of the service you offer (e.g. Wedding Photography).</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input value={service.name} onChange={async e => {
                    const s = [...services]; s[idx].name = e.target.value; setServices(s)
                    await patchVendor({ services: s })
                  }} placeholder="Service name" className="mb-1"
                    aria-invalid={!!errors[`service_name_${idx}`]}
                    aria-describedby={`service_name_${idx}-error`}
                  />
                  {errors[`service_name_${idx}`] && <div id={`service_name_${idx}-error`} className="text-xs text-destructive">{errors[`service_name_${idx}`]}</div>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Price (LKR)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-gray-400">🛈</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Enter the base price for this service in LKR.</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input type="number" value={service.price} onChange={async e => {
                    const s = [...services]; s[idx].price = e.target.value; setServices(s)
                    await patchVendor({ services: s })
                  }} placeholder="Price" className="mb-1" />
                  {errors[`service_price_${idx}`] && <div className="text-xs text-destructive">{errors[`service_price_${idx}`]}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label>Description</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-gray-400">🛈</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Briefly describe what is included in this service.</span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input value={service.description} onChange={async e => {
                const s = [...services]; s[idx].description = e.target.value; setServices(s)
                await patchVendor({ services: s })
              }} placeholder="Description" className="mb-1" />
              <div className="flex items-center gap-2 mt-2">
                <Label>Duration</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-gray-400">🛈</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>How long does this service take? (e.g. 2 hours)</span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input value={service.duration} onChange={async e => {
                const s = [...services]; s[idx].duration = e.target.value; setServices(s)
                await patchVendor({ services: s })
              }} placeholder="e.g. 2 hours" />
              <div className="flex justify-end mt-2">
                <Button variant="destructive" onClick={async () => {
                  const updated = services.filter((_, i) => i !== idx)
                  setServices(updated)
                  await patchVendor({ services: updated })
                }} disabled={services.length === 1} size="sm">Remove</Button>
              </div>
            </div>
          ))}
          <Button onClick={async () => {
            const updated = [...services, { name: "", description: "", price: "", duration: "" }]
            setServices(updated)
            await patchVendor({ services: updated })
          }} variant="outline">Add Another Service</Button>
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 1) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600">Upload Portfolio Images</h2>
          <div className="flex items-center gap-2 mb-2">
            <Label>Portfolio Images</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-gray-400">🛈</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Upload images that showcase your best work. Accepted formats: JPG, PNG. Multiple files allowed.</span>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input type="file" multiple accept="image/*" onChange={async e => {
            if (e.target.files) {
              const files = Array.from(e.target.files).map(f => f.name)
              const updated = [...portfolio, ...files]
              setPortfolio(updated)
              await patchVendor({ portfolio: updated })
            }
          }} />
          <div className="mt-4 flex flex-wrap gap-2">
            {portfolio.map((img, idx) => (
              <div key={idx} className="p-2 border rounded bg-background text-xs text-muted-foreground">{img}</div>
            ))}
          </div>
          {/* TODO: Integrate with backend for real uploads */}
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 2) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600">Add Pricing Packages</h2>
          {packages.map((pkg, idx) => (
            <div key={idx} className="mb-6 p-4 rounded-lg border bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Package Name</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-gray-400">🛈</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Name of the package (e.g. Gold, Silver, Basic).</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input value={pkg.name} onChange={async e => {
                    const p = [...packages]; p[idx].name = e.target.value; setPackages(p)
                    await patchVendor({ packages: p.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
                  }} placeholder="Package name" className="mb-1" />
                  {errors[`package_name_${idx}`] && <div className="text-xs text-destructive">{errors[`package_name_${idx}`]}</div>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Price (LKR)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-gray-400">🛈</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Price for this package in LKR.</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input type="number" value={pkg.price} onChange={async e => {
                    const p = [...packages]; p[idx].price = e.target.value; setPackages(p)
                    await patchVendor({ packages: p.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
                  }} placeholder="Price" className="mb-1" />
                  {errors[`package_price_${idx}`] && <div className="text-xs text-destructive">{errors[`package_price_${idx}`]}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label>Features</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-gray-400">🛈</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Comma-separated list of features included in this package (e.g. Photography, Editing, Album).</span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input value={pkg.features} onChange={async e => {
                const p = [...packages]; p[idx].features = e.target.value; setPackages(p)
                await patchVendor({ packages: p.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
              }} placeholder="e.g. Photography, Editing, Album" />
              <div className="flex justify-end mt-2">
                <Button variant="destructive" onClick={async () => {
                  const updated = packages.filter((_, i) => i !== idx)
                  setPackages(updated)
                  await patchVendor({ packages: updated.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
                }} disabled={packages.length === 1} size="sm">Remove</Button>
              </div>
            </div>
          ))}
          <Button onClick={async () => {
            const updated = [...packages, { name: "", price: "", features: "" }]
            setPackages(updated)
            await patchVendor({ packages: updated.map(pkg => ({ ...pkg, features: pkg.features.split(",").map((f: string) => f.trim()) })) })
          }} variant="outline">Add Another Package</Button>
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 3) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600">Set Your Availability</h2>
          {availability.map((slot, idx) => (
            <div key={idx} className="mb-6 p-4 rounded-lg border bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Label>Date</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-gray-400">🛈</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Select a date you are available for bookings.</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input type="date" value={slot.date} onChange={async e => {
                    const a = [...availability]; a[idx].date = e.target.value; setAvailability(a)
                    await patchVendor({ availability: a })
                  }} className="mb-1" />
                  {errors[`availability_date_${idx}`] && <div className="text-xs text-destructive">{errors[`availability_date_${idx}`]}</div>}
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Checkbox id={`available_${idx}`} checked={slot.isAvailable} onCheckedChange={async checked => {
                    const a = [...availability]; a[idx].isAvailable = !!checked; setAvailability(a)
                    await patchVendor({ availability: a })
                  }} />
                  <Label htmlFor={`available_${idx}`}>Available</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer text-gray-400">🛈</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Check if you are available on this date.</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="destructive" onClick={async () => {
                  const updated = availability.filter((_, i) => i !== idx)
                  setAvailability(updated)
                  await patchVendor({ availability: updated })
                }} disabled={availability.length === 1} size="sm">Remove</Button>
              </div>
            </div>
          ))}
          <Button onClick={async () => {
            const updated = [...availability, { date: "", isAvailable: true }]
            setAvailability(updated)
            await patchVendor({ availability: updated })
          }} variant="outline">Add Another Date</Button>
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 4) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600 flex items-center gap-2">
            Business Verification
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fb7185" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fb7185">i</text></svg>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Upload a business license, government ID, or other proof. This is required to activate your vendor profile and receive bookings.</span>
              </TooltipContent>
            </Tooltip>
          </h2>
          <div className="mb-2 text-sm text-muted-foreground">
            Please upload a business license, government ID, or other proof of business. This is required for verification and to receive bookings.
          </div>
          <div className="mb-2">
            <span className="font-medium">Status:</span> {verificationStatus === 'approved' ? (
              <span className="text-green-600">Approved</span>
            ) : verificationStatus === 'pending' ? (
              <span className="text-yellow-600">Pending Review</span>
            ) : (
              <span className="text-red-600">Rejected</span>
            )}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">
                  <Label htmlFor="verification-upload">Upload Documents</Label>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Accepted formats: PDF, JPG, PNG. You can upload multiple files. If rejected, please re-upload valid documents.</span>
              </TooltipContent>
            </Tooltip>
            {verificationStatus === 'rejected' && <span className="text-xs text-red-600">Please re-upload valid documents.</span>}
          </div>
          <Input id="verification-upload" type="file" multiple accept="application/pdf,image/*" onChange={async e => {
            if (e.target.files) {
              const files = Array.from(e.target.files).map(f => f.name)
              setVerificationDocs([...verificationDocs, ...files])
              await patchVendor({ verificationDocs: [...verificationDocs, ...files] }) // auto-save
              setVerificationStatus('pending')
            }
          }} disabled={verificationStatus === 'approved'} />
          {errors.verificationDocs && <div className="text-xs text-destructive mt-2">{errors.verificationDocs}</div>}
          <div className="mt-4 flex flex-wrap gap-2">
            {verificationDocs.map((doc, idx) => (
              <div key={idx} className="p-2 border rounded bg-background text-xs text-muted-foreground">{doc}</div>
            ))}
          </div>
          {verificationStatus === 'approved' && (
            <div className="mt-2 text-green-600 text-sm">Your documents have been approved. You are now verified!</div>
          )}
          {verificationStatus === 'pending' && (
            <div className="mt-2 text-yellow-600 text-sm">Your documents are under review. You will be notified once approved.</div>
          )}
          {verificationStatus === 'rejected' && (
            <div className="mt-2 text-red-600 text-sm">Your documents were rejected. Please re-upload valid documents.</div>
          )}
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 5) {
    content = (
      <TooltipProvider>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-rose-600 flex items-center gap-2">
            Service Area
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">🛈</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Specify where your business is based and the main area you serve. This helps couples find you!</span>
              </TooltipContent>
            </Tooltip>
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>City</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-gray-400">🛈</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Main city where your business is located (e.g. Colombo).</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input value={serviceArea.city} onChange={async e => {
              const updated = { ...serviceArea, city: e.target.value }
              setServiceArea(updated)
              await patchVendor({ serviceArea: updated })
            }} placeholder="e.g. Colombo" />
            {errors.serviceArea_city && <div className="text-xs text-destructive">{errors.serviceArea_city}</div>}
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <Label>Province</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-gray-400">🛈</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Province or region (e.g. Western, Central, Southern).</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input value={serviceArea.province} onChange={async e => {
              const updated = { ...serviceArea, province: e.target.value }
              setServiceArea(updated)
              await patchVendor({ serviceArea: updated })
            }} placeholder="e.g. Western" />
            {errors.serviceArea_province && <div className="text-xs text-destructive">{errors.serviceArea_province}</div>}
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <Label>Address</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer text-gray-400">🛈</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Street address or main business location.</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input value={serviceArea.address} onChange={async e => {
              const updated = { ...serviceArea, address: e.target.value }
              setServiceArea(updated)
              await patchVendor({ serviceArea: updated })
            }} placeholder="Street address" />
            {errors.serviceArea_address && <div className="text-xs text-destructive">{errors.serviceArea_address}</div>}
          </div>
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Map/location picker coming soon for more precise service area selection.</div>
            <div className="w-full h-32 bg-muted/50 border rounded flex items-center justify-center text-muted-foreground">[Map Picker Placeholder]</div>
          </div>
        </div>
      </TooltipProvider>
    )
  } else if (currentStep === 6) {
    content = (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-rose-600">Onboarding Complete!</h2>
        <p className="mb-4 text-muted-foreground">You can now manage your vendor profile and receive bookings.</p>
        <Button onClick={handleNext} className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">Go to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-rose-600">Vendor Onboarding</CardTitle>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-4" />
          <div className="flex justify-between mt-6 mb-2">
            {steps.map((step, idx) => (
              <div key={step} className={`text-xs transition-all duration-200 ${idx === currentStep ? 'font-bold text-rose-600 scale-110' : 'text-gray-400'}`}>{step}</div>
            ))}
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {errors.api && <div className="mb-4 text-destructive text-center">{errors.api}</div>}
          {loading && <div className="mb-4 text-center text-rose-600">Saving...</div>}
          {success && <div className="mb-4 text-center text-green-600">Saved!</div>}
          {content}
          <div className="flex justify-between mt-8">
            <Button onClick={handleBack} disabled={currentStep === 0 || loading} variant="outline">Back</Button>
            {currentStep < steps.length - 1 && <Button onClick={handleNext} className="bg-gradient-to-r from-rose-500 to-pink-600 text-white" disabled={loading}>Next</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 