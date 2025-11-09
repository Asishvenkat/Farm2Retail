import "./productList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../../redux/apiCalls";

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteProduct(id, dispatch);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params.row.images && params.row.images[0] ? params.row.images[0] : '/default-product.jpg'}
              alt=""
            />
            {params.row.name}
          </div>
        );
      },
    },
    {
       field: "quantity",
       headerName: "Stock",
       width: 200,
      renderCell: (params) => {
        return `${params.row.quantity} ${params.row.unit}`;
      }
    },
    {
      field: "price",
      headerName: "Price",
      width: 160,
      renderCell: (params) => {
        return `₹${params.row.price}/${params.row.unit}`;
      }
    }
  ];

  // Add some debugging
  console.log('Products from Redux:', products);
  console.log('Products length:', products?.length);

  return (
    <div className="productList">
      <DataGrid
        rows={products || []}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
      />
    </div>
  );
}