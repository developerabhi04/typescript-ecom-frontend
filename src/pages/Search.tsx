import { useState } from "react"
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const searchQuery = useSearchParams()[0];
  const dispatch = useDispatch();

  const { data: categoriesResponse, isLoading: loadingCategories, isError, error } = useCategoriesQuery("")

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);


  const { isLoading: productLoading, data: searchedData, isError: productIsError, error: productError } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  })
  // console.log(searchedData);



  const addToCarthandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out Of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  }



  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message)
  }
  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }


  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        {/* sort */}
        <div>
          <h2>Sort</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        {/* min to max price */}
        <div>
          <h2>Max Price: ₹{maxPrice || ""}</h2>
          <input
            type="range"
            min={500}
            max={300000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>

        {/* category */}
        <div>
          <h2>Category</h2>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>{i.toUpperCase()}</option>
              ))
            }
          </select>
        </div>
      </aside>

      <main>
        {/* Product Card */}
        <h1>Products</h1>
        <input type="text" placeholder="Search by Name" value={search} onChange={(e) => setSearch(e.target.value)} />

        {productLoading ? (
          <SkeletonLoader length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCarthandler}
                photos={i.photos}
              />
            ))}
          </div>
        )

        }

        {/* Paginations */}
        {
          searchedData && searchedData.totalPage > 1 && (
            <article>
              <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
              <span>
                {page} of {searchedData.totalPage}
              </span>
              <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </article>
          )

        }

      </main >
    </div >
  )
}

export default Search