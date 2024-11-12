import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import { FaTrash } from "react-icons/fa";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../components/Loader";
import { useSelector } from "react-redux";
import { responseToast } from "../../utils/features";



interface DataType {
  avatar: ReactElement;
  name: string;
  gender: string;
  email: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  }
]

const Customers = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!)

  const [rows, setRows] = useState<DataType[]>([]);


  const [deleteUsers] = useDeleteUserMutation()

  const deleteHandler = async (userId: string) => {
    const res = await deleteUsers({
      userId,
      adminUserId: user?._id!,
    })
    responseToast(res, null, '')
  }



  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message)
  }


  useEffect(() => {
    if (data)
      setRows(
        data.users.map((i) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={i.photo}
              alt={i.name}
            />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button onClick={() => deleteHandler(i._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
  }, [data]);




  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* main */}
      <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>

    </div>
  )
}

export default Customers