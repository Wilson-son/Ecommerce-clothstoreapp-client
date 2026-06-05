import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice";

import ProductCard from "../components/ProductCard";

import shopnowlogo from "../assets/shopnowlogo.png";
import tralleylogo from "../assets/tralleylogo.png";
import offerbg from "../assets/offerbg.jpg";
import orangegirl from "../assets/orangegirl.png";
import greentshirt from "../assets/greentshirt.jpg";
import girlsfashion from "../assets/girlsfashion.jpg";
import tribe from "../assets/tribe.jpg";
import whitetshirt from "../assets/whitetshirt.jpg";

export default function Home() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between bg-[#F0F0F0] px-8 lg:px-20 ">
        <div className="max-w-xl">
          <h6 className="text-2xl md:text-3xl font-semibold">Trade-in Offer</h6>

          <h1 className="text-5xl md:text-6xl font-bold mt-4">
            Super Value Deals
          </h1>

          <h1 className="text-5xl md:text-6xl font-bold mt-2 text-[#088178]">
            On All Products
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Save more with coupons and up to 70% off!
          </p>

          <img src={shopnowlogo} alt="Shop Now" className="h-25 mt-2" />
        </div>

        <div>
          <img
            src={tralleylogo}
            alt="Trolley"
            className="h-[600px] w-[700px] translate-y-20"
          />
        </div>
      </div>

      {/*featured products section */}

      <div>
        <div className="  py-12">
          <h1 className="text-4xl font-bold text-center mt-12">
            Featured Products
          </h1>
          <p className="text-gray-600 text-center mt-4 text-lg">
            Summer Collection New Modern Design
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-20 mt-10">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div
            className="mt-12 text-center py-18"
            style={{
              background: `url('${offerbg}')`,
              width: "100%",
              height: "300px",
            }}
          >
            <p className="text-white text-center mt-4 text-lg">Offers </p>
            <h1 className="text-4xl font-bold text-center mt-2 text-white">
              Upto 70% Off - All t-Shirts & Accessories
            </h1>
            <button className="bg-white text-black px-6 py-3 mt-6 rounded-md">
              Shop Now
            </button>
          </div>

          {/*featured products section */}
          <h1 className="text-4xl font-bold text-center mt-12">New Arrivals</h1>
          <p className="text-gray-600 text-center mt-4 text-lg">
            Summer Collection New Modern Design
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-20 mt-10">
            {products.slice(8, 16).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/*offer deals images*/}

          <div>
            {/*first image*/}
            <div className="mt-25 mx-[100px] flex flex-row   gap-80">
              <div
                className="flex flex-col justify-center items-start p-8"
                style={{
                  backgroundImage: `url(${orangegirl})`,
                  width: "600px",
                  height: "400px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h4 className="text-3xl font-bold text-white">Crazy Deals</h4>

                <h1 className="text-4xl font-bold text-white mt-2">
                  Buy 1 Get 1 Free
                </h1>

                <p className="text-white mt-4 text-lg">
                  The best classic dress is on sale at Cara
                </p>

                <button className="border border-white text-white px-6 py-3 mt-6 hover:bg-white hover:text-black transition">
                  Shop Now
                </button>
              </div>
                {/*second image*/}
              <div
                className="flex flex-col justify-center items-start p-8"
                style={{
                  backgroundImage: `url(${greentshirt})`,
                  width: "600px",
                  height: "400px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-2xl font-bold text-white">Spring/Summer</h2>

                <h1 className="text-lg text-white mt-2">Upcoming Season</h1>

                <p className="text-white mt-2">
                  The best classic dress is on sale at Cara
                </p>

                <button className="border border-white text-white px-6 py-3 mt-4 hover:bg-white hover:text-black transition">
                  Shop Now
                </button>
              </div>
            </div>
            <div className=" mt-25 flex flex-row gap-50 px-10 ">
              <div
                className="flex flex-col justify-center items-start p-8"
                style={{
                  background: `url('${girlsfashion}')`,
                  width: "400px",
                  height: "400px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h1 className="text-4xl font-bold text-center mt-2 text-white">SEASONAL SALE</h1>
                <p className="text-black-500 text-center mt-4 text-lg">Winter Collection - New Trendy Design</p>
              </div>
              <div
                className="flex flex-col justify-center items-start p-8"
                style={{
                  background: `url('${tribe}')`,
                  width: "450px",
                  height: "400px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                 <h1 className="text-4xl font-bold text-center mt-2 text-white">NEW FOOTWEAR COLLECTION</h1>
                <p className="text-orange-500 text-center mt-4 text-lg">Spring / Summer 2023</p>
              </div>
              <div
                className="flex flex-col justify-center items-start p-8"
                style={{
                  background: `url('${whitetshirt}')`,
                  width: "400px",
                  height: "400px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                  <h1 className="text-4xl font-bold text-center mt-2 text-white">T-SHIRTS</h1>  
                  <p className="text-red-500 text-center mt-4 text-lg"> New Trendy Prints</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
