'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  countryOfCitizenship: z.string().min(1, { message: "Country of citizenship is required." }),
  linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL." }).optional().or(z.literal('')),
  visaCategories: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one visa category.",
  }),
  helpDescription: z.string().min(10, { message: "Please provide more information (at least 10 characters)." }),
})

export default function PublicLeadForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryOfCitizenship: "",
      linkedinUrl: "",
      visaCategories: [],
      helpDescription: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Here you might want to show an error message to the user
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Thank You</h1>
        <p className="mb-6">Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.</p>
        <Button onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Get An Assessment Of Your Immigration Case</h1>
      <p className="mb-6">Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryOfCitizenship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Citizenship</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Add country options here */}
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visaCategories"
            render={() => (
              <FormItem>
                <FormLabel>Visa categories of interest?</FormLabel>
                <div className="space-y-2">
                  {['O-1', 'EB-1A', 'EB-2 NIW', 'I don\'t know'].map((category) => (
                    <FormField
                      key={category}
                      control={form.control}
                      name="visaCategories"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, category])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== category
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="helpDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we help you?</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please describe your current situation, goals, and any questions you have about the visa process." 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </div>
  )
}