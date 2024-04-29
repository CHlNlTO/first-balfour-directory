// import { AddPerson } from "@/components/component/AddPerson";

// import { getSheetsData, writeSheetsData } from "@/app/_lib/readDirectory"

// export async function Admin(){

//   const data = await getSheetsData();
//   console.log("data", data);

//   try {
//     const response = await writeSheetsData({
//       firstName: "Jane",
//       lastName: "Doe",
//       position: "CEO",
//       department: "Sales",
//       email: "johndoe@gmail.com",
//       phone: "09123456789"
//     })

    
//   } catch (error: any) {
//     console.log(error.message)
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <section className="flex flex-col w-full h-full bg-gray-200 mx-10 items-center">
//         <h1>
//           Hello Admin!
//         </h1>
//       </section>
//       <AddPerson />
//     </main>
//   );
// }