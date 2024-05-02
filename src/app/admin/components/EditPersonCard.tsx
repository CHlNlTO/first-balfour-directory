"use client"

import * as React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "../../../components/ui/loading-button";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Persons } from "@/lib/types"
import { formSchema } from "@/lib/validation"

export function EditPersonCard({ setPersons, person }: { setPersons: (persons: Persons[]) => void, person: Persons}) {

  const [ loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: person.id.toString(),
      firstName: person.firstName,
      lastName: person.lastName,
      position: person.position,
      department: person.department,
      email: person.email,
      phone: "0" + person.phone.toString(),
      profile: typeof person.profile === 'string' ? undefined : person.profile,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const response = await fetch("/api/", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    
    if (!response.ok) {
      toast({description: "Failed to add person"})
      throw new Error("Failed to send message");
    }
    response.json();
    const url = "https://script.google.com/macros/s/AKfycbx6VNmWi9VtM3ZX8cpCftDyh8nRdVL3UZJGq57prOk3JI6uJ2E_eiC0DyE5OzSUJG9aHQ/exec"
    const getPersons = async () => {
      const response = await fetch(url);
      const values = await response.json();
      setPersons(values)
      console.log(values)
      setLoading(false);
    }
    getPersons();
    toast({description: "Person added successfully"})
    form.reset();
    setLoading(false);
    
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <Card className="max-w-2xl mx-auto border-0">
          <CardHeader>
            <CardTitle>Edit Person</CardTitle>
            <CardDescription>Enter user details then click update.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormField 
                    control={form.control} 
                    name="firstName" 
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-0 sm:space-y-2">
                          <FormLabel className="text-xs">First Name</FormLabel>
                            <FormControl>
                              <Input className="h-9 sm:h-10 mt-0" placeholder="Juan" {...field} />
                            </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={form.control} 
                    name="lastName" 
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-0 sm:space-y-2">
                          <FormLabel className="text-xs">Last Name</FormLabel>
                            <FormControl>
                              <Input className="h-9 sm:h-10 mt-0" placeholder="Dela Cruz" {...field} />
                            </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-0 sm:space-y-2">
                        <FormLabel className="text-xs">Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Position</SelectLabel>
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="President">President</SelectItem>
                              <SelectItem value="Vice President">Vice President</SelectItem>
                              <SelectItem value="Secretary">Secretary</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-0 sm:space-y-2">
                        <FormLabel className="text-xs">Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Department</SelectLabel>
                              <SelectItem value="Customer Service">Customer Service</SelectItem>
                              <SelectItem value="Finance and Accounting">Finance and Accounting</SelectItem>
                              <SelectItem value="Human Resources">Human Resources</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Legal">Legal</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                )}
                />
                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-0 sm:space-y-2">
                        <FormLabel className="text-xs">Email</FormLabel>
                          <FormControl>
                            <Input className="h-9 sm:h-10 mt-0" placeholder="juandelacruz@email.com" {...field} />
                          </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control} 
                  name="phone" 
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-0 sm:space-y-2">
                        <FormLabel className="text-xs">Phone</FormLabel>
                          <FormControl>
                            <Input className="h-9 sm:h-10 mt-0" placeholder="09123456789" {...field} />
                          </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Profile Photo</FormLabel>
                      <FormControl>
                        <Input className="h-9 sm:h-10 mt-0"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CardFooter className="flex justify-center w-full p-0 pt-2">
                  <div className="space-y-0 sm:space-y-2 w-full p-0">
                    <LoadingButton className="w-full" loading={loading} type="submit">Update person</LoadingButton>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
