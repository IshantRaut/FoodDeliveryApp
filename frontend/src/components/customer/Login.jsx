import React from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {
        setshowUserLogin,
        setuser,
        setisSeller,
        axios,
        navigate
    } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // NEW
    const [role, setRole] = React.useState("customer");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const { data } = await axios.post(`/api/user/${state}`, {
                name,
                email,
                password,

                // Send role only during registration
                ...(state === "register" && { role })
            });

            if (data.success) {

                const nextUser = data.user || null;

                setuser(nextUser);
                setisSeller(nextUser?.role === "seller");
                setshowUserLogin(false);

                if (nextUser?.role === "seller") {
                    setRole("customer");
                    navigate('/seller');
                } else {
                    navigate("/")
                }

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    return (
        <div
            onClick={() => setshowUserLogin(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'
        >

            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
            >

                {/* Heading */}
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span>{" "}
                    {state === "login" ? "Login" : "Sign Up"}
                </p>

                {/* Name */}
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>

                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="text"
                            required
                        />
                    </div>
                )}

                {/* Email */}
                <div className="w-full">
                    <p>Email</p>

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="email"
                        required
                    />
                </div>

                {/* Password */}
                <div className="w-full">
                    <p>Password</p>

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required
                    />
                </div>

                {/* Account Type */}
                {state === "register" && (
                    <div className="w-full">

                        <p className="mb-2">Create account as</p>

                        <div className="flex gap-6">

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="customer"
                                    checked={role === "customer"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Customer
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="seller"
                                    checked={role === "seller"}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Seller
                            </label>

                        </div>

                    </div>
                )}

                {/* Switch Login/Register */}
                {state === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span
                            onClick={() => setState("register")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
                >
                    {state === "register"
                        ? "Create Account"
                        : "Login"}
                </button>

            </form>
        </div>
    )
}

export default Login;