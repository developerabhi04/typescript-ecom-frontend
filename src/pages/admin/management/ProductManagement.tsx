import { FormEvent, useEffect, useState } from "react"
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { SkeletonLoader } from "../../../components/Loader";
import { responseToast, transformImage } from "../../../utils/features";
import { FaTrash } from "react-icons/fa";
import { useFileHandler } from "6pp";



const ProductManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();


  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  const { data, isLoading, isError } = useProductDetailsQuery(id || "");

  console.log(data);


  const { price, photos, name, description, stock, category } = data?.product || {
    photos: [],
    category: "",
    name: "",
    stock: 0,
    price: 0,
    description: ""
  }

  const [Loading, setIsLoading] = useState<boolean>(false);

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);



  const photosFiles = useFileHandler("multiple", 10, 5);

  // const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file: File | undefined = e.target.files?.[0];

  //   const reader: FileReader = new FileReader();

  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       if (typeof reader.result === "string") {
  //         setPhotoUpdate(reader.result);
  //         setPhotoFile(file);
  //       }
  //     }
  //   }
  // }


  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      if (nameUpdate) formData.set("name", nameUpdate);
      if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());

      if (categoryUpdate) formData.set("category", categoryUpdate);

      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

      if (user && data?.product) {
        const res = await updateProduct({
          formData,
          userId: user._id,
          productId: data.product._id,
        });


        responseToast(res, navigate, `/admin/products`);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }

  }


  const deleteHandler = async () => {
    if (user && data?.product) {
      const res = await deleteProduct({
        userId: user._id,
        productId: data.product._id,
      });

      responseToast(res, navigate, "/admin/products");
    }
  };


  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setDescriptionUpdate(data.product.description);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data])

  if (isError) return <Navigate to={"/404"} />


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* main */}
      <main className="management-section">

        {isLoading ? (
          <SkeletonLoader length={20} />
        ) : (
          <>
            <section>

              <strong>ID - {data?.product._id} </strong>
              <img src={transformImage(photos[0].url)} alt="product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : <span className="red">Not Available</span>
              }
              <h3>${price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form action="" onSubmit={submitHandler}>
                <h2>Update Product</h2>

                <div>
                  <label>Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    required
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Stock</label>
                  <input
                    required
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={photosFiles.changeHandler}
                  />
                </div>


                {photosFiles.error && <p>{photosFiles.error}</p>}

                {photosFiles.preview && (
                  <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
                    {photosFiles.preview.map((img, i) => (
                      <img style={{ width: 100, height: 100, objectFit: "cover" }}
                        key={i}
                        src={img}
                        alt="New Image"
                      />
                    ))}
                  </div>
                )}

                <button disabled={Loading} type="submit">
                  {Loading ? "Updating product..." : "Update"}
                </button>
              </form>
            </article>
          </>
        )
        }

      </main >
    </div >
  )
}


export default ProductManagement;







// const [product, setProduct] = useState({ _id: "", photo: "", category: "", name: "", stock: 0, price: 0 });
// const { price, photo, name, stock, category } = product;