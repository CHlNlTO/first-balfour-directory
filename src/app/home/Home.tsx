"use client"

import { useEffect, useState } from "react";
import { Persons } from "../admin/forms/FormTableView";

export default function Home() {

  const [data, setData] = useState<Persons[]>([]);

  useEffect(() => {
    const url = "https://script.google.com/macros/s/AKfycbx6VNmWi9VtM3ZX8cpCftDyh8nRdVL3UZJGq57prOk3JI6uJ2E_eiC0DyE5OzSUJG9aHQ/exec"
    const getPersons = async () => {
      const response = await fetch(url);
      const values = await response.json();
      sessionStorage.setItem("data", JSON.stringify(values))
      setData(values)
      console.log(values)
    }
    getPersons();

  }, [])
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello, Home!
      <div>
        {Array.isArray(data) && data.map((person: Persons, index) => 
          (
            <div key={index}>
              <div className="flex flex-row gap-1">
                <p>{person.firstName}</p>
                <p>{person.lastName}</p>
              </div>
              <p>{person.position}</p>
              <p>{person.department}</p>
              <p>{person.email}</p>
              <p>{person.phone}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}