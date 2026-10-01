import React, { useState } from "react";
import {
    assets,
    categories
} from "../../assets/assets";

import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const AddProduct = () => {

    const [files, setFiles] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [offerPrice, setOfferPrice] =
        useState("");


    const { axios } =
        useAppContext();


    const onSubmitHandler = async (event) => {

        event.preventDefault();


        try {

            // -------------------------
            // VALIDATION
            // -------------------------

            const selectedFiles =
                files.filter(Boolean);

            if (selectedFiles.length === 0) {
                toast.error(
                    "Please select at least one image"
                );
                return;
            }


            if (!description.trim()) {
                toast.error(
                    "Please enter product description"
                );
                return;
            }


            if (!category) {
                toast.error(
                    "Please select a category"
                );
                return;
            }


            // -------------------------
            // PRODUCT DATA
            // -------------------------

            const productData = {

                name: name.trim(),

                description:
                    description
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),

                category,

                price: Number(price),

                offerPrice: Number(offerPrice)

            };


            // -------------------------
            // FORM DATA
            // -------------------------

            const formData =
                new FormData();


            formData.append(
                "productData",
                JSON.stringify(productData)
            );


            for (const file of selectedFiles) {

                formData.append(
                    "images",
                    file
                );

            }


            // -------------------------
            // API REQUEST
            // -------------------------

            const { data } =
                await axios.post(
                    "/api/product/add",
                    formData,
                    {
                        withCredentials: true
                    }
                );


            // -------------------------
            // RESPONSE
            // -------------------------

            if (data.success) {

                toast.success(
                    data.message
                );


                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setFiles([]);

            } else {

                toast.error(
                    data.message
                );
            }


        } catch (error) {

            console.error(
                "Add Product Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };


    return (

        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">

            <form
                onSubmit={onSubmitHandler}
                className="md:p-10 p-4 space-y-5 max-w-lg"
            >

                {/* PRODUCT IMAGES */}

                <div>

                    <p className="text-base font-medium">
                        Product Image
                    </p>


                    <div className="flex flex-wrap items-center gap-3 mt-2">

                        {Array(4)
                            .fill("")
                            .map((_, index) => (

                                <label
                                    key={index}
                                    htmlFor={`image${index}`}
                                >

                                    <input
                                        onChange={(e) => {

                                            const file =
                                                e.target.files?.[0];

                                            if (!file) {
                                                return;
                                            }

                                            const updatedFiles =
                                                [...files];

                                            updatedFiles[index] =
                                                file;

                                            setFiles(
                                                updatedFiles
                                            );

                                        }}
                                        type="file"
                                        id={`image${index}`}
                                        accept="image/*"
                                        hidden
                                    />


                                    <img
                                        className="max-w-24 w-24 h-24 object-cover cursor-pointer border rounded"
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(
                                                    files[index]
                                                )
                                                : assets.upload_area
                                        }
                                        alt="Upload"
                                        width={100}
                                        height={100}
                                    />

                                </label>

                            ))}

                    </div>

                </div>


                {/* PRODUCT NAME */}

                <div className="flex flex-col gap-1 max-w-md">

                    <label
                        className="text-base font-medium"
                        htmlFor="product-name"
                    >
                        Product Name
                    </label>


                    <input
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        value={name}
                        id="product-name"
                        type="text"
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="flex flex-col gap-1 max-w-md">

                    <label
                        className="text-base font-medium"
                        htmlFor="product-description"
                    >
                        Product Description
                    </label>


                    <textarea
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        value={description}
                        id="product-description"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Enter each description point on a new line"
                        required
                    />

                </div>


                {/* CATEGORY */}

                <div className="w-full flex flex-col gap-1">

                    <label
                        className="text-base font-medium"
                        htmlFor="category"
                    >
                        Category
                    </label>


                    <select
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        value={category}
                        id="category"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    >

                        <option value="">
                            Select Category
                        </option>


                        {categories.map(
                            (item, index) => (

                                <option
                                    key={index}
                                    value={item.path}
                                >
                                    {item.path}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* PRICE */}

                <div className="flex items-center gap-5 flex-wrap">

                    <div className="flex-1 flex flex-col gap-1 w-32">

                        <label
                            className="text-base font-medium"
                            htmlFor="product-price"
                        >
                            Product Price
                        </label>


                        <input
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            value={price}
                            id="product-price"
                            type="number"
                            min="0"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />

                    </div>


                    {/* OFFER PRICE */}

                    <div className="flex-1 flex flex-col gap-1 w-32">

                        <label
                            className="text-base font-medium"
                            htmlFor="offer-price"
                        >
                            Offer Price
                        </label>


                        <input
                            onChange={(e) =>
                                setOfferPrice(
                                    e.target.value
                                )
                            }
                            value={offerPrice}
                            id="offer-price"
                            type="number"
                            min="0"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />

                    </div>

                </div>


                {/* SUBMIT */}

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary cursor-pointer text-white font-medium rounded"
                >
                    ADD
                </button>

            </form>

        </div>
    );
};


export default AddProduct;