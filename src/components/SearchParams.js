import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Pagination,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";

import SearchIcon from "@mui/icons-material/Search";
import apiService from "../app/apiService";

const style = {
  minHeight: "400px",
  width: "800px",
  p: 2,
  margin: "32px",
};
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));


function SearchParams({ handleCloseSearch }) {
  let [searchParams, setSearchParams] = useSearchParams();
  const [storageData, setStorageData] = useState([]);
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const limit = 15;
  const offset = limit * (page - 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get("/jobs");
        const result = response.data;
        setStorageData(result);
      } catch (error) {
        console.log(error, "error");
      }
    };

    fetchData();
  }, [page]);

  return (
    <Paper elevation={24} sx={style}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 0.5,
        }}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <TextField
          label="Search…"
          variant="standard"
          value={searchParams.get("filter") || ""}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter });
            } else {
              setSearchParams({});
            }
          }}
        />
      </Box>
      <Divider variant="middle" color="primary.dark" sx={{ mt: 1 }} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          p: 1,
          ml: 1,
          mb: 1,
          flexDirection: "column",
          textDecoration: "none",
          color: "white",
          height: 500,
        }}
      >
        {!storageData.length ? (
          <Box sx={{ position: "absolute", top: "50%", left: "50%" }}>
            <Typography variant="h6">Loading...</Typography>
          </Box>
        ) : (
          storageData
            .filter((job) => {
              let filter = searchParams.get("filter");
              if (!filter) return "";
              let name = job.title.toLowerCase();
              return name.startsWith(filter.toLowerCase());
            })
            .map((job) => (
              <Typography
                sx={{ textDecoration: "none", color: "white" }}
                component={Link}
                key={job.id}
                to={`/jobs/${job.id}`}
                onClick={handleCloseSearch}
              >
                {job.title}
              </Typography>
            ))
            .slice(offset, offset + limit)
        )}
        {searchParams.get("filter") && (
          <Box sx={{ position: "relative", left: "20%", top: "10%" }}>
            <Pagination
              count={Math.ceil(storageData.length / limit)}
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default SearchParams;
