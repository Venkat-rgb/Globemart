import { useEffect, useState } from "react";
import lodash from "lodash";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import MetaData from "../../MetaData";
import { CircularProgress } from "@mui/material";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../../redux/features/products/productsApiSlice";
import toast from "react-hot-toast";
import ProductFormData from "./ProductFormData";
import Button from "../../UI/Button";
import Loader from "../../UI/Loader";
import ErrorUI from "../../UI/ErrorUI";

const CreateAndUpdateProduct = ({ role }) => {
  const { productId } = useParams();

  // Only fetch data when we want to update product and not while creating product
  const {
    data: productData,
    isFetching: isProductLoading,
    isError: productError,
  } = useGetProductQuery(productId, {
    skip: !productId,
  });

  // Product form details
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    productFeatures: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
  });

  const [imgData, setImgData] = useState([]);

  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdateProductLoading }] =
    useUpdateProductMutation();

  const {
    title,
    description,
    productFeatures,
    category,
    price,
    discount,
    stock,
  } = productDetails;

  const didImagesChange = productData?.product && productData?.product?.images;

  // Previous Product details from database before updating 'form' values
  const prevProductDetails = {
    title: productData?.product?.title,
    description: productData?.product?.description,
    productFeatures: productData?.product?.productFeatures,
    category: productData?.product?.category,
    price: productData?.product?.price,
    discount: productData?.product?.discount,
    stock: productData?.product?.stock,
  };

  const createOrUpdateProductHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("productFeatures", productFeatures);
      formData.set("category", category);
      formData.set("price", price);
      formData.set("discount", discount);
      formData.set("stock", stock);
      role === "Update" && formData.set("productId", productId);

      if (role === "Update") {
        // Updating the details of exisiting product
        /*
        
        -> Here we are checking the below condition bcz if we are not providing new images while updating then we should not send previous images again to get stored in cloudinary. 

        -> Here isEqual checks whether 2 primitive types (or) non-primitive types are equal (or) not by doing deep cloning.
        */

        if (!lodash.isEqual(didImagesChange, imgData)) {
          imgData.forEach((image) => {
            formData.append("images", image);
          });
        }

        // Making api request only when user updated productDetails
        if (!lodash.isEqual(prevProductDetails, productDetails)) {
          const res = await updateProduct(formData).unwrap();

          toast.success(res?.message);
        }
      } else {
        // Creating new product

        // Appending new images
        imgData.forEach((image) => {
          formData.append("images", image);
        });

        // Making API request to create new product
        const res = await createProduct(formData).unwrap();

        // Displaying toast for product created successfully
        toast.success(res?.message);

        // Resetting form values
        setProductDetails({
          title: "",
          description: "",
          productFeatures: "",
          category: "",
          price: "",
          discount: "",
          stock: "",
        });
        setImgData([]);
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message);
    }
  };

  // Reading images and storing base64encoded values in imgData array
  const readImage = (image) => {
    const reader = new FileReader();

    // Reading the image, once readAsDataURL method has been called below
    reader.onload = () => {
      // readyState = 2 means, image has been read successfully
      if (reader.readyState === 2) {
        setImgData((prev) => [...prev, reader.result]);
      }
    };

    // Passing the image as argument to get base64encoded format
    reader.readAsDataURL(image);
  };

  const changeHandler = (e) => {
    // Storing multiple image files in imgData array
    if (e.target.name === "images") {
      setImgData([]);
      const selectedImages = Array.from(e.target.files);
      selectedImages.forEach((image) => readImage(image));
    } else if (
      e.target.name === "stock" ||
      e.target.name === "price" ||
      e.target.name === "discount"
    ) {
      // Converting input value like stock, price, discount, into number
      setProductDetails({
        ...productDetails,
        [e.target.name]: Number(e.target.value),
      });
    } else {
      setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }
  };

  // Storing the productDetails from the database into productDetails state only during updation of product
  useEffect(() => {
    if (productData?.product) {
      setProductDetails({
        title: productData.product?.title,
        description: productData.product?.description,
        productFeatures: productData.product?.productFeatures,
        category: productData.product?.category,
        price: productData.product?.price,
        discount: productData.product?.discount,
        stock: productData.product?.stock,
      });
      setImgData(productData.product?.images);
    }
  }, [productData?.product]);

  // Displaying Loading screen while products are being fetched
  if (isProductLoading) {
    return <Loader styleProp="flex items-center justify-center h-[90vh]" />;
  }

  return (
    <Layout>
      <MetaData
        title={`Dashboard | Product | ${
          role === "Create" ? "Create" : "Update"
        }`}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.15 }}
      >
        <div className="p-3 drop-shadow-xl bg-neutral-50 space-y-5 rounded-lg mx-auto max-w-2xl my-10">
          <p className="font-public-sans text-2xl max-[500px]:text-xl text-neutral-500 text-center font-semibold">
            {role === "Create" ? "Create Product" : "Update Product"}
          </p>

          {/* Showing errMsg, if an error occured during fetching existing product details */}
          {productError && (
            <ErrorUI message="Unable to fetch product details due to some error!" />
          )}

          <form
            onSubmit={createOrUpdateProductHandler}
            className="font-inter w-full space-y-3"
            encType="multipart/form-data"
          >
            {/* Contains all form input fields for product */}
            <ProductFormData
              title={title}
              description={description}
              productFeatures={productFeatures}
              category={category}
              price={price}
              discount={discount}
              stock={stock}
              imgData={imgData}
              changeHandler={changeHandler}
            />

            {/* Create (or) Update product buttons with their loading values */}
            <div>
              <Button
                isLoading={
                  role === "Create"
                    ? isCreateProductLoading
                    : isUpdateProductLoading
                }
                moreStyles="w-full"
              >
                {(
                  role === "Create"
                    ? isCreateProductLoading
                    : isUpdateProductLoading
                ) ? (
                  <div className="flex items-center  justify-center gap-2">
                    <p className="text-neutral-300 font-medium">
                      {role === "Create"
                        ? "Creating Product"
                        : "Updating Product"}
                    </p>
                    <CircularProgress sx={{ color: "#cccccc" }} size={22} />
                  </div>
                ) : role === "Create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CreateAndUpdateProduct;

// import { useEffect, useState } from "react";
// import lodash from "lodash";
// import { motion } from "framer-motion";
// import { useParams } from "react-router-dom";
// import Layout from "./Layout";
// import MetaData from "../MetaData";
// import { CircularProgress } from "@mui/material";
// import {
//   useCreateProductMutation,
//   useGetProductQuery,
//   useUpdateProductMutation,
// } from "../../redux/features/products/productsApiSlice";
// import toast from "react-hot-toast";
// import ProductFormData from "./ProductFormData";
// import Button from "../Button";

// const CreateAndUpdateProduct = ({ role }) => {
//   const { productId } = useParams();

//   // Only fetch data when we want to update product and not while creating product
//   const { data: productData } = useGetProductQuery(productId, {
//     skip: !productId,
//   });

//   console.log("admin product data result: ", productData);

//   const [productDetails, setProductDetails] = useState({
//     title: "",
//     description: "",
//     productFeatures: "",
//     category: "",
//     price: "",
//     discount: "",
//     color: "",
//     size: "",
//     stock: "",
//   });

//   const [imgData, setImgData] = useState([]);

//   const [createProduct, { isLoading: isCreateProductLoading }] =
//     useCreateProductMutation();
//   const [updateProduct, { isLoading: isUpdateProductLoading }] =
//     useUpdateProductMutation();

//   const {
//     title,
//     description,
//     productFeatures,
//     category,
//     price,
//     discount,
//     color,
//     size,
//     stock,
//   } = productDetails;

//   const didImagesChange = productData?.product && productData?.product?.images;

//   const createOrUpdateProductHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.set("title", title);
//       formData.set("description", description);
//       formData.set("productFeatures", productFeatures);
//       formData.set("category", category);
//       formData.set("price", price);
//       formData.set("discount", discount);
//       formData.set("stock", stock);
//       role === "Update" && formData.set("productId", productId);

//       // formData.set("color", color);
//       // formData.set("size", size);

//       if (role === "Update") {
//         /*

//         -> Here we are checking the below condition bcz if we are not providing new images while updating then we should not send previous images again to get stored in cloudinary.

//         -> Here isEqual checks whether 2 primitive types (or) non-primitive types are equal (or) not by doing deep cloning.
//         */

//         console.log("This is update condition!");

//         if (!lodash.isEqual(didImagesChange, imgData)) {
//           console.log("Both images are not equal!");
//           imgData.forEach((image) => {
//             formData.append("images", image);
//           });
//         }

//         const res = await updateProduct(formData).unwrap();

//         toast.success(res?.message);

//         console.log("update product result: ", res);
//       } else {
//         console.log("This is create condition!");

//         imgData.forEach((image) => {
//           formData.append("images", image);
//         });

//         const res = await createProduct(formData).unwrap();

//         console.log("create product result: ", res);

//         toast.success(res?.message);
//         setProductDetails({
//           title: "",
//           description: "",
//           productFeatures: "",
//           category: "",
//           price: "",
//           discount: "",
//           color: "",
//           size: "",
//           stock: "",
//         });
//         setImgData([]);
//       }
//     } catch (err) {
//       toast.error(err?.message || err?.data?.message);
//     }
//   };

//   const readImage = (image) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setImgData((prev) => [...prev, reader.result]);
//       }
//     };

//     reader.readAsDataURL(image);
//   };

//   const changeHandler = (e) => {
//     if (e.target.name === "images") {
//       setImgData([]);
//       const selectedImages = Array.from(e.target.files);
//       selectedImages.forEach((image) => readImage(image));
//     } else if (
//       e.target.name === "stock" ||
//       e.target.name === "price" ||
//       e.target.name === "discount"
//     ) {
//       setProductDetails({
//         ...productDetails,
//         [e.target.name]: Number(e.target.value),
//       });
//     } else {
//       setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
//     }
//   };

//   useEffect(() => {
//     if (productData?.product) {
//       setProductDetails({
//         title: productData.product.title,
//         description: productData.product.description,
//         productFeatures: productData.product.productFeatures,
//         category: productData.product.category,
//         price: productData.product.price,
//         discount: productData.product.discount,
//         color: "",
//         size: "",
//         stock: productData.product.stock,
//       });
//       setImgData(productData.product.images);
//     }
//   }, [productData?.product]);

//   return (
//     <Layout>
//       <MetaData
//         title={`Dashboard | Product | ${
//           role === "Create" ? "Create" : "Update"
//         }`}
//       />
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{ delay: 0.15 }}
//       >
//         <div className="p-3 drop-shadow-xl bg-neutral-50 space-y-5 rounded-lg mx-auto max-w-2xl my-10">
//           <p className="font-public-sans text-2xl text-neutral-500 text-center font-semibold">
//             {role === "Create" ? "Create Product" : "Update Product"}
//           </p>
//           <form
//             onSubmit={createOrUpdateProductHandler}
//             className="font-inter w-full space-y-3"
//             encType="multipart/form-data"
//           >
//             <ProductFormData
//               title={title}
//               description={description}
//               productFeatures={productFeatures}
//               category={category}
//               price={price}
//               discount={discount}
//               color={color}
//               size={size}
//               stock={stock}
//               imgData={imgData}
//               changeHandler={changeHandler}
//             />

