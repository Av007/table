import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { AppBar, Toolbar, Box, Link, Chip } from "@mui/material";
import { useAuth } from "../provider/AuthProvider";
import { GridToolbarQuickFilter } from "@mui/x-data-grid/components";
import { getEnvsUrl } from "../helpers/envs";

const Homepage = () => {
  const { token } = useAuth();
  const [username] = useState(localStorage.getItem("email"));
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState(localStorage.getItem("query") || "");
  const [order, setOrder] = useState("");
  const [, setFilterModel] = useState({
    items: [],
    quickFilterValues: [],
  });
  const apiRef = useGridApiRef();

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "price", headerName: "Price" },
    { field: "stock", headerName: "Stock" },
  ];

  const fetchResults = useCallback(
    _.debounce((searchQuery, sortOrder) => {
      console.log("Fetching API:", searchQuery, sortOrder);
      axios
        .get(`${getEnvsUrl()}api/products`, {
          params: { search: searchQuery, ordering: sortOrder },
          paramsSerializer: (params) =>
            Object.keys(params)
              .map((key) => `${key}=${encodeURIComponent(params[key])}`)
              .join("&"),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const items =
            response?.data?.reduce((acc, curr) => acc.concat(curr), []) || [];

          setFilterModel((prev) => ({ ...prev, items }));
          setData(items);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, 500),
    [token]
  );

  useEffect(() => {
    fetchResults(query, order);
  }, [query, order, fetchResults]);

  useEffect(() => {
    if (query) {
      localStorage.setItem("query", query);
    }
  }, [query]);

  const onFilterChange = useCallback((filterModelValue) => {
    const q = filterModelValue.quickFilterValues.join(" ");
    if (filterModelValue.quickFilterValues.length > 0) {
      setQuery(q);
    } else {
      localStorage.removeItem("query");
    }
  }, [apiRef]);

  const handleSortModelChange = useCallback((sortModel) => {
    if (sortModel.length > 0) {
      const field = sortModel[0].field;
      const sort = sortModel[0].sort;
      setOrder(sort === "desc" ? `-${field}` : field);
    } else {
      setOrder("");
    }
  }, []);

  const rowSelected = async (newRowSelectionModel) => {
    for (const item of newRowSelectionModel) {
      if (!selected.includes(item)) {
        setSelected(newRowSelectionModel);
        await axios.patch(
          `${import.meta.env.VITE_URL}api/product/${item}`,
          { id: item, selected: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" alignItems="center" gap={2}>
            {token && (
              <Chip
                sx={{
                  color: "white",
                  borderColor: "white",
                  backgroundColor: "transparent",
                }}
                label={username}
                variant="outlined"
              />
            )}
            <Link
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                ":hover": { color: "lightgray" },
              }}
              href="/logout"
            >
              Logout
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: localStorage.getItem("query")
                    ? [localStorage.getItem("query")]
                    : [],
                },
              },
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            onSortModelChange={handleSortModelChange}
            slots={{ toolbar: GridToolbarQuickFilter }}
            onRowSelectionModelChange={rowSelected}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            rows={data}
            columns={columns}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </div>
      </Box>
    </>
  );
};

export default Homepage;
