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
import { Persons } from "../forms/FormTableView"

export type formType = z.infer<typeof formSchema>;

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  position: z.string().min(1, {
    message: "Select a position.",
  }),
  department: z.string().min(1, {
    message: "Select a department.",
  }),
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  phone: z.string().regex(/^\d{11}$/, {
    message: "Enter a valid phone number.",
  }),
})

export function EditPersonCard({ setData, person }: { setData: (data: Person[]) => void, person: Person}) {

  const [ loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      position: "",
      department: "",
      email: "",
      phone: "",
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
      setData(values)
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
            <CardDescription>Edit user details then click save.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormField 
                    control={form.control} 
                    name="firstName" 
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder={person.firstName} {...field} value={person.firstName}></Input>
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
                        <div className="space-y-2">
                          <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder={person.lastName} {...field} value={person.lastName} />
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
                      <div className="space-y-2">
                        <FormLabel>Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={person.position} defaultValue={person.position} />
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
                      <div className="space-y-2">
                        <FormLabel>Deparmtent</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={person.department} defaultValue={person.department} />
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
                        <div className="space-y-2">
                          <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder={person.email} {...field} value={person.email} />
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
                        <div className="space-y-2">
                          <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder={`0${person.phone.toString()}`} {...field} value={`0${person.phone.toString()}`} />
                            </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                <CardFooter className="flex justify-center w-full p-0 pt-6">
                  <div className="space-y-2 w-full p-0">
                    <LoadingButton className="w-full" loading={loading} type="submit">Edit person</LoadingButton>
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
