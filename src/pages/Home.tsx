import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { FaAnglesDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import clientsData from '../assets/data.json';
import videoCover from "../assets/videos/cover.mp4";


// Define the correct type for clients data
interface Client {
  src: string;
  alt: string;
}


const banners = [
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];

const categories = [
  "Electronics",
  "Mobiles",
  "Laptop",
  "Books",
  "Fashion",
  "Appliances",
  "Furniture",
  "Home Decor",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const dispatch = useDispatch()
  const [clients, setClients] = useState<Client[]>([]); // Explicitly define the type of clients




  const { data, isLoading, isError } = useLatestProductQuery("");



  const addToCarthandler = (cartItem: CartItem) => {

    if (cartItem.stock < 1) return toast.error("Out Of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  }


  if (isError) toast.error("");

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language. Silhouettes and textures speak volumes, a conversation starter with every bold print. It's a way to tell our story, a confidence booster, or a playful exploration. From elegance to rebellion, fashion lets us navigate the world in style.".split(
      " "
    );


  useEffect(() => {
    setClients(clientsData.clients);  // Set the data directly from the import
  }, []);

  return (
    <>
      <div className="home">
        <section></section>

        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
        </div>

        <h1>
          Latest Products
          <Link to={"/search"} className="findmore">More</Link>
        </h1>


        <main>
          {isLoading ?
            (
              <>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} style={{ height: "25rem" }}>
                    <SkeletonLoader width="18.75rem" length={1} height="20rem" />
                    <SkeletonLoader width="18.75rem" length={2} height="1.95rem" />
                  </div>
                ))}
              </>
            ) : (
              data?.products.map((i) => {
                return <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCarthandler}
                  photos={i.photos}
                />

              })
            )}
        </main>
      </div>


      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>


      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  )
}

export default Home