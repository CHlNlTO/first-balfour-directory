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
import { Persons, AddPerson } from "@/lib/types"
import { formSchema } from "@/lib/validation"
import { addPerson } from "@/lib/api"

export function AddPersonCard({ maxId, persons, setPersons }: { maxId: number, persons: Persons[], setPersons: (persons: Persons[]) => void}) {

  const [ loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<AddPerson>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      profile: undefined,
    },
  })
  
  const onSubmit = async (person: AddPerson) => {
    setLoading(true);
    console.log("Add (MaxId):", maxId)

    person.id = (maxId+1).toString()
    console.log("onSubmit: ", person)

    const addPersonResponse = await addPerson(person)

    console.log("Add Person Response: ", addPersonResponse)

    setLoading(false);
    form.reset();
    toast({ description: "Person added successfully", duration: 5000 });
    //TODO (add refresh after adding person)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <Card className="max-w-2xl mx-auto border-0">
          <CardHeader>
            <CardTitle>Add Person</CardTitle>
            <CardDescription>Enter user details then click save.</CardDescription>
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
                              <Input placeholder="Juan" {...field} />
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
                              <Input placeholder="Dela Cruz" {...field} />
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
                      <div className="space-y-2">
                        <FormLabel>Department</FormLabel>
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
                      <div className="space-y-2">
                        <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="juandelacruz@email.com" {...field} />
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
                            <Input placeholder="09123456789" {...field} />
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
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <Input
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
                <CardFooter className="flex justify-center w-full p-0 pt-6">
                  <div className="space-y-2 w-full p-0">
                    <LoadingButton className="w-full" loading={loading} type="submit">Add person</LoadingButton>
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
