import React, { useState, useEffect } from 'react'
import axios from 'axios';

const CustomerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [orderData, setOrderData] = useState({
        productId: "",
        quantity: 1,
        total: 0,
        stock: 0,
        price: 0
    })

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            });
            if (response.data.success) {
                setCategories(response.data.categories);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } else {
                console.error("Failed to fetch products:", response.data.message);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter((product) => product.name.toLowerCase().includes(query));
        setFilteredProducts(filtered);
    };

    const handleChangeCategory = (e) => {
        const categoryId = e.target.value;

        if (!categoryId) {
            setFilteredProducts(products);
            return;
        }

        setFilteredProducts(
            products.filter(
                (product) => product.categoryId?._id === categoryId
            )
        );
    };
    const handleOrderChange = (product) => {
        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price
        })
        setOpenModal(true);

    }

    const closeModal = () => {
        setOpenModal(false);
    }

    const handleSubmit = async (e)  => {
            e.preventDefault();
            try{
            const response = await axios.post("http://localhost:3000/api/orders/add", orderData ,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            });
            if (response.data.success) {
                setOpenModal(false);
                setOrderData({
                    productId: '', quantity: 1, stock: 0, total: 0, price: 0 
                })
                alert("Order Added Successfully")
            }
            } catch(error){
                console.log(error);
                alert("Error", error.message);
            }

    }
    const increaseQuantity = (e) => {
    const quantity = Number(e.target.value) || 1;

    if (quantity > orderData.stock) {
        alert('Not Enough Stock');
        return;
    }

    setOrderData((prev) => ({
        ...prev,
        quantity,
        total: quantity * prev.price
    }));
};
    return (
        <div>
            <div>
                <h2 className='font-bold text-xl p-5'>
                    Products
                </h2>
            </div>
            <div className='py-4 px-6 flex justify-between items-center'>
                <div>
                    <select
                        name="category"
                        className="bg-white border p-1 rounded"
                        onChange={handleChangeCategory}
                    >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input type="text" placeholder='Search products...' className='p-2 border rounded bg-white' onChange={handleSearch} />
                </div>
            </div>
            <div>
                <table className='w-full bg-white rounded shadow-md'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 p-2'>S.No</th>
                            <th className='border border border-gray-300 p-2'>Product Name</th>
                            <th className='border border border-gray-300 p-2'>Category Name</th>
                            <th className='border border border-gray-300 p-2'>Price</th>
                            <th className='border border border-gray-300 p-2'>Stock</th>
                            <th className='border border border-gray-300 p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts && filteredProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className='border border border-gray-300 p-2'>{index + 1}</td>
                                <td className='border border border-gray-300 p-2'>{product.name}</td>
                                <td className='border border border-gray-300 p-2'>{product.categoryId?.categoryName}</td>
                                <td className='border border border-gray-300 p-2'>{product.price}</td>
                                <td className='border border border-gray-300 p-2'>
                                    <span className='rounded-full font-semibold'>
                                        {product.stock == 0 ? (
                                            <span className='bg-red-100 text-red-500 px-2 py-1 rounded-full'>{product.stock}</span>
                                        ) : product.stock < 5 ? (
                                            <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>{product.stock}</span>
                                        ) : (<span className='bg-green-100 text-green-500 px-2 py-1 rounded-full'>{product.stock}</span>)
                                        }
                                    </span>
                                </td>
                                <td className='border border border-gray-300 p-2 flex gap-2'>
                                    <button
                                    onClick={() => handleOrderChange(product)}
                                        className='px-2 py-1 bg-green-500 hover:bg-green-700 text-white rounded cursor-pointer'
                                    >
                                        Order
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <div className='text-center p-4'>No products found.</div>}
            </div>
            
            {openModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded shadow-md w-1/3 relative'>
                        <h1 className='text-xl font-bold'>
                            Place order
                        </h1>
                        <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer' onClick={() => setOpenModal(false)}>X</button>
                        <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                            <input
                                type="number"
                                name="quantity"
                                value={orderData.quantity}
                                onChange={increaseQuantity}
                                min="1"
                                placeholder='Increase Quantity'
                                className='border p-1 bg-white rounded px-4'
                            />

                            <p>Total: {orderData.total}</p>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className='px-4 py-2 bg-blue-500 text-white rounded'
                                >
                                    Save Changes
                                </button>


                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className='px-4 py-2 bg-red-500 text-white rounded'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)}
        </div>
    )
}

export default CustomerProducts
