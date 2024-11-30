"use client";

import "@styles/Categories.scss";
import { categories } from "@data";
import WorkList from "./WorkList";
import Loader from "./Loader";
import { useEffect, useState } from "react";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(`/api/work/list/${selectedCategory}`);
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    };

    if (selectedCategory) {
      getWorkList();
    }
  }, [selectedCategory]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="categories">
        {categories?.map((item, index) => (
          <p
            onClick={() => setSelectedCategory(item)}
            className={`${item === selectedCategory ? "selected" : ""}`}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

      <WorkList data={workList} />
    </>
  );
};

export default Feed;
