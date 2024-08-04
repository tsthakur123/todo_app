// components/Search.tsx
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface SearchProps {
  tasks: any;
  onFilteredTasks: any;
}

const Search: React.FC<SearchProps> = ({ tasks, onFilteredTasks }) => {
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const filteredTasks = tasks.filter((task:any) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
    onFilteredTasks(filteredTasks);
  }, [search, tasks, onFilteredTasks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    router.push(`/?search=${value}`);
  };

  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 p-2 px-4 border rounded-full"
      />
    </Suspense>
  );
};

export default Search;
