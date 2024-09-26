import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobIds();
  }, []);

  useEffect(() => {
    if (jobIds.length > 0) {
      fetchJobs();
    }
  }, [jobIds, currentPage]);

  const fetchJobIds = async () => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const data = await response.json();
      setJobIds(data);
    } catch (error) {
      console.error("Error fetching job IDs:", error);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    const start = (currentPage - 1) * 6;
    const end = currentPage * 6;
    const jobIdsSlice = jobIds.slice(start, end);
    const jobPromises = jobIdsSlice.map(async (id) => {
      try {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching job:", error);
        return null;
      }
    });
    const jobData = await Promise.all(jobPromises);
    setJobs((prevJobs) => [
      ...prevJobs,
      ...jobData.filter((job) => job !== null),
    ]);
    setIsLoading(false);
  };

  const loadMoreJobs = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleJobClick = (url) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <div className="container">
      <h1 className="title">Hacker News Job Board</h1>
      <div className="job-list">
        {jobs.map((job) => (
          <div
            className="job"
            key={job.id}
            onClick={() => handleJobClick(job.url)}
          >
            <h2 className="job-title">{job.title}</h2>
            <p className="job-info">
              Posted by {job.by} on{" "}
              {new Date(job.time * 1000).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <button className="load-more" onClick={loadMoreJobs}>
          Load more
        </button>
      )}
    </div>
  );
};

export default App;
