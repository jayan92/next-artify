"use client";

import "@styles/Search.scss";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const { query } = useParams();
  const [loading, setLoading] = useState(true);
  const [workList, setWorkList] = useState([]);

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/search/${query}`, {
        method: "GET",
      });
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkList();
  }, [query]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <h1 className="title-list">{query} result(s)</h1>

      <WorkList data={workList} />
    </>
  );
};

export default SearchPage;
