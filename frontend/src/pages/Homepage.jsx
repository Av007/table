import { useState, useEffect } from "react";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AppBar, Toolbar, Box, Link, Chip } from "@mui/material";
import { useAuth } from "../provider/AuthProvider";
import { GridToolbarQuickFilter } from "@mui/x-data-grid/components";
import axios from "axios";

const Homepage = () => {
  const { token } = useAuth();
  const [username] = useState(localStorage.getItem("email"));
  const [data, setData] = useState([]);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "description", width: 300 },
    { field: "price", headerName: "price" },
    { field: "stock", headerName: "stock" },
  ];

  const [selected, setSelected] = React.useState([]);
  const [query, setQuery] = React.useState(localStorage.getItem('query') || '');
  const [order, setOrder] = React.useState('');
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterValues: [],
  });

  useEffect(() => {
    call()
  }, [query, order]); 

  useEffect(() => {
    if (query) {
      localStorage.setItem('query', query);
    }
  }, [query]);

  const call = () => {
    axios
      .get(
        `${import.meta.env.VITE_URL}api/products`,
        {
          params: {
            search: query,
            ordering: order,
          },
          paramsSerializer: (params) => {
            let result = '';
            Object.keys(params).forEach(key => {
                result += `${key}=${encodeURIComponent(params[key])}&`;
            });
            return result.substring(0, result.length - 1);
        }
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((success) => {
        const items =
          success?.data?.reduce((acc, curr) => acc.concat(curr), []) || [];

        setFilterModel({
          ...filterModel,
          items,
        });
        setData(items);
      });
  };

  const onFilterChange = React.useCallback((filterModel) => {
    const q = filterModel.quickFilterValues.join(' ');
    setQuery(q);
  }, []);

  const handleSortModelChange = React.useCallback((sortModel) => {
    const field = sortModel[0]["field"];
    const sort = sortModel[0]["sort"];
    const sign = {
      asc: "",
      desc: "-",
    };
    setOrder(sign[sort] + field);
  }, []);

  const rowSelected = (newRowSelectionModel) => {
    newRowSelectionModel.map(async (item) => {
      if (!selected.includes(item)) {
        setSelected(newRowSelectionModel);
        await axios.patch(
          `${import.meta.env.VITE_URL}api/product/${item}`,
          {
            id: item,
            selected: 1,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
      }
    });
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
                ":hover": {
                  color: "lightgray",
                },
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
                  quickFilterValues: localStorage.getItem('query') ? [localStorage.getItem('query')] : [],
                },
              },
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              toolbar: GridToolbarQuickFilter,
            }}
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
