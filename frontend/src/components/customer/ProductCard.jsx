import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductCard = ({ product }) => {

    const {
        currency,
        addToCart,
        navigate
    } = useAppContext();

    return (
        <div
            onClick={() => {
                navigate(`/products/${product._id}`);
                scrollTo(0, 0);
            }}
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-3 bg-white min-w-[200px] max-w-[200px] w-full cursor-pointer"
        >

            <div className="group flex items-center justify-center px-2">

                <img
                    className="group-hover:scale-105 transition max-w-full h-auto"
                    src={product.image?.[0]}
                    alt={product.name}
                />

            </div>


            <div className="text-gray-500/60 text-sm">

                <p className="text-gray-700 font-medium text-base truncate">
                    {product.name}
                </p>


                <div className="flex items-center gap-0.5">

                    {
                        [...Array(5)].map((_, i) => (
                            <img
                                className="md:w-3.5 w-3"
                                key={i}
                                src={
                                    i < 4
                                        ? assets.star_icon
                                        : assets.star_dull_icon
                                }
                                alt=""
                            />
                        ))
                    }

                </div>


                <div className="flex items-end justify-between mt-3">

                    <p className="text-primary font-medium md:text-xl text-base">
                        {currency}
                        {product.offerPrice}
                    </p>


                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                        }}
                        className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/20 md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium"
                    >
                        <img
                            src={assets.cart_icon}
                            alt="cart"
                            className="w-4"
                        />

                        Add
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductCard;