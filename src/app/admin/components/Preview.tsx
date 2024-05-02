"use client"

import React, { useEffect, useState } from "react";
import { Persons } from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function DirectoryPreview({ persons, loading }: { persons: Persons[], loading: boolean}) {

  return(
    <div className="flex flex-wrap gap-3 sm:gap-6 max-w-full overflow-y-auto justify-around py-4">
      {
        loading ? 
          <p>Loading...</p> 
          :
          Array.isArray(persons) && persons.map((person: Persons, index: number) => 
            (
              <Card key={index} className="w-[250px] sm:w-[290px] md:w-[340px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input ">
                {
                
                  person.profile === "" ? 
                  (
                    <div className="w-full h-48 bg-gray-100"></div>
                  )
                  :
                  (
                    <Image 
                      width={300}
                      height={200}
                      src={person.profile} 
                      alt="" 
                      className="w-full h-48 object-cover bg-gray-100"
                    />
                  )
                }
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    <CardTitle className="text-[10px] sm:text-lg">
                      {person.firstName}
                        {" "} 
                      {person.lastName}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-[8px] sm:text-sm">
                    {person.position}
                  </CardDescription>
                  <CardDescription className="text-[8px] sm:text-sm">
                    {person.department}
                  </CardDescription>
                  <CardDescription className="text-[8px] sm:text-sm">
                    {person.email}
                  </CardDescription>
                  <CardDescription className="text-[8px] sm:text-sm">
                    {person.phone}
                  </CardDescription>
                </div>
              </Card>
            )
          )
      }
    </div>
  )

}