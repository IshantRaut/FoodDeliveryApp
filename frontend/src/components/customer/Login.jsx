import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
    const {
        setshowUserLogin,
        setuser,
        setisSeller,
        axios,
        navigate
    } = useAppContext();

    const [state, setState] =
        React.useState("login");

    const [name, setName] =
        React.useState("");

    const [email, setEmail] =
        React.useState("");

    const [password, setPassword] =
        React.useState("");


    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const { data } = await axios.post(
                `/api/user/${state}`,
                {
                    name,
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            const nextUser = data.user || null;

            if (!nextUser) {
                toast.error(
                    "User information was not returned"
                );
                return;
            }

            setuser(nextUser);

            setisSeller(
                nextUser.role === "seller"
            );

            setshowUserLogin(false);

            toast.success(data.message);

            if (nextUser.role === "seller") {
                navigate("/seller");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error(
                "Login Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <form
                onSubmit={onSubmitHandler}
                className="relative bg-white w-full max-w-md mx-4 p-8 rounded-lg shadow-xl"
            >

                {/* Close */}

                <button
                    type="button"
                    onClick={() =>
                        setshowUserLogin(false)
                    }
                    className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
                >
                    ×
                </button>


                {/* Heading */}

                <h2 className="text-2xl font-semibold text-center mb-6">
                    {state === "login"
                        ? "Login"
                        : "Create Account"}
                </h2>


                {/* Name */}

                {state === "register" && (
                    <div className="mb-4">

                        <label className="block text-sm mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                            required
                        />

                    </div>
                )}


                {/* Email */}

                <div className="mb-4">

                    <label className="block text-sm mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                        required
                    />

                </div>


                {/* Password */}

                <div className="mb-5">

                    <label className="block text-sm mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                        required
                    />

                </div>


                {/* Submit */}

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-dull transition"
                >
                    {state === "login"
                        ? "Login"
                        : "Create Account"}
                </button>


                {/* Switch */}

                <p className="text-sm text-center mt-5 text-gray-600">

                    {state === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}

                    <button
                        type="button"
                        onClick={() => {
                            setState(
                                state === "login"
                                    ? "register"
                                    : "login"
                            );

                            setName("");
                            setEmail("");
                            setPassword("");
                        }}
                        className="text-primary font-medium"
                    >
                        {state === "login"
                            ? "Register"
                            : "Login"}
                    </button>

                </p>

            </form>

        </div>
    );
};

export default Login;