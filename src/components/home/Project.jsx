import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import ProjectCard from "./ProjectCard";
import axios from "axios";
import { Card, Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { PROJECTS } from "./Constant";

const dummyProject = {
  name: null,
  description: null,
  svn_url: null,
  stargazers_count: null,
  languages_url: null,
  pushed_at: null,
};
const API = "https://api.github.com";
// const gitHubQuery = "/repos?sort=updated&direction=desc";
// const specficQuerry = "https://api.github.com/repos/hashirshoaeb/";

const Project = ({ heading, username, length, specfic }) => {
  const allReposAPI = `${API}/users/${username}/repos?sort=updated&direction=desc`;
  const specficReposAPI = `${API}/repos/${username}`;
  const dummyProjectsArr = new Array(length + specfic.length).fill(
    dummyProject
  );

  const [projectsArray, setProjectsArray] = useState([]);

  const fetchRepos = useCallback(async () => {
    let repoList = [];
    try {
      // getting all repos
      const response = await axios.get(allReposAPI);
      // slicing to the length
      repoList = [...response.data.slice(0, length)];
      // adding specified repos
      try {
        for (let repoName of specfic) {
          const response = await axios.get(`${specficReposAPI}/${repoName}`);
          repoList.push(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
      // setting projectArray
      // TODO: remove the duplication.
      setProjectsArray(repoList);
    } catch (error) {
      console.error(error.message);
    }
  }, [allReposAPI, length, specfic, specficReposAPI]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <Jumbotron fluid id="projects" className="bg-light m-0">
      <Container className="">
        <h2 className="display-4 pb-5 text-center">{heading}</h2>
        <div style={{ display: "grid", gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }} >
          {
            PROJECTS.map(({ title, logo, description, repolink }) => (
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' }} >
                <div style={{ fontSize: '18px', fontWeight: 'bold' }} >{title}</div>
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0px' }} >
                  <div style={{ width: '180px', height: '180px', flexShrink: '0' }} >
                    <img src={logo} alt="" style={{ borderRadius: '6px', objectFit: 'fill', border: '1px solid grey', width: '100%', height: '100%' }} />
                  </div>
                  <div style={{ fontSize: '14px' }} >{description}</div>
                </div>
                <hr />
                <div>
                  <a href={repolink} target=" _blank" className="btn btn-outline-secondary mx-2">
                    <i className="fab fa-github" /> Repo
                  </a>
                </div>
              </div>
            ))
          }
        </div>
      </Container>
    </Jumbotron>
  );
};

export default Project;
