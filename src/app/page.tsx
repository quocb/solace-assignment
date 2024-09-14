"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Advocate } from "./types";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  // const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        console.log("fetching advocates...");
        const response = await fetch(
          `/api/advocates?search=${encodeURIComponent(searchTerm)}&page=${page}`
        );
        const jsonResponse = await response.json();
        setAdvocates((advocates) => {
          if (page === 1) {
            return jsonResponse.data;
          } else {
            return [...advocates, ...jsonResponse.data];
          }
        });
        // setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    };

    fetchAdvocates();
  }, [searchTerm, page]);

  // const filterAdvocates = (term: string) => {
  //   if (term.trim() === "") {
  //     setFilteredAdvocates(advocates);
  //     return;
  //   }

  //   const lowerCaseTerm = term.toLowerCase();
  //   const filtered = advocates.filter((advocate) => {
  //     return (
  //       advocate.firstName.toLowerCase().includes(lowerCaseTerm) ||
  //       advocate.lastName.toLowerCase().includes(lowerCaseTerm) ||
  //       advocate.city.toLowerCase().includes(lowerCaseTerm) ||
  //       advocate.degree.toLowerCase().includes(lowerCaseTerm) ||
  //       advocate.specialties.some((s) => s.toLowerCase().includes(lowerCaseTerm))
  //     );
  //   });

  //   setFilteredAdvocates(filtered);
  // };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
    // filterAdvocates(term);
  };

  const handleClickReset = () => {
    setSearchTerm("");
    setPage(1);
    // setFilteredAdvocates(advocates);
  };

  const handleLoadMore = () => {
    setPage((page) => page + 1);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Solace Advocates</h1>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              className="pl-8"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search advocates"
              aria-label="Search for advocates"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 px-0"
                onClick={handleClickReset}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={handleClickReset}>
            Reset Search
          </Button>
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500">
            Searching for: <span className="font-medium text-foreground">{searchTerm}</span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">First Name</TableHead>
              <TableHead className="w-[100px]">Last Name</TableHead>
              <TableHead className="w-[100px]">City</TableHead>
              <TableHead className="w-[100px]">Degree</TableHead>
              <TableHead className="min-w-[200px] max-w-[400px]">Specialties</TableHead>
              <TableHead className="w-[150px]">Years of Experience</TableHead>
              <TableHead className="w-[150px]">Phone Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advocates.map((advocate, index) => (
              <TableRow key={index}>
                <TableCell>{advocate.firstName}</TableCell>
                <TableCell>{advocate.lastName}</TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {advocate.specialties.map((specialty, sIndex) => (
                    <span key={sIndex}>{specialty}, </span>
                  ))}
                </TableCell>
                <TableCell>{advocate.yearsOfExperience}</TableCell>
                <TableCell>{advocate.phoneNumber}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <Button onClick={handleLoadMore}> Load More</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
