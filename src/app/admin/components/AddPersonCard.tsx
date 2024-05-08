"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { positions, departments } from "@/lib/const"
import { Persons } from "@/lib/types"
import { formSchema } from "@/lib/validation"
import { addPerson } from "@/lib/api"

import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { LoadingButton } from "../../../components/ui/loading-button";
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export function AddPersonCard({ maxId, setRefetchData }: { maxId: number, setRefetchData: (refetchData: boolean) => void}) {

  const [ loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<Persons>({
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
  
  const onSubmit = async (person: Persons) => {
    setLoading(true);

    person.id = (maxId+1).toString()
    const addPersonResponse = await addPerson(person)

    setRefetchData(true)
    setLoading(false);
    form.reset();
    toast({ description: "Person added successfully" });
  
  }

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <Card className="max-w-2xl mx-auto border-0">
          <CardHeader>
            <CardTitle>Add Person</CardTitle>
            <CardDescription>Enter user details then click add.</CardDescription>
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
                              {positions.map((position) => (
                                  <SelectItem key={position} value={position}>
                                    {position}
                                  </SelectItem>
                                ))
                              }
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
                              {departments.map((department) => (
                                  <SelectItem key={department} value={department}>
                                    {department}
                                  </SelectItem>
                                ))
                              }
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
