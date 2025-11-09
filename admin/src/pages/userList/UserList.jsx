import "./userList.css";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function UserList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await userRequest.get("/users");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 280 },
    {
      field: "user",
      headerName: "User",
      width: 280,
      renderCell: (params) => (
        <div className="userListUser">
          <span className="userListName">{params.row.username}</span>
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 250 },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        getRowId={(row) => row._id}
        disableRowSelectionOnClick
        columns={columns}
        pageSize={8}
     
        autoHeight
      />
    </div>
  );
}