//             <div>
//               <Button
//                 isLoading={
//                   role === "Create"
//                     ? isCreateProductLoading
//                     : isUpdateProductLoading
//                 }
//               >
//                 {(
//                   role === "Create"
//                     ? isCreateProductLoading
//                     : isUpdateProductLoading
//                 ) ? (
//                   <div className="flex items-center  justify-center gap-2">
//                     <p className="text-neutral-300 font-medium">
//                       {role === "Create"
//                         ? "Creating Product"
//                         : "Updating Product"}
//                     </p>
//                     <CircularProgress sx={{ color: "#cccccc" }} size={22} />
//                   </div>
//                 ) : role === "Create" ? (
//                   "Create"
//                 ) : (
//                   "Update"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </Layout>
//   );
// };

// export default CreateAndUpdateProduct;

// {
/* <motion.button
                className="text-white py-2 bg-[#7451f8] rounded w-full flex items-center justify-center"
                whileTap={{ scale: 0.97 }}
                disabled={
                  role === "Create"
                    ? isCreateProductLoading
                    : isUpdateProductLoading
                }
              >
                {(
                  role === "Create"
                    ? isCreateProductLoading
                    : isUpdateProductLoading
                ) ? (
                  <div className="flex items-center  justify-center gap-2">
                    <p className="text-neutral-300 font-medium">
                      {role === "Create"
                        ? "Creating Product"
                        : "Updating Product"}
                    </p>
                    <CircularProgress sx={{ color: "#cccccc" }} size={22} />
                  </div>
                ) : role === "Create" ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </motion.button> */
// }
